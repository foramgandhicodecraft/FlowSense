from flask import Blueprint, request, jsonify
from services.loan_score_service import get_or_create_loan_score
from models import db, Alert

loans_bp = Blueprint('loans', __name__)

@loans_bp.route('/loan-score', methods=['GET'])
def get_loan_score():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400
        
    try:
        score = get_or_create_loan_score(user_id)
        if not score:
            return jsonify({'error': 'No data for score'}), 404
            
        return jsonify({
            'id': score.id,
            'generated_at': score.generated_at.isoformat(),
            'score': score.score,
            'label': score.label,
            'reasons': score.reasons,
            'suggested_loans': score.suggested_loans
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@loans_bp.route('/alerts', methods=['GET'])
def get_alerts():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400
        
    alerts = Alert.query.filter_by(user_id=user_id).order_by(Alert.created_at.desc()).all()
    result = []
    for a in alerts:
        result.append({
            'id': a.id,
            'type': a.type,
            'severity': a.severity,
            'message': a.message,
            'action_text': a.action_text,
            'is_read': a.is_read,
            'created_at': a.created_at.isoformat()
        })
        
    return jsonify(result)

@loans_bp.route('/alerts/mark-read', methods=['POST'])
def mark_read():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400
        
    Alert.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True})
    db.session.commit()
    
    return jsonify({'success': True})
