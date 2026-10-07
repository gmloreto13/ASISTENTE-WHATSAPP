# Asistente de WhatsApp con IA

SaaS que responde el WhatsApp de pequeños negocios en México (restaurantes,
dentistas, tiendas). Cada negocio conecta su número; una IA (Claude) responde
solo con la información de ese negocio, toma pedidos o citas y avisa al dueño
cuando un cliente necesita a una persona.

Flujo: cliente escribe por WhatsApp → Meta manda el mensaje a `/api/webhook`
→ la app busca la información del negocio → Claude genera la respuesta → la app
la envía por WhatsApp Cloud API.

## Stack
- Next.js (App Router, TypeScript) + Tailwind, desplegado en Vercel
- Supabase (base de datos, login y Row Level Security)
- WhatsApp Cloud API de Meta
- API de Claude (modelo Haiku), respuestas de ~300 tokens máximo
- Stripe para la suscripción mensual

## Reglas
- Código simple y comentado en español. La dueña del proyecto es principiante:
  explica cada paso que ella deba hacer a mano.
- Nunca poner claves en el código ni en el chat: van en `.env.local`
  (ver `.env.example`).
- Mostrar el plan antes de programar cada etapa.
- Commits pequeños, uno al terminar cada etapa.
- No pasar a la siguiente etapa hasta que la anterior funcione.
- Regla de Meta: no se permiten bots de propósito general; el asistente solo
  habla de temas del negocio.

## Etapas
0. Cuentas (GitHub, Vercel, Supabase, Meta, Anthropic)
1. Proyecto base ✅
2. Webhook de WhatsApp con bot eco ✅ (falta desplegar y probar)
3. IA con la información del negocio (tablas negocios, conversaciones, mensajes)
4. Panel para el dueño (login, editar info, "Tomar control" / "Devolver a la IA")
5. Pedidos, citas y avisos al dueño (tool use)
6. Varios negocios y cobro con Stripe
7. Revisión de seguridad y aviso de privacidad

## Archivos importantes
- `src/app/api/webhook/route.ts`: recibe los mensajes de WhatsApp
- `src/lib/whatsapp.ts`: validar firma de Meta y enviar mensajes
