from models import db, LoanScore, Transaction
from services.groq_service import generate_loan_score
from datetime import datetime, timedelta

def get_or_create_loan_score(user_id, force=False):
    if not force:
        latest = LoanScore.query.filter_by(user_id=user_id).order_by(LoanScore.generated_at.desc()).first()
        if latest and latest.generated_at > datetime.utcnow() - timedelta(hours=24):
            return latest

    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.asc()).all()
    tx_list = []
    for t in transactions:
        tx_list.append({
            "date": t.date.isoformat(),
            "description": t.description,
            "amount": float(t.amount),
            "category": t.category,
            "source": t.source
        })

    if not tx_list:
        return None

    groq_response = generate_loan_score(tx_list)
    
    score = LoanScore(
        user_id=user_id,
        score=groq_response.get("score"),
        label=groq_response.get("label"),
        reasons=groq_response.get("reasons", []),
        suggested_loans=groq_response.get("suggested_loans", [])
    )
    
    db.session.add(score)
    db.session.commit()
    
    return score
