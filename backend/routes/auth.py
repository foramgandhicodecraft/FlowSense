from flask import Blueprint, request, jsonify
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    phone = data.get('phone')
    
    if not phone:
        return jsonify({'error': 'Phone number is required'}), 400
        
    user = User.query.filter_by(phone=phone).first()
    if not user:
        user = User(phone=phone)
        db.session.add(user)
        db.session.commit()
        
    return jsonify({
        'user_id': user.id,
        'phone': user.phone,
        'business_name': user.business_name
    })

@auth_bp.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.json
    user_id = data.get('user_id')
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    if 'business_name' in data:
        user.business_name = data['business_name']
    if 'gst_number' in data:
        user.gst_number = data['gst_number']
        
    db.session.commit()
    return jsonify({'success': True})
