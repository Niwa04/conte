import { Injectable, computed, signal } from '@angular/core';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

interface RuntimeConfig {
  supabaseUrl: string;
  supabasePublishableKey: string;
}

/**
 * Connexion partagée avec l'application Unity et le studio :
 * même projet Supabase, donc mêmes comptes (auth.users) et mêmes profils lecteur.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private client?: SupabaseClient;
  private cle = '';
  private urlSupabase = '';
  private initialisation?: Promise<void>;

  readonly utilisateur = signal<User | null>(null);
  readonly connecte = computed(() => this.utilisateur() !== null);

  readonly nom = computed(() => {
    const meta = this.utilisateur()?.user_metadata ?? {};
    return (meta['full_name'] ?? meta['name'] ?? this.utilisateur()?.email ?? '') as string;
  });

  readonly avatar = computed(() => {
    const meta = this.utilisateur()?.user_metadata ?? {};
    return (meta['avatar_url'] ?? meta['picture'] ?? null) as string | null;
  });

  initialiser(): Promise<void> {
    return (this.initialisation ??= this.creerClient());
  }

  async connecterAvecGoogle(): Promise<void> {
    await this.initialiser();
    const { error } = await this.client!.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/connexion/callback`,
        queryParams: { prompt: 'select_account' }
      }
    });
    if (error) throw error;
  }

  /** Termine la connexion Google : échange le code PKCE reçu dans l'URL contre une session. */
  async terminerConnexion(): Promise<void> {
    await this.initialiser();
    const params = new URLSearchParams(window.location.search);
    const erreurFournisseur = params.get('error_description') ?? params.get('error');
    if (erreurFournisseur) throw new Error(erreurFournisseur);

    const code = params.get('code');
    if (code) {
      const { error } = await this.client!.auth.exchangeCodeForSession(code);
      if (error) throw error;
    }
    const { data, error } = await this.client!.auth.getSession();
    if (error) throw error;
    if (!data.session) throw new Error('Aucune session n’a été créée. Réessaie de te connecter.');
    this.utilisateur.set(data.session.user);
  }

  /** Client Supabase initialisé, pour appeler les fonctions de l'application avec le compte connecté. */
  async obtenirClient(): Promise<SupabaseClient> {
    await this.initialiser();
    return this.client!;
  }

  /**
   * Appelle une fonction Supabase de l'application avec le jeton du compte.
   * On n'utilise pas functions.invoke : il ajoute l'en-tête x-client-info, que ces fonctions
   * n'autorisent pas pour les navigateurs (CORS). Seuls Authorization et apikey sont envoyés.
   */
  async appelerFonction<T>(nom: string): Promise<T> {
    const reponse = await this.requeteProtegee(`${this.urlSupabase}/functions/v1/${nom}`);
    if (!reponse.ok) throw new Error(`Fonction ${nom} : erreur ${reponse.status}.`);
    return (await reponse.json()) as T;
  }

  /** Télécharge une ressource protégée (ex. image de carte) avec le jeton du compte et renvoie une URL locale. */
  async telechargerProtege(url: string): Promise<string> {
    const reponse = await this.requeteProtegee(url);
    if (!reponse.ok) throw new Error('Image indisponible.');
    return URL.createObjectURL(await reponse.blob());
  }

  private async requeteProtegee(url: string): Promise<Response> {
    const client = await this.obtenirClient();
    const { data } = await client.auth.getSession();
    const jeton = data.session?.access_token;
    if (!jeton) throw new Error('Session expirée.');
    return fetch(url, { headers: { Authorization: `Bearer ${jeton}`, apikey: this.cle } });
  }

  async deconnecter(): Promise<void> {
    await this.initialiser();
    await this.client!.auth.signOut();
    this.utilisateur.set(null);
  }

  private async creerClient(): Promise<void> {
    const reponse = await fetch('/app-config.json', { cache: 'no-store' });
    if (!reponse.ok) throw new Error('La configuration de connexion est introuvable.');
    const config = (await reponse.json()) as RuntimeConfig;
    if (!config.supabaseUrl || !config.supabasePublishableKey) {
      throw new Error('La configuration de connexion est incomplète.');
    }

    this.cle = config.supabasePublishableKey;
    this.urlSupabase = config.supabaseUrl.replace(/\/$/, '');
    this.client = createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { flowType: 'pkce', detectSessionInUrl: false, persistSession: true, autoRefreshToken: true }
    });

    const { data } = await this.client.auth.getSession();
    this.utilisateur.set(data.session?.user ?? null);

    // Le listener ne fait que mettre à jour le signal : pas d'appel Supabase ici (verrou d'auth).
    this.client.auth.onAuthStateChange((_evenement, session) => {
      this.utilisateur.set(session?.user ?? null);
    });
  }
}
