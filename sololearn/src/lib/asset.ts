// Adds the base path (e.g. /sololearn) to files served from /public.
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
