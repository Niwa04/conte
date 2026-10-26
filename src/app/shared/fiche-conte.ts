import { Component, input } from '@angular/core';
import { type InfoConte } from '../data/contes';

/** « En un coup d'œil » : la fiche pratique du conte (origine avec drapeau, âge, durée…). Variables : --fc-fond, --fc-texte, --fc-accent. */
@Component({
  selector: 'app-fiche-conte',
  template: `
    <table class="fiche">
      <caption>
        <span class="serie">Fiche de lecture · La Maison des Contes</span>
        <span class="titre">{{ titre() }}</span>
      </caption>
      <tbody>
        @for (info of infos(); track info.libelle) {
          <tr>
            <th scope="row">{{ info.libelle }}</th>
            <td>
              <span [class.attente]="info.ton === 'attente'" [class.ok]="info.ton === 'ok'">
                @if (info.drapeau) { <img [src]="info.drapeau" alt="" width="300" height="200"> }
                {{ info.valeur }}
              </span>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    :host { display: block; }
    .fiche {
      width: 100%; border-collapse: collapse; padding: 1rem 1.4rem;
      background: var(--fc-fond, #fff6e3); color: var(--fc-texte, #1d2a4d);
      border: 3px solid var(--fc-accent, #d9a93a); border-radius: 8px;
      box-shadow: inset 0 0 0 4px var(--fc-fond, #fff6e3), inset 0 0 0 5px var(--fc-liseré, rgb(217 169 58 / 0.6)), 0 14px 28px rgb(0 0 0 / 0.4);
      text-align: left;
    }
    caption { display: grid; gap: 0.2rem; padding: 1.1rem 1rem 0.4rem; background: var(--fc-fond, #fff6e3); color: var(--fc-texte, #1d2a4d); border: 3px solid var(--fc-accent, #d9a93a); border-bottom: 0; border-radius: 8px 8px 0 0; }
    .serie { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--fc-accent-texte, #9b6d14); font-weight: 700; }
    .titre { font-family: var(--police-titre); font-size: 1.5rem; font-weight: 700; }
    th, td { padding: 0.7rem 1.1rem; border-bottom: 1px dashed rgb(0 0 0 / 0.25); }
    tr:last-child th, tr:last-child td { border-bottom: 0; }
    th { width: 42%; font-weight: 700; color: var(--fc-accent-texte, #9b6d14); }
    img { width: 30px; height: auto; margin-right: 0.6rem; vertical-align: -3px; border-radius: 3px; border: 1px solid rgb(0 0 0 / 0.35); }
    .attente { font-style: italic; opacity: 0.8; }
    .ok { padding: 0.1rem 0.6rem; border-radius: 999px; background: #d9f0c8; color: #24501a; font-weight: 700; }
  `
})
export class FicheConteBloc {
  readonly titre = input.required<string>();
  readonly infos = input.required<InfoConte[]>();
}
