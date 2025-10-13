#!/bin/bash
set -e
echo "🧠 Ejecutando GeoVeraxis Manual Sync..."
git pull origin main --rebase || true
git add -A
git commit -m "🔁 Manual sync update ($(date))" || true
git push origin main || true
echo "✅ GeoVeraxis Manual Sync completado."
