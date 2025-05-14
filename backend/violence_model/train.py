import os
import cv2
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Configuration
IMG_SIZE = 64
EPOCHS = 30
BATCH_SIZE = 32
DATASET_PATH = "C:/Users/21655/Desktop/Pi-web/backend/dataset/RWF-2000"
TRAIN_PATH = os.path.join(DATASET_PATH, "train")
VAL_PATH = os.path.join(DATASET_PATH, "val")
MODEL_PATH = "C:/Users/21655/Desktop/Pi-web/backend/violence_model/model.h5"

# Fonction pour extraire les frames des vidéos
def extract_frames_from_videos(source_dir, max_frames_per_video=30):
    categories = ['Fight', 'NonFight']
    for category in categories:
        folder = os.path.join(source_dir, category)
        for file in os.listdir(folder):
            if file.endswith('.avi'):
                video_path = os.path.join(folder, file)
                cap = cv2.VideoCapture(video_path)
                frame_count = 0
                success, frame = cap.read()
                while success and frame_count < max_frames_per_video:
                    frame = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
                    frame_filename = f"{os.path.splitext(file)[0]}_frame{frame_count}.jpg"
                    cv2.imwrite(os.path.join(folder, frame_filename), frame)
                    success, frame = cap.read()
                    frame_count += 1
                cap.release()
                # Optionnel : supprimer la vidéo après extraction
                os.remove(video_path)
                print(f"✅ Frames extraites de {file}")

# Extraction des frames
print("🎞️ Extraction des frames en cours...")
extract_frames_from_videos(TRAIN_PATH)
extract_frames_from_videos(VAL_PATH)

# Prétraitement des images
train_datagen = ImageDataGenerator(rescale=1./255)
train_data = train_datagen.flow_from_directory(
    TRAIN_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary'
)

val_data = train_datagen.flow_from_directory(
    VAL_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary'
)

# Définition du modèle CNN
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_SIZE, IMG_SIZE, 3)),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

# Compilation
model.compile(optimizer=Adam(1e-4), loss='binary_crossentropy', metrics=['accuracy'])

# Entraînement
print("🏋️‍♂️ Entraînement du modèle...")
model.fit(
    train_data,
    epochs=EPOCHS,
    validation_data=val_data
)

# Sauvegarde
model.save(MODEL_PATH)
print("✅ Modèle entraîné et sauvegardé :", MODEL_PATH)
