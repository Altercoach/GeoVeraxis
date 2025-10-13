#!/usr/bin/env bash
set -eu
LOG="logs/auto_scale_scheduler_$(date +%Y%m%dT%H%M%S).log"
echo "🕒 $(date) – Inicio ciclo de auto-escalado predictivo" | tee -a "$LOG"

# Ejecutar simulación
if bash scripts/simulate_and_recommend.sh >> "$LOG" 2>&1; then
  echo "✅ Simulación ejecutada con éxito" | tee -a "$LOG"
else
  echo "⚠️ Error ejecutando simulación" | tee -a "$LOG"
fi

# Evaluar última recomendación
RECO=$(ls metrics/recommendation_*.json 2>/dev/null | tail -n1 || true)
if [ -n "$RECO" ]; then
  action=$(jq -r .action_suggested "$RECO")
  echo "🔍 Última recomendación: $action" | tee -a "$LOG"
  if [ "$action" = "scale_up" ] || [ "$action" = "scale_down" ]; then
    echo "🚧 Acción sugerida: $action (simulada)" | tee -a "$LOG"
    bash scripts/execute_scaling_action.sh >> "$LOG" 2>&1 || echo "⚠️ Ejecución simulada fallida" | tee -a "$LOG"
  else
    echo "ℹ️ No se requiere acción en este ciclo." | tee -a "$LOG"
  fi
else
  echo "⚠️ No se encontró recomendación válida." | tee -a "$LOG"
fi

echo "🕓 $(date) – Fin ciclo auto-escalado predictivo" | tee -a "$LOG"
