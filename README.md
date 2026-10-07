# Asistente de WhatsApp con IA

Ver `CLAUDE.md` para la descripción del proyecto y sus reglas.

## Cómo correrlo en tu computadora
1. Instala Node.js (versión 20 o mayor) desde https://nodejs.org
2. En esta carpeta, abre una terminal y corre: `npm install`
3. Copia `.env.example` como `.env.local` y llena tus claves.
4. Corre `npm run dev` y abre http://localhost:3000

## Probar el bot eco (Etapa 2)
1. Sube el proyecto a GitHub y despliégalo en Vercel (Import Project).
2. En Vercel > Settings > Environment Variables agrega las 4 variables `WHATSAPP_...`.
3. En Meta for Developers > tu app > WhatsApp > Configuration > Webhook:
   - Callback URL: `https://TU-PROYECTO.vercel.app/api/webhook`
   - Verify token: el mismo valor que pusiste en `WHATSAPP_VERIFY_TOKEN`
   - Suscríbete al campo `messages`.
4. Escribe al número de prueba de Meta desde tu WhatsApp: te debe responder lo mismo.
