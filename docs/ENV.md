# Variables de Entorno (sin secretos)

Lista de variables utilizadas o previstas. Rellena en `.env` a partir de `.env.example`.

- NODE_ENV: entorno de ejecución (development|production)
- NEXT_PUBLIC_APP_URL: URL pública de la app
- NEXT_PUBLIC_API_BASE: base de API pública
- SESSION_COOKIE_NAME: nombre de cookie de sesión (por defecto: session)
- NEXTAUTH_URL: URL de NextAuth (si se usa)
- NEXTAUTH_SECRET: secreto para NextAuth (si se usa)
- DATABASE_URL: conexión a base de datos (si aplica)
- REDIS_URL: conexión a Redis (si aplica)
- SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS: envío de correos (si aplica)
- STRIPE_PUBLIC_KEY/STRIPE_SECRET_KEY: pagos (si aplica)
- CLOUDINARY_URL: media storage (si aplica)