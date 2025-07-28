import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.png'; 



function App() {
  const [formData, setFormData] = useState({
    // Heart Disease
    age: '',
    sex: '',               // 1 = male, 0 = female
    cp: '',                // Chest pain type (0–3)
    trestbps: '',        // Resting blood pressure
    chol: '',            // Serum cholesterol
    fbs: '',               // Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
    restecg: '',           // Resting electrocardiographic results (0–2)
    thalach: '',         // Maximum heart rate achieved
    exang: '',             // Exercise induced angina (1 = yes; 0 = no)
    oldpeak: '',         // ST depression induced by exercise
    slope: '',             // Slope of the peak exercise ST segment (0–2)
    ca: '',                // Number of major vessels colored by fluoroscopy (0–3)
    thal: '',              // Thalassemia (1 = fixed defect, 2 = normal, 3 = reversible defect)
  
    // Diabetes
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    Weight: '',              // in kg
    Height: '',            // in meters
    DiabetesPedigreeFunction: '',
    diabetesAge: '',
    Bmi:'',
  });
  useEffect(() => {
    const weight = parseFloat(formData.Weight);
    const height = parseFloat(formData.Height);
  
    if (!isNaN(weight) && !isNaN(height) && height !== 0) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setFormData((prev) => ({ ...prev, Bmi: bmi }));
    }
  }, [formData.Weight, formData.Height]);
  const [heartPrediction, setHeartPrediction] = useState(null);
  const [diabetesPrediction, setDiabetesPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericData = Object.fromEntries(
      Object.entries(formData).map(([key, val]) => [key, parseFloat(val)])
    );
    

    try {
      const response = await axios.post('http://localhost:5000/predict_all', numericData);
      setHeartPrediction(response.data.heart_prediction);
      setDiabetesPrediction(response.data.diabetes_prediction);
    } catch (error) {
      console.error('Prediction error:', error);
      setHeartPrediction(null);
      setDiabetesPrediction(null);
    }
  };
  const weight = parseFloat(formData.Weight);
  const height = parseFloat(formData.Height);
  const heightInMeters = height / 100; // convert cm to meters
  const bmi = heightInMeters > 0 ? (weight / (heightInMeters * heightInMeters)).toFixed(2) : null;



  let bmiCategory = '';
  if (bmi) {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) bmiCategory = 'Underweight';
    else if (bmiValue < 25) bmiCategory = 'Normal (Fit)';
    else if (bmiValue < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';
  }

  return (
    <div className="App">
    <div className='upper'>
  <div className='header'>
    <img src={logo} alt="" className='logo' />
    <ul className='header-menu'>
      <li>Home</li>
      <li>Program</li>
      <li>Why us</li>
      <li>Plans</li>
      <li>Fitness Tracker</li>
    </ul>
  </div>
  <div className="left-h">
      <div className="the-best-ad">
        <span>THE BEST VIRTUAL FITNESS WEBSITE</span>
      </div>

      <div className="hero-text">
        <div>
          <span className="stroke-text">Track</span>
          <span>Learn</span>
        </div>
        <div>
          <span>Improve Health</span>
        </div>
      </div>

      <div className="upper1">
        <div className="button-container">
        <a href="https://youtu.be/JVmPu8o2ycc?si=rjfuYFCwBtL65rFv" target="_blank" rel="noopener noreferrer">
  <button className="curve-btn">
    Watch Now
  </button>
</a>

        </div>
        <div className="text-container">
          <span  className="h2">Know your Heart & Diabetes Health in seconds – enter your values, get instant results, and click ‘Watch Now’ that shows how to find these Values, helpful video!</span>
        </div>
      </div>
    </div>
</div>



      <div className="container">
        <h1 className="animated-title">Health Condition Prediction</h1>

        {/* Heart Disease Form Section */}
        <div className="form-container">
          <h3 className="h1"> Heart Condition Prediction</h3>
          <form onSubmit={handleSubmit} className="form">
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
            <select name="sex" value={formData.sex} onChange={handleChange} required>
              <option value="">Gender</option>
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
            <select name="cp" value={formData.cp} onChange={handleChange} required>
              <option value="">Chest Pain Type</option>
              <option value="0">Typical Angina</option>
              <option value="1">Atypical Angina</option>
              <option value="2">Non-anginal Pain</option>
              <option value="3">Asymptomatic</option>
            </select>
            <input type="number" name="trestbps" placeholder="Resting Blood Pressure" value={formData.trestbps} onChange={handleChange} required />
            <input type="number" name="chol" placeholder="Cholesterol" value={formData.chol} onChange={handleChange} required />
            <select name="fbs" value={formData.fbs} onChange={handleChange} required>
              <option value="">Fasting Blood Sugar > 120 mg/dl?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <select name="restecg" value={formData.restecg} onChange={handleChange} required>
              <option value="">Resting ECG</option>
              <option value="0">Normal</option>
              <option value="1">ST-T Abnormality</option>
              <option value="2">Left Ventricular Hypertrophy</option>
            </select>
            <input type="number" name="thalach" placeholder="Max Heart Rate Achieved" value={formData.thalach} onChange={handleChange} required />
            <select name="exang" value={formData.exang} onChange={handleChange} required>
              <option value="">Exercise Induced Angina</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <input type="number" step="0.1" name="oldpeak" placeholder="ST Depression" value={formData.oldpeak} onChange={handleChange} required />
            <select name="slope" value={formData.slope} onChange={handleChange} required>
              <option value="">Slope of Peak Exercise ST</option>
              <option value="0">Upsloping</option>
              <option value="1">Flat</option>
              <option value="2">Downsloping</option>
            </select>
            <input type="number" name="ca" placeholder="Number of Major Vessels (0-3)" value={formData.ca} onChange={handleChange} required />
            <select name="thal" value={formData.thal} onChange={handleChange} required>
              <option value="">Thalassemia</option>
              <option value="0">Normal</option>
              <option value="1">Fixed Defect</option>
              <option value="2">Reversible Defect</option>
            </select>
          </form>
        </div>

        {/* Diabetes Form Section */}
        
<div className="form-container">
  <h3 className="h1"> Diabetes Prediction</h3>
  <form onSubmit={handleSubmit} className="form">
    <input
      type="number"
      name="age"
      placeholder="Age"
      value={formData.age}
      onChange={handleChange}
      required
    />

    {/* Conditionally show "Pregnancies" field only if gender is female */}
    {formData.sex === "0" && (
      <input
        type="number"
        name="Pregnancies"
        placeholder="Pregnancies"
        value={formData.Pregnancies}
        onChange={handleChange}
        required
      />
    )}

    <input
      type="number"
      name="Glucose"
      placeholder="Glucose Level"
      value={formData.Glucose}
      onChange={handleChange}
      required
    />
    <input
      type="number"
      name="BloodPressure"
      placeholder="Blood Pressure"
      value={formData.BloodPressure}
      onChange={handleChange}
      required
    />
    <input
      type="number"
      name="SkinThickness"
      placeholder="Skin Thickness"
      value={formData.SkinThickness}
      onChange={handleChange}
      required
    />
    <input
      type="number"
      name="Insulin"
      placeholder="Insulin Level"
      value={formData.Insulin}
      onChange={handleChange}
      required
    />
    <input
      type="number"
      step="0.1"
      name="Weight"
      placeholder="Weight (kg)"
      value={formData.Weight}
      onChange={handleChange}
      required
    />
      <input
      type="number"
      step="0.1"
      name="Height"
      placeholder="Height (cm)"
      value={formData.Height}
      onChange={handleChange}
      required
    />
    <input
      type="number"
      step="0.001"
      name="DiabetesPedigreeFunction"
      placeholder="Diabetes Pedigree Function"
      value={formData.DiabetesPedigreeFunction}
      onChange={handleChange}
      required
    />

    <button type="submit" className="animated-button">Predict</button>
  </form>
</div>


        {heartPrediction !== null && diabetesPrediction !== null && (
          <div className="result-container">
          <h2 className={heartPrediction === 1 || diabetesPrediction === 1 ? "result-danger" : "result-safe"}>
            {heartPrediction === 1 && diabetesPrediction === 1
              ? "⚠️ You are at risk for both heart disease and diabetes — please consult a doctor"
              : heartPrediction === 1
              ? "⚠️ Heart health may need attention, while diabetes risk appears low"
              : diabetesPrediction === 1
              ? "⚠️ You may have diabetes, but no signs of heart disease were detected"
              : "✅  Great news! You have a healthy heart and normal blood sugar levels."
            }
          </h2>
          {bmi && (
              <div className="bmi-info">
                <h3>Your BMI: {bmi}</h3>
                <p className={
                  bmiCategory === 'Underweight'
                    ? 'bmi-under'
                    : bmiCategory === 'Normal (Fit)'
                    ? 'bmi-normal'
                    : bmiCategory === 'Overweight'
                    ? 'bmi-over'
                    : 'bmi-obese'
                }>
                  BMI Category: {bmiCategory}
                </p>
              </div>
            )}

        
          <div className="tips-card">
            <h3>🍀 Health Tips & Exercise Guide</h3>
            <ul>
              {heartPrediction === 1 || diabetesPrediction === 1 ? (
                <>
                  <li><strong>🥗 Diet Tips:</strong>
                    <ul>
                      <li>🍎 Eat apples, berries & citrus fruits daily.</li>
                      <li>🥦 Add spinach, kale, and broccoli to meals.</li>
                      <li>🥑 Use olive oil, nuts, and avocados for healthy fats.</li>
                      <li>🚫 Avoid processed food, sugary drinks, and excess salt.</li>
                    </ul>
                  </li>
                  <li><strong>🏃 Exercise Advice:</strong>
                    <ul>
                      <li>🚶‍♂️ 30 minutes walk, 5 times a week.</li>
                      <li>🚴 Try cycling or swimming for cardio.</li>
                      <li>🧘 Add yoga or light stretches for flexibility.</li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li><strong>🥗 Healthy Diet Routine:</strong>
                    <ul>
                      <li>🍛 Balanced meals with veggies, grains & lean protein.</li>
                      <li>🚰 Drink at least 2-3 liters of water daily.</li>
                      <li>⏱️ Follow regular meal timings, avoid junk food.</li>
                    </ul>
                  </li>
                  <li><strong>💪 Daily Fitness Tips:</strong>
                    <ul>
                      <li>🧍 Light workouts, stretching, or 20-min walks.</li>
                      <li>🏋️‍♂️ Weekly bodyweight exercises for strength.</li>
                      <li>🎯 Maintain a consistent routine to stay fit.</li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        )}
      </div>
    </div>
  );
}

export default App;
