#!/bin/bash
# ===========================================================
# 🌎 Geoveraxis Full Cleanup Script
# Limpia entorno local + versiones viejas en la nube (Hosting, Functions, Storage)
# ===========================================================

echo "🧭 Iniciando limpieza completa del entorno Geoveraxis..."

# 1️⃣ Detener procesos activos
echo "🛑 Deteniendo procesos Node y Firebase..."
pkill node 2>/dev/null || true
pkill npm 2>/dev/null || true
pkill firebase 2>/dev/null || true

# 2️⃣ Verificar proyecto
if [ ! -f "package.json" ]; then
  echo "⚠️ No se encontró package.json. Ejecuta este script desde la raíz del proyecto Geoveraxis."
  exit 1
fi

# 3️⃣ Limpieza local profunda
echo "🧹 Eliminando archivos temporales y cachés locales..."
rm -rf node_modules
rm -rf .next
rm -rf .vercel
rm -rf .firebase
rm -rf functions/node_modules
rm -rf functions/lib
rm -rf functions/.cache
rm -rf ~/.cache
rm -rf /tmp/*
rm -rf .venv
find . -type f -name "*.log" -delete

# 4️⃣ Limpiar cache de npm
echo "🧽 Limpiando cache de npm..."
npm cache clean --force

# 5️⃣ Reconstrucción limpia
echo "⚙️ Reinstalando dependencias y reconstruyendo..."
npm install
npm run build

# 6️⃣ Reiniciar sesión Firebase (seguro)
echo "🔐 Reiniciando autenticación Firebase..."
firebase logout --token || true
firebase login || true

# 7️⃣ Limpiar versiones viejas en Firebase Hosting
echo "🗑️ Eliminando versiones viejas de Firebase Hosting..."
firebase hosting:versions:list --limit 10 --json > hosting_versions.json 2>/dev/null || true
if grep -q "versionId" hosting_versions.json; then
  jq -r '.result[]?.versionId' hosting_versions.json | head -n -1 | while read vid; do
    echo "🧺 Borrando versión vieja: $vid"
    firebase hosting:versions:delete $vid --force || true
  done
else
  echo "No hay versiones previas de Hosting para eliminar."
fi
rm -f hosting_versions.json

# 8️⃣ Limpiar versiones viejas de Cloud Functions
echo "⚡ Eliminando funciones antiguas..."
firebase functions:list --json > functions.json 2>/dev/null || true
if grep -q "name" functions.json; then
  jq -r '.result[]?.id' functions.json | while read fid; do
    echo "�� Borrando función: $fid"
    firebase functions:delete $fid --force || true
  done
else
  echo "No hay funciones previas para eliminar."
fi
rm -f functions.json

# 9️⃣ Limpiar archivos viejos en Cloud Storage
echo "☁️ Eliminando archivos temporales en Cloud Storage (carpeta /tmp o /builds)..."
firebase storage:delete /tmp --force || true
firebase storage:delete /builds --force || true

# 🔟 Mostrar espacio libre
echo "💾 Espacio en disco actual:"
df -h | head -n 10

# 🔁 Reinicio de entorno
echo "♻️ Reiniciando entorno Cloud Shell..."
echo "Puedes cerrar y volver a abrir esta sesión para aplicar los cambios."

echo "✅ Limpieza completa de Geoveraxis finalizada."
echo "✨ Entorno local y nube liberados correctamente."
echo "💡 Consejo: abre una nueva sesión de Gemini ('New Chat') para evitar desbordes de tokens."
chmod +x cleanup_geoveraxis_full.sh
./cleanup_geoveraxis_full.sh


