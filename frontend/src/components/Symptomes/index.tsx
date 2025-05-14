'use client';

import { useState, useEffect } from 'react';
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Wind, 
  Calendar, 
  User, 
  AlertCircle,
  Stethoscope
} from 'lucide-react';

interface Choices {
  [key: string]: string[];
}

const getIconForField = (fieldName: string) => {
  switch (fieldName) {
    case 'Disease': return <Heart className="text-red-500" />;
    case 'Fever': return <Thermometer className="text-orange-500" />;
    case 'Cough': return <Stethoscope className="text-blue-500" />;
    case 'Fatigue': return <Activity className="text-purple-500" />;
    case 'Difficulty Breathing': return <Wind className="text-teal-500" />;
    case 'Blood Pressure': return <Activity className="text-red-600" />;
    case 'Cholesterol Level': return <AlertCircle className="text-yellow-500" />;
    case 'Gender': return <User className="text-blue-400" />;
    case 'Age': return <Calendar className="text-green-500" />;
    default: return null;
  }
};

export default function SymptomesForm() {
  const [choices, setChoices] = useState<Choices>({});
  const [form, setForm] = useState<Record<string, string>>({});
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    fetch('/choices.json')
      .then((res) => res.json())
      .then((data: Choices) => {
        setChoices(data);
        const initial: Record<string, string> = {};
        Object.keys(data).forEach((key) => { initial[key] = ''; });
        initial['Age'] = '';
        setForm(initial);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormSubmitted(true);
    
    const inputArray = [
      form['Disease'],
      form['Fever'],
      form['Cough'],
      form['Fatigue'],
      form['Difficulty Breathing'],
      form['Age'],
      form['Gender'],
      form['Blood Pressure'],
      form['Cholesterol Level'],
    ];

    try {
      const res = await fetch('http://localhost:3000/symptomes/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputArray }),
      });
      const data = await res.json();
      setPrediction(data.prediction ?? data.error);
    } catch (error) {
      setPrediction("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  if (Object.keys(choices).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
        <div className="animate-pulse flex space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-400"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-blue-400 rounded w-40"></div>
            <div className="space-y-2">
              <div className="h-4 bg-blue-300 rounded w-32"></div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-blue-800 dark:text-blue-200 font-medium">Chargement des données médicales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 py-10 px-4">
      <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-blue-100 dark:border-blue-900">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 rounded-full p-4 shadow-lg">
            <Heart size={40} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Diagnostic Médical Intelligent</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Renseignez vos symptômes pour obtenir une analyse préliminaire</p>
        
        <div className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(choices).map(([key, opts]) => (
              <div key={key} className="transition-all duration-300 hover:scale-105">
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 flex items-center">
                    <div className="mr-3">
                      {getIconForField(key)}
                    </div>
                    <label className="font-semibold text-gray-700 dark:text-gray-200">{key}</label>
                  </div>
                  <div className="p-3">
                    <select
                      name={key}
                      value={form[key] || ''}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="" disabled hidden>— Choisir —</option>
                      {opts.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Age field */}
            <div className="transition-all duration-300 hover:scale-105">
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 flex items-center">
                  <div className="mr-3">
                    <Calendar className="text-green-500" />
                  </div>
                  <label className="font-semibold text-gray-700 dark:text-gray-200">Age</label>
                </div>
                <div className="p-3">
                  <input
                    type="number"
                    name="Age"
                    value={form['Age'] || ''}
                    onChange={handleChange}
                    required
                    min={0}
                    placeholder="Entrez votre âge"
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex justify-center items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Analyser mes symptômes"
            )}
          </button>
        </div>

        {formSubmitted && (
          <div className={`mt-8 transition-all duration-500 ${prediction ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className={`rounded-2xl p-6 shadow-lg flex flex-col items-center ${
              prediction?.includes("Erreur") 
                ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" 
                : "bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 text-green-800 dark:text-green-200"
            }`}>
              {prediction ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-md">
                    {prediction?.includes("Erreur") ? (
                      <AlertCircle size={28} className="text-red-500" />
                    ) : (
                      <Heart size={28} className="text-green-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">Résultat du diagnostic</h3>
                  <p className="text-center font-medium">{prediction}</p>
                </>
              ) : loading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                  <p>Analyse en cours...</p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      
      <div className="max-w-3xl mx-auto text-center mt-8 text-gray-600 dark:text-gray-400 text-sm">
        <p>Ce diagnostic est fourni à titre indicatif seulement. Consultez un professionnel de santé pour un avis médical.</p>
      </div>
    </div>
  );
}