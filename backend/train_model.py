import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Données simulées : 200 patients
# Format : [age, sexe (0=f, 1=h), température, tension_sys, tension_dia, rythme_cardiaque, saturation_o2, symptome_enc]
X = []
y = []

import random

def generate_patient(level):
    if level == 0:  # Urgence faible
        return [
            random.randint(18, 60),
            random.randint(0, 1),
            round(random.uniform(36.0, 37.5), 1),
            random.randint(110, 130),
            random.randint(70, 85),
            random.randint(60, 90),
            random.randint(96, 100),
            random.randint(0, 2)
        ]
    elif level == 1:  # Urgence modérée
        return [
            random.randint(30, 70),
            random.randint(0, 1),
            round(random.uniform(37.6, 39.0), 1),
            random.randint(130, 150),
            random.randint(85, 95),
            random.randint(90, 110),
            random.randint(90, 95),
            random.randint(2, 5)
        ]
    else:  # Urgence critique (niveau 2)
        return [
            random.randint(50, 90),
            random.randint(0, 1),
            round(random.uniform(39.1, 41.0), 1),
            random.randint(150, 180),
            random.randint(95, 110),
            random.randint(110, 140),
            random.randint(70, 89),
            random.randint(5, 7)
        ]

# Générer 200 patients : 70 faible, 70 modéré, 60 critique
for _ in range(70):
    X.append(generate_patient(0))
    y.append(0)

for _ in range(70):
    X.append(generate_patient(1))
    y.append(1)

for _ in range(60):
    X.append(generate_patient(2))
    y.append(2)

X = np.array(X)
y = np.array(y)

# Entraînement du modèle
clf = RandomForestClassifier(n_estimators=100, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf.fit(X_train, y_train)

# Évaluation
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))

# Sauvegarde du modèle
joblib.dump(clf, "model_triage.joblib")
print("✅ Modèle sauvegardé avec 200 patients dans model_triage.joblib")
