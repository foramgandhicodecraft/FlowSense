from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    business_name = db.Column(db.String(255))
    gst_number = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    date = db.Column(db.Date, nullable=False)
    description = db.Column(db.String(255))
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    category = db.Column(db.String(100))
    source = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Forecast(db.Model):
    __tablename__ = 'forecasts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)
    day_30_amount = db.Column(db.Numeric(12, 2))
    day_60_amount = db.Column(db.Numeric(12, 2))
    day_90_amount = db.Column(db.Numeric(12, 2))
    confidence_percent = db.Column(db.Integer)
    risk_level = db.Column(db.String(20))
    cash_gap_day = db.Column(db.Integer, nullable=True)
    cash_gap_amount = db.Column(db.Numeric(12, 2), nullable=True)
    recommendation = db.Column(db.Text)
    raw_groq_response = db.Column(db.Text)
    monthly_breakdown = db.Column(JSONB)

class LoanScore(db.Model):
    __tablename__ = 'loan_scores'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)
    score = db.Column(db.Integer)
    label = db.Column(db.String(50))
    reasons = db.Column(JSONB)
    suggested_loans = db.Column(JSONB)

class Alert(db.Model):
    __tablename__ = 'alerts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    type = db.Column(db.String(30))
    severity = db.Column(db.String(10))
    message = db.Column(db.Text)
    action_text = db.Column(db.String(100))
    is_read = db.Column(db.Boolean, default=False)
