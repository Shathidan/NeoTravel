/* ═══════════════════════════════════════════════════════════════════════
   CONNEXION N8N — ASSISTANT DE DEVIS
   ---------------------------------------------------------------------
   Requête envoyée (POST, JSON) à chaque message :
     { message: string, sessionId: string, history: ChatTurn[] }

   - sessionId : identifiant stable généré une fois par visite (sert à
     brancher un node "Memory" / "Simple Memory" côté n8n pour que le
     workflow garde le contexte de la conversation).
   - history   : les échanges précédents, au cas où ton workflow préfère
     reconstruire le contexte lui-même plutôt que de gérer une mémoire.

   Réponse attendue du workflow (JSON, via un node "Respond to Webhook") :
     {
       reply: string,        // texte à afficher dans le chat
       depart?: string,
       destination?: string,
       passagers?: number,
       vehicule?: string,
       distance?: number,
       prix?: number,
       pdfUrl?: string        // lien du devis PDF si déjà généré
     }

   Le parseur ci-dessous accepte plusieurs noms de champs possibles
   (depart/origine/ville_depart, prix/montant/montant_ttc, etc.) pour
   rester compatible quelle que soit la nomenclature exacte choisie
   dans ton workflow. Une fois celui-ci figé, tu peux simplifier
   FIELD_ALIASES ci-dessous pour ne garder que les vrais noms utilisés.
═══════════════════════════════════════════════════════════════════════ */

export const N8N_WEBHOOK_URL =
  "https://orlanemouafo.app.n8n.cloud/webhook/76837bce-7c52-4e2f-badb-e0906c4bc5d3";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface TripData {
  depart: string | null;
  destination: string | null;
  passagers: number | null;
  vehicule: string | null;
  distance: number | null;
  prix: number | null;
  pdfUrl: string | null;
}

export interface AssistantResult {
  reply: string;
  trip: Partial<TripData>;
}

function pick(obj: Record<string, unknown> | null | undefined, keys: string[]): unknown {
  if (!obj) return null;
  for (const k of keys) {
    const v = obj[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return null;
}

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? parseFloat(v.replace(",", ".")) : (v as number);
  return Number.isFinite(n) ? n : null;
}

function strOrNull(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  return String(v);
}

export async function askAssistant(
  message: string,
  sessionId: string,
  history: ChatTurn[],
): Promise<AssistantResult> {
  const res = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId, history }),
  });

  if (!res.ok) {
    throw new Error(`Le workflow n8n a répondu avec le statut ${res.status}`);
  }

  const raw: unknown = await res.json().catch(() => null);
  // certains nodes "Respond to Webhook" renvoient un tableau [{ ... }]
  const data = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown> | null;

  if (!data) throw new Error("Réponse vide du workflow n8n");

  const reply = strOrNull(pick(data, ["reply", "message", "text", "output", "response"]))
    ?? "Votre demande a bien été reçue.";

  const trip: Partial<TripData> = {
    depart: strOrNull(pick(data, ["depart", "origine", "ville_depart", "departure"])),
    destination: strOrNull(pick(data, ["destination", "ville_arrivee", "arrival"])),
    passagers: numOrNull(pick(data, ["passagers", "nombre_passagers", "pax", "passengers"])),
    vehicule: strOrNull(pick(data, ["vehicule", "type_vehicule", "vehicle"])),
    distance: numOrNull(pick(data, ["distance", "distance_km", "distance_estimee"])),
    prix: numOrNull(pick(data, ["prix", "montant", "montant_ttc", "price", "total"])),
    pdfUrl: strOrNull(pick(data, ["pdfUrl", "pdf_url", "devis_url", "url_pdf", "lien_pdf"])),
  };

  return { reply, trip };
}

export function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `nt-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Fusionne les nouvelles données extraites dans le billet courant,
 *  en ne remplaçant que les champs effectivement renvoyés par n8n. */
export function mergeTrip(prev: TripData, patch: Partial<TripData>): TripData {
  return {
    depart: patch.depart ?? prev.depart,
    destination: patch.destination ?? prev.destination,
    passagers: patch.passagers ?? prev.passagers,
    vehicule: patch.vehicule ?? prev.vehicule,
    distance: patch.distance ?? prev.distance,
    prix: patch.prix ?? prev.prix,
    pdfUrl: patch.pdfUrl ?? prev.pdfUrl,
  };
}
