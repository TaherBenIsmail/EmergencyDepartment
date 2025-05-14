import sys
import json
import joblib
import numpy as np
import io
import os

# Forcer l'encodage en UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

MODEL_PATH = "model_triage.joblib"

# Mapping simple des symptômes (à adapter selon ton jeu de données)
SYMPTOM_MAPPING = {
    "fièvre": 1,
    "douleur thoracique": 2,
    "essoufflement": 3,
    "nausée": 4,
    "malaise": 5,
    "traumatisme": 6
}

def load_model(path):
    """Charge le modèle Joblib depuis le chemin spécifié."""
    print(f"🚀 Chargement du modèle depuis {path}...")  # Log pour le debug
    return joblib.load(path)

def encode_features(data):
    """Transforme le dictionnaire JSON en vecteur de caractéristiques."""
    print("🔍 Encodage des données :", data)  # Log pour le debug
    age = int(data.get("age", 0))
    sexe = data.get("sexe", "").lower()
    sexe_enc = 1 if sexe == "homme" else 0

    temperature    = float(data.get("temperature", 0.0))
    tension_sys    = int(data.get("tension_sys", 0))
    tension_dia    = int(data.get("tension_dia", 0))
    rythme_cardiaque = int(data.get("rythme_cardiaque", 0))
    saturation_o2  = int(data.get("saturation_o2", 0))

    symptome       = data.get("symptome", "").lower()
    symptome_enc   = SYMPTOM_MAPPING.get(symptome, 0)

    features = np.array([ 
        age, 
        sexe_enc, 
        temperature, 
        tension_sys, 
        tension_dia, 
        rythme_cardiaque, 
        saturation_o2, 
        symptome_enc
    ], dtype=float).reshape(1, -1)

    return features

def main():
    # Vérifier les arguments
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python predict.py '<json_string>'"}))
        sys.exit(1)

    # Charger et parser le JSON
    try:
        input_data = json.loads(sys.argv[1])
        print("🔍 Données reçues pour la prédiction :", input_data)  # Log pour le debug
    except json.JSONDecodeError:
        print(json.dumps({"error": "JSON invalide"}))
        sys.exit(1)

    # Charger le modèle
    try:
        model = load_model(MODEL_PATH)
    except Exception:
        print(json.dumps({"error": "Impossible de charger le modèle"}))
        sys.exit(1)

    # Encoder les features
    try:
        X = encode_features(input_data)
    except Exception:
        print(json.dumps({"error": "Erreur d'encodage des caractéristiques"}))
        sys.exit(1)

    # Prédiction
    try:
        pred = model.predict(X)[0]
        print(f"🎯 Résultat de la prédiction : {pred}")  # Log pour le debug
    except Exception:
        print(json.dumps({"error": "Erreur lors de la prédiction"}))
        sys.exit(1)

    # Sortie JSON
    # Convertir la prédiction en entier classique pour éviter l'erreur de sérialisation
    print(json.dumps({"niveau_urgence": int(pred)}))

if _name_ == "_main_":
    main()