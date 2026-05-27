import json
import os
from groq import Groq

def get_groq_client():
    return Groq(api_key=os.environ.get('GROQ_API_KEY'))

def generate_forecast(transactions: list) -> dict:
    client = get_groq_client()
    model = os.environ.get('GROQ_MODEL', 'llama3-70b-8192')
    
    tx_data = json.dumps(transactions, default=str)
    
    system_prompt = "You are a financial forecasting engine (LSTM + XGBoost model) for Indian SMEs. Analyze transaction history and return ONLY a valid JSON object \u2014 no explanation, no markdown, no extra text."
    user_prompt = f"""Analyze the following transaction data for an Indian SME and generate a cash flow forecast.

Transactions (last 90 days):
{tx_data}

Return this exact JSON structure:
{{
  "day_30_amount": <net cash change in next 30 days as integer>,
  "day_60_amount": <net cash change in next 60 days as integer>,
  "day_90_amount": <net cash change in next 90 days as integer>,
  "confidence_percent": <integer 70-95>,
  "risk_level": "<safe|caution|danger>",
  "cash_gap_day": <day number when cash might go negative, or null>,
  "cash_gap_amount": <how short in rupees as negative integer, or null>,
  "recommendation": "<one specific actionable recommendation in plain Hindi-English about what the business owner should do, max 100 chars>",
  "monthly_breakdown": [
    {{"month": "Month 1", "amount": <integer>, "risk": "<safe|caution|danger>"}},
    {{"month": "Month 2", "amount": <integer>, "risk": "<safe|caution|danger>"}},
    {{"month": "Month 3", "amount": <integer>, "risk": "<safe|caution|danger>"}}
  ]
}}"""

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model=model,
        temperature=0.1
    )
    
    content = response.choices[0].message.content.strip()
    if content.startswith('```json'):
        content = content[7:-3].strip()
    elif content.startswith('```'):
        content = content[3:-3].strip()
        
    return json.loads(content)

def generate_loan_score(transactions: list) -> dict:
    client = get_groq_client()
    model = os.environ.get('GROQ_MODEL', 'llama3-70b-8192')
    
    tx_data = json.dumps(transactions, default=str)
    
    system_prompt = "You are an XGBoost credit scoring engine for Indian SMEs. Return ONLY valid JSON, no explanation, no markdown."
    user_prompt = f"""Score this Indian SME's loan readiness based on their transaction history.

Transactions:
{tx_data}

Return this exact JSON:
{{
  "score": <integer 0-100>,
  "label": "<Loan Ready|Needs Improvement|Not Ready>",
  "reasons": [
    {{"text": "<reason>", "status": "<good|warning|bad>"}},
    {{"text": "<reason>", "status": "<good|warning|bad>"}},
    {{"text": "<reason>", "status": "<good|warning|bad>"}},
    {{"text": "<reason>", "status": "<good|warning|bad>"}}
  ],
  "suggested_loans": [
    {{"name": "<loan product name>", "provider": "<bank name>", "rate": "<interest rate>", "amount": "<max amount>", "type": "<OD|Term Loan|MSME Loan>"}},
    {{"name": "<loan product name>", "provider": "<bank name>", "rate": "<interest rate>", "amount": "<max amount>", "type": "<OD|Term Loan|MSME Loan>"}},
    {{"name": "<loan product name>", "provider": "<bank name>", "rate": "<interest rate>", "amount": "<max amount>", "type": "<OD|Term Loan|MSME Loan>"}}
  ]
}}"""

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model=model,
        temperature=0.1
    )
    
    content = response.choices[0].message.content.strip()
    if content.startswith('```json'):
        content = content[7:-3].strip()
    elif content.startswith('```'):
        content = content[3:-3].strip()
        
    return json.loads(content)

def generate_alerts(transactions: list, forecast: dict) -> list:
    client = get_groq_client()
    model = os.environ.get('GROQ_MODEL', 'llama3-70b-8192')
    
    tx_data = json.dumps(transactions, default=str)
    forecast_data = json.dumps(forecast, default=str)
    
    system_prompt = "You are an alert generation engine for Indian SME cash flow. Return ONLY valid JSON array, no markdown."
    user_prompt = f"""Based on these transactions and forecast, generate 4-6 smart alerts.

Transactions: {tx_data}
Forecast: {forecast_data}

Return JSON array:
[
  {{
    "type": "<cash_gap|gst_due|invoice_incoming|loan_suggestion>",
    "severity": "<red|yellow|green>",
    "message": "<clear alert message in plain language, max 120 chars>",
    "action_text": "<short CTA like 'Apply OD Now' or 'View Forecast'>"
  }}
]"""

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model=model,
        temperature=0.1
    )
    
    content = response.choices[0].message.content.strip()
    if content.startswith('```json'):
        content = content[7:-3].strip()
    elif content.startswith('```'):
        content = content[3:-3].strip()
        
    return json.loads(content)
