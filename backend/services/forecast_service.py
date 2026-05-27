from models import db, Forecast, Transaction
from services.groq_service import generate_forecast, generate_alerts
from datetime import datetime, timedelta

def get_or_create_forecast(user_id, force=False):
    if not force:
        # Check if fresh forecast exists (< 24 hours)
        latest = Forecast.query.filter_by(user_id=user_id).order_by(Forecast.generated_at.desc()).first()
        if latest and latest.generated_at > datetime.utcnow() - timedelta(hours=24):
            return latest

    # Generate new forecast
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
        return None # No transactions to forecast

    groq_response = generate_forecast(tx_list)
    
    # Save to DB
    forecast = Forecast(
        user_id=user_id,
        day_30_amount=groq_response.get("day_30_amount"),
        day_60_amount=groq_response.get("day_60_amount"),
        day_90_amount=groq_response.get("day_90_amount"),
        confidence_percent=groq_response.get("confidence_percent"),
        risk_level=groq_response.get("risk_level"),
        cash_gap_day=groq_response.get("cash_gap_day"),
        cash_gap_amount=groq_response.get("cash_gap_amount"),
        recommendation=groq_response.get("recommendation"),
        monthly_breakdown=groq_response.get("monthly_breakdown", []),
        raw_groq_response=str(groq_response)
    )
    
    db.session.add(forecast)
    db.session.commit()
    
    # Generate alerts based on this forecast
    alerts_data = generate_alerts(tx_list, groq_response)
    from models import Alert
    
    # Clear old unread alerts to avoid spam (optional, but good)
    Alert.query.filter_by(user_id=user_id, is_read=False).delete()
    
    for a in alerts_data:
        alert = Alert(
            user_id=user_id,
            type=a.get("type", "info"),
            severity=a.get("severity", "info"),
            message=a.get("message", ""),
            action_text=a.get("action_text", "")
        )
        db.session.add(alert)
        
    db.session.commit()
    return forecast
