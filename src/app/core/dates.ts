/** Date longue en français (« 12 novembre 2026 »), ou chaîne vide si absente ou invalide. */
export function dateLongue(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
