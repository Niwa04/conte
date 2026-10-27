import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  luganda: string;
  prononce: string;
  sens: string;
}

interface Marche {
  titre: string;
  texte: string;
  page: number;
  niveau: string;
}

/**
 * Page de Kintu et la fille du Ciel (Ouganda).
 * Parti pris : la terre et le ciel. On monte l'escalier de nuages marche après marche ;
 * le paysage passe peu à peu du vert de la terre à l'or du Ciel, au rythme des épreuves.
 */
@Component({
  selector: 'app-conte-kintu-et-la-fille-du-ciel',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-kintu-et-la-fille-du-ciel.html',
  styleUrl: './conte-kintu-et-la-fille-du-ciel.scss'
})
export default class ConteKintu extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { luganda: 'Ggulu', prononce: 'gou-lou', sens: 'le Ciel' },
    { luganda: 'Ente', prononce: 'èn-té', sens: 'la vache' },
    { luganda: 'Kabaka', prononce: 'ka-ba-ka', sens: 'le roi' }
  ];

  protected readonly marches: Marche[] = [
    { niveau: 'Sur la terre', titre: 'Un homme, une vache', texte: 'Au début du monde, Kintu marche seul sous un grand ciel. Il n’a ni maison ni voisins, seulement sa vache.', page: 1 },
    { niveau: 'Sur la terre', titre: 'Les enfants du Ciel', texte: 'Nambi, la fille du roi Gulu, descend jouer sur la terre. Elle voit Kintu parler doucement à sa vache, et elle ne l’oublie pas.', page: 2 },
    { niveau: 'Dans les nuages', titre: 'L’escalier de nuages', texte: 'La vache a disparu. Ses traces montent, montent, jusqu’au ciel, où Nambi attend au pied d’un escalier de lumière.', page: 4 },
    { niveau: 'Au Ciel', titre: 'Première épreuve : le festin', texte: 'Cent hommes n’auraient pas tout mangé. Kintu regarde les plats, puis le sol de la hutte, et il trouve une idée.', page: 5 },
    { niveau: 'Au Ciel', titre: 'Deuxième épreuve : la rosée', texte: 'Remplir une jarre avec des gouttes de rosée avant le lever du soleil. Il suffit de patience, une feuille après l’autre.', page: 6 },
    { niveau: 'Au Ciel', titre: 'Troisième épreuve : cent vaches', texte: 'Elles se ressemblent toutes. Une abeille bourdonne à son oreille et se pose sur la corne de la bonne : Nambi veille.', page: 7 },
    { niveau: 'Dans les nuages', titre: 'Ne jamais revenir en arrière', texte: 'Le roi Gulu bénit le couple et donne un conseil : descendre vite, sans jamais se retourner. Mais certains oublis coûtent cher.', page: 9 }
  ];

  protected readonly etape = signal(0);
  protected readonly marche = computed(() => this.marches[this.etape()]);
  /** Part de ciel (0 = terre, 1 = ciel) : sert au fondu entre les deux paysages. */
  protected readonly altitude = computed(() => {
    const e = this.etape();
    const n = this.marches.length - 1;
    return Math.min(1, e / (n - 1.5));
  });

  protected aller(i: number): void {
    this.etape.set(Math.min(Math.max(i, 0), this.marches.length - 1));
  }

  protected suivante(): void {
    this.aller(this.etape() + 1);
  }

  protected precedente(): void {
    this.aller(this.etape() - 1);
  }
}
