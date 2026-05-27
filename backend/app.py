import os
from flask import Flask
from flask_cors import CORS
from models import db
from config import Config
from routes.auth import auth_bp
from routes.transactions import tx_bp
from routes.forecast import forecast_bp
from routes.loans import loans_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    db.init_app(app)
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(tx_bp, url_prefix='/api/transactions')
    app.register_blueprint(forecast_bp, url_prefix='/api/forecast')
    app.register_blueprint(loans_bp, url_prefix='/api')
    
    with app.app_context():
        db.create_all()
        
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)