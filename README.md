# Medxico.mx — Instrucciones de despliegue

## Paso 1 — Subir a GitHub

1. Ve a github.com/MEDXICOdesign
2. Clic en **New repository**
3. Nombre: `medxico` (todo minúsculas)
4. Selecciona **Public**
5. Clic en **Create repository**
6. En la página del repositorio vacío, clic en **uploading an existing file**
7. Arrastra TODA esta carpeta al recuadro
8. Clic en **Commit changes**

## Paso 2 — Conectar a Vercel

1. Ve a vercel.com y haz login con tu cuenta GitHub (MEDXICOdesign)
2. Clic en **Add New → Project**
3. Selecciona el repositorio **medxico**
4. Clic en **Deploy** — Vercel detecta automáticamente el proyecto

## Paso 3 — Configurar la API key

1. En Vercel, entra al proyecto → **Settings → Environment Variables**
2. Añade:
   - Name: `ANTHROPIC_API_KEY`
   - Value: tu API key de Anthropic (la de Claude)
   - Environment: Production + Preview + Development
3. Clic en **Save**
4. Ve a **Deployments → Redeploy** para aplicar

## Paso 4 — Conectar el dominio medxico.mx

1. En Vercel → **Settings → Domains**
2. Escribe `medxico.mx` → Clic en **Add**
3. Vercel te dará dos registros DNS:
   - Tipo A: apunta a 76.76.21.21
   - Tipo CNAME: www → cname.vercel-dns.com
4. Ve al panel donde compraste el dominio y añade esos registros
5. En 5-10 minutos medxico.mx estará en vivo

## Paso 5 — Formulario de email (opcional)

1. Ve a formspree.io y crea una cuenta gratuita
2. Crea un nuevo form y copia el ID (algo como `xpzgkrqb`)
3. En index.html, línea que dice `FORM_ID`, reemplaza con tu ID
4. Sube el cambio a GitHub (arrastra el archivo actualizado)
5. Vercel lo despliega automáticamente

## Actualizar el sitio

Cada vez que quieras añadir un protocolo o cambiar algo:
1. Pídeme el archivo actualizado a Claude
2. Sube el archivo a GitHub (arrastrarlo al repositorio)
3. Vercel lo publica en < 30 segundos

## Estructura del proyecto

```
medxico/
├── index.html              ← Página principal
├── api/
│   └── generate.js         ← Función serverless para la IA
├── assets/
│   └── logo.svg            ← Logo vectorial
├── protocols/
│   └── *.pdf               ← Protocolos descargables
├── vercel.json             ← Configuración Vercel
└── README.md               ← Este archivo
```
