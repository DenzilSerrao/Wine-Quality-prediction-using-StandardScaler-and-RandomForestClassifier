import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle

# Load dataset
print("Loading and preprocessing data...")
data = pd.read_csv("D:/Programs/Python/Wine QT Prediction/project/model/WineQT.csv")
data = data.drop(columns=['Id'])  # Drop unnecessary Id column

# Check for missing values
print("Missing values in dataset:")
print(data.isnull().sum())

# Scale features
features = data.columns.drop('quality')
scaler = StandardScaler()
data[features] = scaler.fit_transform(data[features])

# Save the scaler for later use
print("Saving scaler...")
with open('model/scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)

# Split the data
print("Splitting data into training and testing sets...")
X = data.drop('quality', axis=1)
y = data['quality']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
print("Training Random Forest model...")
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print(f"Model accuracy: {accuracy:.4f}")
print("\nClassification Report:")
print(report)

# Save the model
print("Saving model as model.pkl...")
with open('model/model.pkl', 'wb') as model_file:
    pickle.dump(model, model_file)

# Save feature names for reference
feature_names = list(X.columns)
with open('model/feature_names.pkl', 'wb') as features_file:
    pickle.dump(feature_names, features_file)

print("Model training and saving complete!")