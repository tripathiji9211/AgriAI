import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Load real dataset from GitHub
dataset_url = 'https://raw.githubusercontent.com/Subhajeet-Das/Crop-Prediction/main/Crop_recommendation.csv'
try:
    print(f"Downloading dataset from {dataset_url}...")
    df = pd.read_csv(dataset_url)
    print("Dataset loaded successfully.")
except Exception as e:
    print(f"Error loading dataset: {e}")
    # Fallback to local file if download fails
    if os.path.exists('Crop_recommendation.csv'):
        df = pd.read_csv('Crop_recommendation.csv')
    else:
        raise Exception("Dataset not found locally or online.")

# Preprocess Data
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
print("Training Random Forest Classifier...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate Accuracy
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Export Model
joblib.dump(model, 'crop_model.joblib')
print("Model saved to 'crop_model.joblib'")
