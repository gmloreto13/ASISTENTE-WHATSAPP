// Funciones para hablar con WhatsApp Cloud API (Meta).
import crypto from "node:crypto";

// Versión de la API de Meta que usamos. Si Meta la retira, se cambia aquí.
const VERSION_API = "v23.0";

// Revisa que el mensaje de verdad venga de Meta.
// Meta firma el cuerpo con tu App Secret y manda la firma en el
// encabezado "X-Hub-Signature-256" con el formato "sha256=<firma>".
export function firmaEsValida(cuerpo: string, firma: string | null): boolean {
  const secreto = process.env.WHATSAPP_APP_SECRET;
  if (!secreto || !firma) return false;

  const esperada =
    "sha256=" +
    crypto.createHmac("sha256", secreto).update(cuerpo, "utf8").digest("hex");

  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  // timingSafeEqual evita que alguien adivine la firma midiendo tiempos
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// WhatsApp entrega los números de México como "521" + 10 dígitos (con un 1
// extra), pero para enviar Meta espera "52" + 10 dígitos. Aquí quitamos ese 1.
export function normalizarNumero(numero: string): string {
  if (numero.startsWith("521") && numero.length === 13) {
    return "52" + numero.slice(3);
  }
  return numero;
}

// Envía un mensaje de texto a un número de WhatsApp.
export async function enviarTexto(para: string, texto: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new Error("Faltan WHATSAPP_TOKEN o WHATSAPP_PHONE_NUMBER_ID en .env.local");
  }

  const respuesta = await fetch(
    `https://graph.facebook.com/${VERSION_API}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: normalizarNumero(para),
        type: "text",
        text: { body: texto },
      }),
    },
  );

  if (!respuesta.ok) {
    throw new Error(
      `WhatsApp respondió ${respuesta.status}: ${await respuesta.text()}`,
    );
  }
}
