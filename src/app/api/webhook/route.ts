// Webhook de WhatsApp: Meta llama a esta ruta (/api/webhook).
// GET  = Meta verifica que el webhook es tuyo (solo una vez, al configurarlo).
// POST = Meta te avisa que llegó un mensaje nuevo.
import { after } from "next/server";
import { enviarTexto, firmaEsValida } from "@/lib/whatsapp";

// --- Verificación del webhook ---
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const modo = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const reto = params.get("hub.challenge");

  // Si el token coincide con el nuestro, regresamos el "reto" que mandó Meta
  if (modo === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(reto ?? "", { status: 200 });
  }
  return new Response("Token de verificación incorrecto", { status: 403 });
}

// Forma (simplificada) de lo que manda Meta cuando llega un mensaje
type AvisoDeMeta = {
  entry?: {
    changes?: {
      value?: {
        messages?: { from: string; type: string; text?: { body: string } }[];
      };
    }[];
  }[];
};

// --- Mensajes entrantes ---
export async function POST(request: Request) {
  // Leemos el cuerpo como texto porque la firma se calcula sobre el texto exacto
  const cuerpo = await request.text();

  if (!firmaEsValida(cuerpo, request.headers.get("x-hub-signature-256"))) {
    console.error("Webhook: firma inválida, se ignora la petición");
    return new Response("Firma inválida", { status: 401 });
  }

  let aviso: AvisoDeMeta;
  try {
    aviso = JSON.parse(cuerpo);
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  // Juntamos los mensajes de texto (Meta también manda avisos de "leído", etc.)
  const mensajes =
    aviso.entry?.flatMap((e) =>
      (e.changes ?? []).flatMap((c) => c.value?.messages ?? []),
    ) ?? [];

  // Respondemos 200 rápido a Meta y contestamos después,
  // para que Meta no piense que falló y reenvíe el mensaje.
  after(async () => {
    for (const mensaje of mensajes) {
      if (mensaje.type !== "text" || !mensaje.text) continue;
      try {
        // Bot eco: respondemos el mismo texto que nos escribieron
        await enviarTexto(mensaje.from, mensaje.text.body);
      } catch (error) {
        console.error("Webhook: no se pudo responder el mensaje", error);
      }
    }
  });

  return new Response("OK", { status: 200 });
}
