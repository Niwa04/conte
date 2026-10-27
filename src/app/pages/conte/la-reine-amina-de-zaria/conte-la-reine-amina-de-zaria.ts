import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  hausa: string;
  prononce: string;
  sens: string;
}

/**
 * Page de La Reine Amina de Zaria (Nigeria).
 * Parti pris : la carte des deux chemins. Des adversaires barrent la route devant une ville ;
 * on envoie les cavaliers par la gauche et par la droite, au même signal, comme Amina.
 */
@Component({
  selector: 'app-conte-la-reine-amina-de-zaria',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-la-reine-amina-de-zaria.html',
  styleUrl: './conte-la-reine-amina-de-zaria.scss'
})
export default class ConteAmina extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { hausa: 'Sarauniya', prononce: 'sa-ra-ou-ni-ya', sens: 'la reine' },
    { hausa: 'Ganuwa', prononce: 'ga-nou-wa', sens: 'le mur, le rempart' },
    { hausa: 'Doki', prononce: 'do-ki', sens: 'le cheval' }
  ];

  protected readonly gauche = signal(false);
  protected readonly droite = signal(false);
  protected readonly libre = computed(() => this.gauche() && this.droite());
  protected readonly message = computed(() => {
    if (this.libre()) return 'Au même signal, les deux colonnes surgissent sur les côtés. Les adversaires quittent la route : la ville est libre.';
    if (this.gauche() || this.droite()) return 'Une colonne est en place. Les adversaires ne bougent pas encore : il faut que l’autre arrive aussi.';
    return 'Les adversaires barrent la route devant la ville. Les passer de front serait trop dangereux. Envoie les cavaliers par les deux chemins.';
  });

  protected envoyer(cote: 'gauche' | 'droite'): void {
    (cote === 'gauche' ? this.gauche : this.droite).set(true);
  }

  protected recommencer(): void {
    this.gauche.set(false);
    this.droite.set(false);
  }
}
