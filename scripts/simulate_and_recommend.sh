#!/usr/bin/env bash
set -eu
OUT=metrics/simulated_metrics_$(date +%Y%m%dT%H%M%S).json

# Genera métricas simuladas (estas se usarán para probar el modelo/políticas)
cat > "$OUT" <<JSON
{
  "timestamp": "$(date --iso-8601=seconds)",
  "rps": $(( (RANDOM % 400) + 50 )),
  "latency_ms": $(( (RANDOM % 400) + 20 )),
  "error_rate": "$(awk -v r=$((RANDOM%10)) 'BEGIN{printf \"%.2f\", r/100}')",
  "trust_score": $(( (RANDOM % 40) + 60 ))
}
JSON

echo "🔎 Metrics written to $OUT"

# Simple rule-based recommender using policy weights (demo only)
policy_file="policies/predictive_scaling_policy.json"
if [ ! -f "$policy_file" ]; then
  echo "⚠️ Policy missing: $policy_file" >&2
  exit 1
fi

# Read metrics
rps=$(jq .rps -r "$OUT")
latency=$(jq .latency_ms -r "$OUT")
error_rate=$(jq .error_rate -r "$OUT")
trust=$(jq .trust_score -r "$OUT")

# Simple score (normalized)
rps_score=$(awk -v r="$rps" 'BEGIN{print (r/500)}')
lat_score=$(awk -v l="$latency" 'BEGIN{print (1 - l/1000)}')
err_score=$(awk -v e="$error_rate" 'BEGIN{print (1 - e)}')
trust_score=$(awk -v t="$trust" 'BEGIN{print (t/100)}')

# weights from policy (hardcoded mirror)
w_rps=0.45; w_lat=0.25; w_err=0.15; w_trust=0.15
composite=$(awk -v a="$rps_score" -v b="$lat_score" -v c="$err_score" -v d="$trust_score" -v wa="$w_rps" -v wb="$w_lat" -v wc="$w_err" -v wd="$w_trust" \
  'BEGIN{print (a*wa + b*wb + c*wc + d*wd)}')

# Recommend instances between min/max
min_instances=1; max_instances=10
recommended=$(awk -v comp="$composite" -v min="$min_instances" -v max="$max_instances" 'BEGIN{print int(min + (max-min)*comp)}')
if [ "$recommended" -lt "$min_instances" ]; then recommended=$min_instances; fi

cat > metrics/recommendation_$(date +%s).json <<JSON
{
  "timestamp": "$(date --iso-8601=seconds)",
  "composite_score": $composite,
  "recommended_instances": $recommended,
  "action_suggested": "$( [ $(echo "$composite > 0.75" | bc -l) -eq 1 ] && echo "scale_up" || ( [ $(echo "$composite < 0.30" | bc -l) -eq 1 ] && echo "scale_down" || echo "noop") )"
}
JSON

echo "✅ Recommendation generated: metrics/recommendation_*.json"
