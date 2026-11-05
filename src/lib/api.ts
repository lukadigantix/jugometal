/* Backend API (jugometal-backend): katalog, korpa, porudžbine, upiti.
 * Adresa se podešava u .env.local (NEXT_PUBLIC_API_URL); bez nje važi lokalni backend. */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005/api/v1").replace(/\/$/, "");

export class ApiError extends Error {}

/** POST sa JSON telom; vraća `data` iz odgovora ili baca ApiError sa porukom servera. */
export async function postJson<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Veza sa serverom nije uspela. Proverite internet ili nas pozovite telefonom.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(String(json?.message ?? "Došlo je do greške. Pokušajte ponovo."));
  return json.data as T;
}

/* ── Upiti sa formi (kontakt, servis, subvencije, ponuda) ──────────────────── */

export type InquiryType = "kontakt" | "servis" | "subvencija" | "ponuda";

export type InquiryInput = {
  type: InquiryType;
  name: string;
  phone?: string;
  email?: string;
  message: string;
  productId?: string;
  productName?: string;
  location?: string;
  extra?: Record<string, string>;
};

/** Šalje upit u admin (Upiti sa sajta) i mejlom prodavnici. */
export function sendInquiry(input: InquiryInput) {
  const clean = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined && v !== ""));
  return postJson<{ id: string }>("/shop/inquiries", { ...clean, pageUrl: typeof window !== "undefined" ? window.location.href : undefined });
}
