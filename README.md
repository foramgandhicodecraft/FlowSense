# FlowSense - AI-Powered Cash Flow Intelligence

FlowSense is a premium, full-stack AI-powered cash flow intelligence web app designed specifically for Indian SMEs. It analyzes past transactions and predicts future cash flow for the next 30, 60, and 90 days using an advanced **LSTM + XGBoost Engine**, warning business owners about cash shortages before they happen and recommending smart borrowing actions.

## About FlowSense

FlowSense is an AI-powered cash flow intelligence platform built for India's 63 million 
SMEs. Most small business owners discover cash problems only when their account hits zero 
- by then, emergency loans at 24–36% interest are the only option. FlowSense solves this 
by predicting cash flow problems 3–4 weeks before they happen.

### How It Works

Business owners connect their GST account, bank statements, and UPI history via a simple 
one-tap flow. Our LSTM-based forecasting engine analyzes 90 days of transaction history 
and generates 30, 60, and 90-day cash flow projections with confidence intervals. An 
XGBoost scoring model evaluates loan readiness based on income consistency, GST 
compliance, and expense patterns.

### Key Features

- 90-day AI cash flow forecast with risk zone indicators
- Early warning alerts fired 3–4 weeks before a predicted cash gap
- Loan readiness score with personalized borrowing recommendations
- Smart alerts via dashboard (WhatsApp integration roadmap)
- CSV transaction upload for instant analysis

### Impact

A business warned 4 weeks early can arrange an overdraft at 10–14% instead of 
an emergency loan at 36% - saving ₹2–5 lakhs per year. FlowSense gives every 
kirana shop and MSME the financial visibility that was previously only available 
to large enterprises.

## Technology Stack

* **Frontend:** React, React Router, Tailwind CSS, Recharts
* **Backend:** Flask (Python), SQLAlchemy
* **Database:** PostgreSQL
* **AI/Analysis Engine:** LSTM Model + XGBoost for forecasting and credit scoring

## Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment and activate it (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Setup:**
   Fill in your `.env` file in the `backend` folder:
   ```env
   DATABASE_URL=postgresql://username:password@localhost/flowsense
   GROQ_API_KEY=your_api_key_here
   GROQ_MODEL=llama3-70b-8192
   SECRET_KEY=your_secret_key
   ```
   *(Ensure you have created a PostgreSQL database named `flowsense`)*

5. **Run the Flask App:**
   ```bash
   python app.py
   ```
   *(This will automatically create the required database tables on the first run and start the server at `http://localhost:5000`)*

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Ensure your `.env` file in the `frontend` folder has the API base URL:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

4. **Run the React App:**
   ```bash
   npm start
   ```

## Using Demo Data

To see the platform's full capabilities without providing real transaction data:
1. Log in using any 10-digit phone number (e.g. `9876543210`).
2. On the "Connect Data" screen, click the **"Use Demo Data"** button.
3. This will generate 90 days of realistic transaction data for an Indian textile SME, populating the database.
4. Click **"Continue to Dashboard"** to see the AI models (LSTM + XGBoost) analyze this data in real-time to generate your 90-day cash forecast, alerts, and loan readiness score.

## API Endpoints

### Authentication
* `POST /api/auth/login` - Authenticate user (creates user if doesn't exist)
* `POST /api/auth/update-profile` - Update business profile

### Transactions
* `GET /api/transactions` - Fetch last 90 days of transactions for a user
* `POST /api/transactions/add` - Manually add a transaction
* `POST /api/transactions/upload-csv` - Upload a CSV of transactions
* `DELETE /api/transactions/<id>` - Delete a transaction

### Forecasting (LSTM)
* `GET /api/forecast` - Get the current cash flow forecast (cached if recent)
* `POST /api/forecast/generate` - Force regenerate the forecast using the AI model

### Alerts & Loans (XGBoost)
* `GET /api/loan-score` - Get loan readiness score and recommended products
* `GET /api/alerts` - Get all smart alerts for the user
* `POST /api/alerts/mark-read` - Mark all alerts as read

## Why FlowSense Matters?

In the Indian MSME ecosystem, cash flow isn't just a metric, it's survival. Most small businesses don't fail because they lack profitability, they fail because of a timing mismatch between paying suppliers and collecting receivables. By converting fragmented bank statements, UPI histories, and GST filings into a predictive early-warning system, FlowSense shifts business owners from reactive firefighting to proactive financial planning. Giving a kirana shop or a textile manufacturer a 4-week heads-up on a cash deficit completely changes their leverage, allowing them to secure stable bank overdrafts at 12% instead of resorting to predatory emergency loans at 36%. It’s elite corporate financial intelligence, democratized for India’s engine of growth.
