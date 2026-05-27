from flask import Blueprint, request, jsonify
from services.forecast_service import get_or_create_forecast

forecast_bp = Blueprint('forecast', __name__)

@forecast_bp.route('', methods=['GET'])
def get_forecast():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400
        
    try:
        forecast = get_or_create_forecast(user_id)
        if not forecast:
            return jsonify({'error': 'No data to forecast'}), 404
            
        return jsonify({
            'id': forecast.id,
            'generated_at': forecast.generated_at.isoformat(),
            'day_30_amount': float(forecast.day_30_amount) if forecast.day_30_amount else None,
            'day_60_amount': float(forecast.day_60_amount) if forecast.day_60_amount else None,
            'day_90_amount': float(forecast.day_90_amount) if forecast.day_90_amount else None,
            'confidence_percent': forecast.confidence_percent,
            'risk_level': forecast.risk_level,
            'cash_gap_day': forecast.cash_gap_day,
            'cash_gap_amount': float(forecast.cash_gap_amount) if forecast.cash_gap_amount else None,
            'recommendation': forecast.recommendation,
            'monthly_breakdown': forecast.monthly_breakdown
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@forecast_bp.route('/generate', methods=['POST'])
def generate_forecast():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400
        
    try:
        forecast = get_or_create_forecast(user_id, force=True)
        if not forecast:
            return jsonify({'error': 'No data to forecast'}), 404
            
        return jsonify({'success': True, 'id': forecast.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
