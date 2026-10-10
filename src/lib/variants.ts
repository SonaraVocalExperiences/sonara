/**
 * Design variants on trial, each picked per request by a query parameter (`/?hero=shell`), so any
 * of them can be opened, or sent to the owner, as a link. The first option is the default.
 */
const variants = {
  hero: ['plain', 'shell'],
} as const satisfies Record<string, readonly [string, ...string[]]>;

type Variants = typeof variants;
type VariantName = keyof Variants;

/** The option of `name` that `url` asks for, or its default. */
export function variantOf<N extends VariantName>(url: URL, name: N): Variants[N][number] {
  const options: readonly Variants[N][number][] = variants[name];
  return options.find((option) => option === url.searchParams.get(name)) ?? variants[name][0];
}

/** `path` with the non-default variants `url` asks for, so links to other pages keep them. */
export function withVariants(path: string, url: URL): string {
  const params = new URLSearchParams();
  for (const name of Object.keys(variants) as VariantName[]) {
    const option = variantOf(url, name);
    if (option !== variants[name][0]) params.set(name, option);
  }
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}
