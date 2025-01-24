import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions


from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

import shutil
from pathlib import Path



def classificition(img_path):
    interpreter = tf.lite.Interpreter(model_path="mobilenet_v2.tflite")
    interpreter.allocate_tensors()
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)  
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    interpreter.set_tensor(input_details[0]['index'], img_array)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    decoded_predictions = decode_predictions(output_data, top=3)[0]
    predictions = [
        {
            "class": pred[1],
            "description": pred[1],
            "probability": float(pred[2])  # Convert to Python float
        }
        for pred in decoded_predictions
    ]    
    return predictions
    


app = FastAPI()
origins = [
    "http://localhost:3000",  # React frontend
    "http://127.0.0.1:3000",  # Alternative localhost
    "http://localhost:5173"  # Add your frontend domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allowed origins
    allow_credentials=True,  # Allow cookies or authorization headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

UPLOAD_DIR = "uploads"
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)  # Create the upload directory if it doesn't exist

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_DIR}/{file.filename}"    
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    predictions = classificition(file_location)
    print("predictions:" , predictions)
    return {"predictions": predictions}
