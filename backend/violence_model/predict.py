import cv2
import numpy as np
import sys
from tensorflow.keras.models import load_model

# Configuration
IMG_SIZE = 64
MODEL_PATH = "C:/Users/21655/Desktop/Pi-web/backend/violence_model/model.h5"
THRESHOLD = 0.5  # seuil de détection "Fight"

# Récupérer le chemin de la vidéo en argument (depuis app.js)
if len(sys.argv) < 2:
    print("❌ Chemin de la vidéo manquant.")
    sys.exit(1)

VIDEO_PATH = sys.argv[1]

# Charger le modèle
model = load_model(MODEL_PATH)

# Charger la vidéo
cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print("❌ Impossible d'ouvrir la vidéo.")
    sys.exit(1)

fight_frames = 0
total_frames = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Prétraitement
    resized = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
    normalized = resized / 255.0
    input_data = np.expand_dims(normalized, axis=0)

    # Prédiction
    prediction = model.predict(input_data)[0][0]
    if prediction >= THRESHOLD:
        fight_frames += 1
    total_frames += 1

cap.release()

# Décision finale
if total_frames == 0:
    print("❌ Vidéo vide ou corrompue.")
    sys.exit(1)

violence_ratio = fight_frames / total_frames
result = "Fight" if violence_ratio > 0.5 else "NonFight"
print(result)
