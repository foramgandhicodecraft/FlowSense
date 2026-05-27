from flask import Blueprint, request, jsonify
from models import db, Transaction
import pandas as pd
from datetime import datetime
import io

tx_bp = Blueprint('transactions', __name__)

@tx_bp.route('', methods=['GET'])
def get_transactions():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400
        
    txs = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.desc()).limit(90).all()
    
    result = []
    for t in txs:
        result.append({
            'id': t.id,
            'date': t.date.isoformat(),
            'description': t.description,
            'amount': float(t.amount),
            'category': t.category,
            'source': t.source
        })
        
    return jsonify(result)

@tx_bp.route('/upload-csv', methods=['POST'])
def upload_csv():
    user_id = request.form.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400
        
    if 'file' not in request.files:
        return jsonify({'error': 'no file provided'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'no file selected'}), 400
        
    try:
        df = pd.read_csv(file)
        
        # Expected format: date, description, amount, category, source
        added = 0
        for _, row in df.iterrows():
            tx = Transaction(
                user_id=user_id,
                date=datetime.strptime(str(row['date']), '%Y-%m-%d').date(),
                description=str(row['description']),
                amount=float(row['amount']),
                category=str(row['category']) if pd.notna(row['category']) else 'other',
                source=str(row['source']) if pd.notna(row['source']) else 'manual'
            )
            db.session.add(tx)
            added += 1
            
        db.session.commit()
        return jsonify({'success': True, 'added': added})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@tx_bp.route('/add', methods=['POST'])
def add_transaction():
    data = request.json
    user_id = data.get('user_id')
    
    try:
        tx = Transaction(
            user_id=user_id,
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            description=data['description'],
            amount=float(data['amount']),
            category=data.get('category', 'other'),
            source=data.get('source', 'manual')
        )
        db.session.add(tx)
        db.session.commit()
        return jsonify({'success': True, 'id': tx.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@tx_bp.route('/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    tx = Transaction.query.get(id)
    if tx:
        db.session.delete(tx)
        db.session.commit()
    return jsonify({'success': True})
