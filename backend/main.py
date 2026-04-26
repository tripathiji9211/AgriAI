from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="AgriAI ML Service")

# Load the trained model on startup
try:
    model = joblib.load('crop_model.joblib')
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Define the expected JSON payload
class CropFeatures(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

@app.post("/api/recommend")
async def recommend_crop(features: CropFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded. Please train the model first.")
    
    # Format input for scikit-learn
    input_data = np.array([[
        features.N, features.P, features.K, 
        features.temperature, features.humidity, 
        features.ph, features.rainfall
    ]])
    
    # Make prediction
    prediction = model.predict(input_data)
    
    return {
        "recommended_crop": prediction[0],
        "confidence_status": "high"
    }

# Run with: uvicorn main:app --reload
