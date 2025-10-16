Predictive Scaling automation:
- Use policies/predictive_scaling_policy.json and ai_models/predictive_scaler_model.json
- Run scripts/simulate_and_recommend.sh to generate simulated metrics and recommendations.
- Review metrics/recommendation_*.json and, when ready, edit scripts/execute_scaling_action.sh to call provider APIs.
- For production auto-scaling, implement a secure runner (Cloud Run job / Cloud Function / GitHub Actions) with minimal service account permissions to adjust instances.
