/* Opis iz admina (editor) je HTML. Na sajt ide samo ono što editor pravi: pasusi, podebljano, iskošeno,
 * podnaslov, liste i prelom - bez atributa, skripti i stilova. */

const ALLOWED = new Set(["p", "br", "strong", "b", "em", "i", "h3", "ul", "ol", "li"]);

export const looksLikeHtml = (value: string | null | undefined) => !!value && /<[a-z][\s\S]*>/i.test(value);

export function sanitizeHtml(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?([a-z0-9]+)[^>]*>/gi, (tag, name: string) => {
      const n = name.toLowerCase();
      if (!ALLOWED.has(n)) return "";
      return tag.startsWith("</") ? `</${n}>` : n === "br" ? "<br>" : `<${n}>`;
    })
    .replace(/<p>\s*<\/p>/g, "")
    .trim();
}
