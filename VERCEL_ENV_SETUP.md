# Instrucciones para configurar variables de entorno en Vercel

## Variables requeridas:

1. **DATABASE_URL**
   ```
   postgresql://neondb_owner:npg_Vb9dXtSU4ERK@ep-dark-shadow-ahvc685k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

2. **NEXTAUTH_URL**
   ```
   https://davidabt.vercel.app
   ```
   (Reemplaza con tu URL de Vercel)

3. **NEXTAUTH_SECRET**
   ```
   Genera uno con: openssl rand -base64 32
   ```
   O usa: `supersecretkey_change_this_in_production_12345678`

4. **BLOB_READ_WRITE_TOKEN**
   ```
   Se genera automáticamente al conectar Vercel Blob Storage
   ```
   - Ve a Storage → Connect Store → Blob
   - Vercel creará automáticamente esta variable

## Cómo agregarlas en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable con su valor
4. Para Blob Storage:
   - Ve a Storage tab
   - Click "Create Database" → Blob
   - Esto agregará automáticamente BLOB_READ_WRITE_TOKEN
5. Aplica a: Production, Preview, Development
6. Redeploy el proyecto

## Verificar que funcione:

Después de agregar las variables y hacer redeploy, verifica:
- `/admin` - Debería mostrar el login
- Credenciales: admin / admin
- Podrás subir avatares de usuario
