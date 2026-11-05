import { revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/catalog";

/* Backend zove ovu rutu posle izmene u adminu (artikli, cene, grupe…): POST sa zaglavljem x-revalidate-secret.
 * Tajna je ista kao SHOP_REVALIDATE_SECRET u backendu (ovde REVALIDATE_SECRET). */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ ok: false }, { status: 401 });
  }
  revalidateTag(CATALOG_TAG, { expire: 0 });
  return Response.json({ ok: true, at: new Date().toISOString() });
}
