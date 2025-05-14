'use client';

import { useState } from 'react';
import { Activity, Thermometer, Heart, Wind, Droplet, AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function TriageForm() {
  const [formData, setFormData] = useState({
    age: '',
    sex: 'male',
    temperature: '',
    systolic_bp: '',
    diastolic_bp: '',
    heart_rate: '',
    oxygen_saturation: '',
    symptom: 'fever',
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'sex' || name === 'symptom' ? value : value === '' ? '' : Number(value),
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    // API request simulation
    setTimeout(() => {
      // Simplified urgency determination logic for demo
      let urgency = 0;
      
      if (formData.temperature > 39 || formData.systolic_bp > 160 || formData.systolic_bp < 90 ||
          formData.oxygen_saturation < 92 || formData.heart_rate > 120) {
        urgency = 2;
      } else if (formData.temperature > 38 || formData.systolic_bp > 140 || 
                formData.systolic_bp < 100 || formData.oxygen_saturation < 95 || 
                formData.heart_rate > 100) {
        urgency = 1;
      }
      
      // If the symptom is 'chest pain', increase urgency
      if (formData.symptom === 'chest pain') {
        urgency = Math.min(urgency + 1, 2);
      }
      
      setResult({ urgency_level: urgency });
      setIsLoading(false);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getSymptomIcon = () => {
    switch (formData.symptom) {
      case 'fever':
        return <Thermometer className="h-8 w-8 text-red-500" />;
      case 'chest pain':
        return <Heart className="h-8 w-8 text-red-500" />;
      case 'shortness of breath':
        return <Wind className="h-8 w-8 text-blue-500" />;
      case 'nausea':
        return <Droplet className="h-8 w-8 text-green-500" />;
      case 'dizziness':
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case 'trauma':
        return <AlertCircle className="h-8 w-8 text-purple-500" />;
      default:
        return <Activity className="h-8 w-8 text-blue-500" />;
    }
  };

  const getUrgencyDetails = (level) => {
    switch (level) {
      case 0:
        return {
          icon: <CheckCircle className="h-8 w-8" />,
          title: "Non-urgent",
          color: "green",
          description: "Patient can wait. Regular monitoring recommended.",
          recommendations: [
            "Rest recommended",
            "Regular hydration",
            "Temperature monitoring",
            "Return if symptoms worsen"
          ]
        };
      case 1:
        return {
          icon: <Clock className="h-8 w-8" />,
          title: "Moderate urgency",
          color: "yellow",
          description: "Patient requires medical attention soon.",
          recommendations: [
            "Increased monitoring of vital signs",
            "Medical examination in the next few hours",
            "Rest while waiting for consultation",
            "Do not eat or drink without medical advice"
          ]
        };
      case 2:
        return {
          icon: <AlertCircle className="h-8 w-8" />,
          title: "High urgency",
          color: "red",
          description: "Patient requires immediate medical attention.",
          recommendations: [
            "Immediate medical intervention",
            "Continuous monitoring of vital parameters",
            "Potential preparation for specialized examinations",
            "Urgent contact with referring physician"
          ]
        };
      default:
        return {
          icon: <Activity className="h-8 w-8" />,
          title: "Unknown level",
          color: "gray",
          description: "Unable to determine urgency level.",
          recommendations: []
        };
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">1</span>
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Years"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Sex
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">2</span>
              Vital Signs - Part 1
            </h2>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2 flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-red-500" /> Temperature (°C)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="37.0"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-sm text-gray-500 mt-2">Normal: 36.1°C - 37.2°C</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" /> Systolic Blood Pressure
                </label>
                <input
                  type="number"
                  name="systolic_bp"
                  value={formData.systolic_bp}
                  onChange={handleChange}
                  placeholder="mmHg"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-sm text-gray-500 mt-2">Normal: 90-120 mmHg</div>
              </div>
              
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" /> Diastolic Blood Pressure
                </label>
                <input
                  type="number"
                  name="diastolic_bp"
                  value={formData.diastolic_bp}
                  onChange={handleChange}
                  placeholder="mmHg"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-sm text-gray-500 mt-2">Normal: 60-80 mmHg</div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">3</span>
              Vital Signs - Part 2
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" /> Heart Rate
                </label>
                <input
                  type="number"
                  name="heart_rate"
                  value={formData.heart_rate}
                  onChange={handleChange}
                  placeholder="bpm"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-sm text-gray-500 mt-2">Normal: 60-100 bpm</div>
              </div>
              
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2 flex items-center">
                  <Wind className="h-5 w-5 mr-2 text-blue-500" /> Oxygen Saturation
                </label>
                <input
                  type="number"
                  name="oxygen_saturation"
                  value={formData.oxygen_saturation}
                  onChange={handleChange}
                  placeholder="%"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-sm text-gray-500 mt-2">Normal: 95-100%</div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">4</span>
              Symptoms
            </h2>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Main Symptom
              </label>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['fever', 'chest pain', 'shortness of breath', 'nausea', 'dizziness', 'trauma'].map((symptom) => (
                  <div 
                    key={symptom}
                    onClick={() => setFormData(prev => ({ ...prev, symptom }))}
                    className={`p-4 rounded-lg border cursor-pointer transition duration-200 flex flex-col items-center justify-center ${
                      formData.symptom === symptom 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {symptom === 'fever' && <Thermometer className="h-8 w-8 text-red-500 mb-2" />}
                    {symptom === 'chest pain' && <Heart className="h-8 w-8 text-red-500 mb-2" />}
                    {symptom === 'shortness of breath' && <Wind className="h-8 w-8 text-blue-500 mb-2" />}
                    {symptom === 'nausea' && <Droplet className="h-8 w-8 text-green-500 mb-2" />}
                    {symptom === 'dizziness' && <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />}
                    {symptom === 'trauma' && <AlertCircle className="h-8 w-8 text-purple-500 mb-2" />}
                    <span className="text-base text-center">{symptom.charAt(0).toUpperCase() + symptom.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <div className="bg-blue-50 rounded-lg p-6 flex items-start">
                <div className="flex-shrink-0 mr-4 mt-1">
                  {getSymptomIcon()}
                </div>
                <div>
                  <h3 className="font-medium text-blue-800 text-lg">Patient Summary</h3>
                  <p className="text-base text-blue-700 mt-2">
                    {formData.sex === 'male' ? 'Male' : 'Female'} patient, {formData.age} years old with main symptom: <span className="font-semibold">{formData.symptom}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
                    <div className="text-base">
                      <span className="text-gray-500">Temperature:</span> <span className="font-medium">{formData.temperature} °C</span>
                    </div>
                    <div className="text-base">
                      <span className="text-gray-500">Blood Pressure:</span> <span className="font-medium">{formData.systolic_bp}/{formData.diastolic_bp} mmHg</span>
                    </div>
                    <div className="text-base">
                      <span className="text-gray-500">Heart Rate:</span> <span className="font-medium">{formData.heart_rate} bpm</span>
                    </div>
                    <div className="text-base">
                      <span className="text-gray-500">O₂ Saturation:</span> <span className="font-medium">{formData.oxygen_saturation}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Activity className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-blue-800">MediTriage Pro</h1>
          <p className="text-blue-600 mt-2 text-lg">Intelligent Medical Assessment System</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Medical Triage</h2>
              <div className="text-blue-100 text-base px-4 py-1 bg-blue-700 bg-opacity-30 rounded-full">
                HealthTech+
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className={`rounded-full h-10 w-10 flex items-center justify-center text-base font-medium ${
                      currentStep > i + 1 
                        ? 'bg-blue-100 text-blue-800' 
                        : currentStep === i + 1 
                          ? 'bg-white text-blue-600' 
                          : 'bg-blue-600 bg-opacity-30 text-blue-100'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`h-1 w-24 mx-2 ${
                      currentStep > i + 1 ? 'bg-blue-100' : 'bg-blue-600 bg-opacity-30'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="px-8 py-8">
            <div>
              {renderStepContent()}
              
              <div className="mt-10 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition duration-150 text-base"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 shadow-sm text-base"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 transition duration-150 shadow-sm text-base"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : 'Analyze My Condition'}
                  </button>
                )}
              </div>
            </div>

            {result && (
              <div className="mt-10">
                <div className={`rounded-xl overflow-hidden shadow-lg border ${
                  result.urgency_level === 0
                    ? 'border-green-200'
                    : result.urgency_level === 1
                    ? 'border-yellow-200'
                    : 'border-red-200'
                }`}>
                  <div className={`p-6 ${
                    result.urgency_level === 0
                      ? 'bg-green-50'
                      : result.urgency_level === 1
                      ? 'bg-yellow-50'
                      : 'bg-red-50'
                  }`}>
                    <div className="flex items-center">
                      <div
                        className={`w-16 h-16 flex items-center justify-center rounded-full ${
                          result.urgency_level === 0
                            ? 'bg-green-100 text-green-600'
                            : result.urgency_level === 1
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {getUrgencyDetails(result.urgency_level).icon}
                      </div>
                      <div className="ml-5">
                        <h3
                          className={`text-2xl font-bold ${
                            result.urgency_level === 0
                              ? 'text-green-800'
                              : result.urgency_level === 1
                              ? 'text-yellow-800'
                              : 'text-red-800'
                          }`}
                        >
                          {getUrgencyDetails(result.urgency_level).title}
                        </h3>
                        <p
                          className={`text-base ${
                            result.urgency_level === 0
                              ? 'text-green-600'
                              : result.urgency_level === 1
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {getUrgencyDetails(result.urgency_level).description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6">
                    <h4 className="font-medium text-gray-700 mb-4 text-lg">Recommendations:</h4>
                    <ul className="space-y-3">
                      {getUrgencyDetails(result.urgency_level).recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <div className={`mr-3 mt-1 flex-shrink-0 h-4 w-4 rounded-full ${
                            result.urgency_level === 0
                              ? 'bg-green-100'
                              : result.urgency_level === 1
                              ? 'bg-yellow-100'
                              : 'bg-red-100'
                          }`}></div>
                          <span className="text-base text-gray-600">{rec}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-8 pt-5 border-t border-gray-100">
                      <div className="flex justify-between">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 text-base font-medium flex items-center"
                          onClick={() => {
                            setResult(null);
                            setCurrentStep(1);
                          }}
                        >
                          New Assessment
                        </button>
                        <button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-base font-medium shadow-sm"
                        >
                          Print Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center text-base text-gray-500">
          <p>MediTriage Pro • Your intelligent medical triage assistant</p>
          <p className="mt-2">© 2025 HealthTech Solutions • All rights reserved</p>
        </div>
      </div>
    </div>
  );
}