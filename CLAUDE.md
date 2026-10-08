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
2. Webhook de WhatsApp con bot eco ✅ (desplegado; falta conectar Meta y probar)
3. IA con la información del negocio (tablas negocios, conversaciones, mensajes)
4. Panel para el dueño (login, editar info, "Tomar control" / "Devolver a la IA")
5. Pedidos, citas y avisos al dueño (tool use)
6. Varios negocios y cobro con Stripe
7. Revisión de seguridad y aviso de privacidad

## Dónde vive el proyecto
- GitHub: https://github.com/gmloreto13/ASISTENTE-WHATSAPP
- Vercel: https://asistente-whatsapp-two.vercel.app
- Webhook para Meta: https://asistente-whatsapp-two.vercel.app/api/webhook

## Avance (7 de octubre de 2026)
Hecho:
- App creada en Meta (developers.facebook.com) con WhatsApp activado.
- Las 4 variables guardadas en Vercel y Redeploy hecho.
- Webhook verificado en Meta y suscrito al campo `messages`.
- Los mensajes sí llegan a la app (POST 200, firma válida).
- `src/lib/whatsapp.ts` quita el 1 extra de los números de México (521 → 52)
  antes de enviar.

Dónde nos quedamos (etapa 2 sin terminar): el bot eco no contesta. Meta
rechaza el envío con el error 131030 ("Recipient phone number not in allowed
list"). El número personal ya se agregó en Configuración de la API → Para,
pero el "Hello World" de prueba tampoco llega. El Administrador de WhatsApp
muestra "Cuenta restringida: tendrás que verificar tu negocio".

Pendiente para terminar la etapa 2:
1. Averiguar si la cuenta restringida es lo que bloquea los envíos: revisar
   qué mensaje exacto sale al dar "Enviar mensaje" en Configuración de la API
   y el registro más reciente en Vercel → Logs.
2. Si es eso, hacer la verificación del negocio en Meta.
3. Generar un `WHATSAPP_TOKEN` nuevo (el temporal dura 24 horas), pegarlo en
   Vercel y hacer Redeploy.
4. Cambiar la frase de `WHATSAPP_VERIFY_TOKEN` en Vercel y en Meta (la actual
   se pegó en el chat).
5. Mandar "hola" al número de prueba y confirmar que el bot eco contesta.

## Archivos importantes
- `src/app/api/webhook/route.ts`: recibe los mensajes de WhatsApp
- `src/lib/whatsapp.ts`: validar firma de Meta y enviar mensajes
