from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn import svm
from sklearn.metrics import accuracy_score
import pickle

app = Flask(__name__)
CORS(app)

### ================= HEART DISEASE MODEL =================

# Load and prepare heart disease data
heart_data = pd.read_csv(r'C:\Users\KRISHNA KAUSHIK N\Downloads\ML\heart.csv')
X_heart = heart_data.drop(columns='target', axis=1)
Y_heart = heart_data['target']

X_train_heart, X_test_heart, Y_train_heart, Y_test_heart = train_test_split(X_heart, Y_heart, test_size=0.2, stratify=Y_heart, random_state=42)

heart_scaler = StandardScaler()
X_train_heart_scaled = heart_scaler.fit_transform(X_train_heart)
X_test_heart_scaled = heart_scaler.transform(X_test_heart)

heart_model = LogisticRegression(max_iter=1000)
heart_model.fit(X_train_heart_scaled, Y_train_heart)

# Save for reuse
pickle.dump(heart_model, open('heart_disease_model.sav', 'wb'))
pickle.dump(heart_scaler, open('heart_scaler.sav', 'wb'))

### ================= DIABETES MODEL =================

# Load and prepare diabetes data
# ================= DIABETES MODEL =================

# Load and prepare diabetes data
diabetes_data = pd.read_csv(r'C:\Users\KRISHNA KAUSHIK N\Downloads\ML\diabetes.csv')
X_diabetes = diabetes_data.drop(columns='Outcome', axis=1)
Y_diabetes = diabetes_data['Outcome']

diabetes_scaler = StandardScaler()
X_diabetes_scaled = diabetes_scaler.fit_transform(X_diabetes)

# Train diabetes model
diabetes_model = LogisticRegression(max_iter=1000)
diabetes_model.fit(X_diabetes_scaled, Y_diabetes)

# Save for reuse
pickle.dump(diabetes_model, open('diabetes_model.sav', 'wb'))
pickle.dump(diabetes_scaler, open('diabetes_scaler.sav', 'wb'))

# ================= PREDICTION API =================

@app.route('/predict_all', methods=['POST'])
def predict_all():
    try:
        data = request.get_json()

        print("Received data:", data)  # Debugging line

        # Prepare heart disease prediction data
        heart_features = np.array([
            data['age'],
            data['sex'],
            data['cp'],
            data['trestbps'],
            data['chol'],
            data['fbs'],
            data['restecg'],
            data['thalach'],
            data['exang'],
            data['oldpeak'],
            data['slope'],
            data['ca'],
            data['thal']
        ]).reshape(1, -1)

        # Scale the features
        heart_scaler = pickle.load(open('heart_scaler.sav', 'rb'))
        heart_features_scaled = heart_scaler.transform(heart_features)

        # Load model and predict
        heart_model = pickle.load(open('heart_disease_model.sav', 'rb'))
        heart_prediction = heart_model.predict(heart_features_scaled)[0]

        # Prepare diabetes prediction data
        diabetes_features = np.array([
            data['Pregnancies'],
            data['Glucose'],
            data['BloodPressure'],
            data['SkinThickness'],
            data['Insulin'],
            data['Bmi'],
            data['DiabetesPedigreeFunction'],
            data['age']
        ]).reshape(1, -1)

        # Scale the features
        diabetes_scaler = pickle.load(open('diabetes_scaler.sav', 'rb'))
        diabetes_features_scaled = diabetes_scaler.transform(diabetes_features)

        # Load model and predict
        diabetes_model = pickle.load(open('diabetes_model.sav', 'rb'))
        diabetes_prediction = diabetes_model.predict(diabetes_features_scaled)[0]

        print("Heart prediction:", heart_prediction)  # Debugging line
        print("Diabetes prediction:", diabetes_prediction)  # Debugging line
        print("Pregnancies:" , data['Pregnancies'])
        # Return predictions
        return jsonify({
    'heart_prediction': int(heart_prediction),
    'diabetes_prediction': int(diabetes_prediction)
})

    
    except Exception as e:
        print(f"Error: {e}")  # Debugging line
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
