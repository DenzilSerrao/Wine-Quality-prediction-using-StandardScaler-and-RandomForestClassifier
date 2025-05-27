from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
import os
from flask_cors import CORS
import pandas as pd

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)  # Enable CORS for all routes

# Load model and scaler
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'scaler.pkl')
FEATURES_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'feature_names.pkl')

# Load the model, scaler, and feature names
with open(MODEL_PATH, 'rb') as model_file:
    model = pickle.load(model_file)

with open(SCALER_PATH, 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

with open(FEATURES_PATH, 'rb') as features_file:
    feature_names = pickle.load(features_file)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.get_json()
        
        # Create a list with the feature values in the correct order
        features = []
        for feature in feature_names:
            if feature in data:
                features.append(float(data[feature]))
            else:
                return jsonify({'error': f'Missing feature: {feature}'}), 400
        
        # Convert to pandas DataFrame with feature names
        input_df = pd.DataFrame([features], columns=feature_names)
        
        # Scale the input data
        input_data_scaled = scaler.transform(input_df)
        input_data_scaled_df = pd.DataFrame(input_data_scaled, columns=feature_names)
        
        # Make prediction
        prediction = int(model.predict(input_data_scaled_df)[0])
        
        # Get prediction probabilities
        probabilities = model.predict_proba(input_data_scaled_df)[0]
        prob_dict = {str(i+3): float(prob) for i, prob in enumerate(probabilities)}
        
        # Get feature importance
        feature_importance = {feature: float(importance) for feature, importance 
                             in zip(feature_names, model.feature_importances_)}
        
        # Sort features by importance (descending)
        top_features = dict(sorted(feature_importance.items(), 
                                  key=lambda x: x[1], reverse=True)[:3])
        
        return jsonify({
            'prediction': prediction,
            'probabilities': prob_dict,
            'top_features': top_features
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)