'use client';

import { useState } from 'react';
import { Activity, Thermometer, Heart, Wind, Droplet, AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function TriageForm() {
  const [formData, setFormData] = useState({
    age: '',
    sexe: 'homme',
    temperature: '',
    tension_sys: '',
    tension_dia: '',
    rythme_cardiaque: '',
    saturation_o2: '',
    symptome: 'fièvre',
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'sexe' || name === 'symptome' ? value : value === '' ? '' : Number(value),
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    // Simulation d'une requête API
    setTimeout(() => {
      // Logique de détermination du niveau d'urgence simplifiée pour la démo
      let urgence = 0;
      
      if (formData.temperature > 39 || formData.tension_sys > 160 || formData.tension_sys < 90 ||
          formData.saturation_o2 < 92 || formData.rythme_cardiaque > 120) {
        urgence = 2;
      } else if (formData.temperature > 38 || formData.tension_sys > 140 || 
                formData.tension_sys < 100 || formData.saturation_o2 < 95 || 
                formData.rythme_cardiaque > 100) {
        urgence = 1;
      }
      
      // Si le symptôme est 'douleur thoracique', augmenter l'urgence
      if (formData.symptome === 'douleur thoracique') {
        urgence = Math.min(urgence + 1, 2);
      }
      
      setResult({ niveau_urgence: urgence });
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

  const getSymptomeIcon = () => {
    switch (formData.symptome) {
      case 'fièvre':
        return <Thermometer className="h-8 w-8 text-red-500" />;
      case 'douleur thoracique':
        return <Heart className="h-8 w-8 text-red-500" />;
      case 'essoufflement':
        return <Wind className="h-8 w-8 text-blue-500" />;
      case 'nausée':
        return <Droplet className="h-8 w-8 text-green-500" />;
      case 'malaise':
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case 'traumatisme':
        return <AlertCircle className="h-8 w-8 text-purple-500" />;
      default:
        return <Activity className="h-8 w-8 text-blue-500" />;
    }
  };

  const getUrgenceDetails = (niveau) => {
    switch (niveau) {
      case 0:
        return {
          icon: <CheckCircle className="h-8 w-8" />,
          title: "Non urgent",
          color: "green",
          description: "Le patient peut attendre. Surveillance régulière recommandée.",
          recommendations: [
            "Repos recommandé",
            "Hydratation régulière",
            "Contrôle de la température",
            "Revenir si les symptômes s'aggravent"
          ]
        };
      case 1:
        return {
          icon: <Clock className="h-8 w-8" />,
          title: "Urgence relative",
          color: "yellow",
          description: "Le patient nécessite une attention médicale prochainement.",
          recommendations: [
            "Surveillance accrue des signes vitaux",
            "Examen médical dans les prochaines heures",
            "Rester au repos en attendant la consultation",
            "Ne pas manger ou boire sans avis médical"
          ]
        };
      case 2:
        return {
          icon: <AlertCircle className="h-8 w-8" />,
          title: "Urgence absolue",
          color: "red",
          description: "Le patient nécessite une attention médicale immédiate.",
          recommendations: [
            "Intervention médicale immédiate",
            "Surveillance continue des paramètres vitaux",
            "Préparation potentielle pour examens spécialisés",
            "Contact urgent avec le médecin référent"
          ]
        };
      default:
        return {
          icon: <Activity className="h-8 w-8" />,
          title: "Niveau inconnu",
          color: "gray",
          description: "Impossible de déterminer le niveau d'urgence.",
          recommendations: []
        };
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 transition-all duration-300">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">1</span>
              Informations personnelles
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Âge
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Ans"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexe
                </label>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 transition-all duration-300">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">2</span>
              Signes vitaux - Partie 1
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Thermometer className="h-4 w-4 mr-1 text-red-500" /> Température (°C)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="37.0"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-500 mt-1">Normale: 36.1°C - 37.2°C</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Activity className="h-4 w-4 mr-1 text-blue-500" /> Tension systolique
                </label>
                <input
                  type="number"
                  name="tension_sys"
                  value={formData.tension_sys}
                  onChange={handleChange}
                  placeholder="mmHg"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-500 mt-1">Normale: 90-120 mmHg</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Activity className="h-4 w-4 mr-1 text-blue-500" /> Tension diastolique
                </label>
                <input
                  type="number"
                  name="tension_dia"
                  value={formData.tension_dia}
                  onChange={handleChange}
                  placeholder="mmHg"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-500 mt-1">Normale: 60-80 mmHg</div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 transition-all duration-300">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">3</span>
              Signes vitaux - Partie 2
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-red-500" /> Rythme cardiaque
                </label>
                <input
                  type="number"
                  name="rythme_cardiaque"
                  value={formData.rythme_cardiaque}
                  onChange={handleChange}
                  placeholder="bpm"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-500 mt-1">Normale: 60-100 bpm</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Wind className="h-4 w-4 mr-1 text-blue-500" /> Saturation O₂
                </label>
                <input
                  type="number"
                  name="saturation_o2"
                  value={formData.saturation_o2}
                  onChange={handleChange}
                  placeholder="%"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-500 mt-1">Normale: 95-100%</div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 transition-all duration-300">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">4</span>
              Symptômes
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symptôme principal
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['fièvre', 'douleur thoracique', 'essoufflement', 'nausée', 'malaise', 'traumatisme'].map((symptome) => (
                  <div 
                    key={symptome}
                    onClick={() => setFormData(prev => ({ ...prev, symptome }))}
                    className={`p-3 rounded-lg border cursor-pointer transition duration-200 flex flex-col items-center justify-center ${
                      formData.symptome === symptome 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {symptome === 'fièvre' && <Thermometer className="h-6 w-6 text-red-500 mb-1" />}
                    {symptome === 'douleur thoracique' && <Heart className="h-6 w-6 text-red-500 mb-1" />}
                    {symptome === 'essoufflement' && <Wind className="h-6 w-6 text-blue-500 mb-1" />}
                    {symptome === 'nausée' && <Droplet className="h-6 w-6 text-green-500 mb-1" />}
                    {symptome === 'malaise' && <AlertTriangle className="h-6 w-6 text-yellow-500 mb-1" />}
                    {symptome === 'traumatisme' && <AlertCircle className="h-6 w-6 text-purple-500 mb-1" />}
                    <span className="text-sm text-center">{symptome.charAt(0).toUpperCase() + symptome.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1">
                  {getSymptomeIcon()}
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Résumé du patient</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Patient {formData.sexe === 'homme' ? 'masculin' : 'féminin'} de {formData.age} ans présentant comme symptôme principal: <span className="font-semibold">{formData.symptome}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                    <div className="text-sm">
                      <span className="text-gray-500">Température:</span> <span className="font-medium">{formData.temperature} °C</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Tension:</span> <span className="font-medium">{formData.tension_sys}/{formData.tension_dia} mmHg</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Rythme:</span> <span className="font-medium">{formData.rythme_cardiaque} bpm</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Saturation:</span> <span className="font-medium">{formData.saturation_o2}%</span>
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
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <Activity className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-800">MediTriage Pro</h1>
          <p className="text-blue-600 mt-1">Système intelligent d'évaluation médicale</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Triage Médical</h2>
              <div className="text-blue-100 text-sm px-3 py-1 bg-blue-700 bg-opacity-30 rounded-full">
                HealthTech+
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium ${
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
                    <div className={`h-1 w-12 mx-1 ${
                      currentStep > i + 1 ? 'bg-blue-100' : 'bg-blue-600 bg-opacity-30'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="px-6 py-6">
            <div>
              {renderStepContent()}
              
              <div className="mt-8 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition duration-150"
                  >
                    Précédent
                  </button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 shadow-sm"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 transition duration-150 shadow-sm"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyse en cours...
                      </span>
                    ) : 'Analyser mon état'}
                  </button>
                )}
              </div>
            </div>

            {result && (
              <div className="mt-8">
                <div className={`rounded-xl overflow-hidden shadow-lg border ${
                  result.niveau_urgence === 0
                    ? 'border-green-200'
                    : result.niveau_urgence === 1
                    ? 'border-yellow-200'
                    : 'border-red-200'
                }`}>
                  <div className={`p-5 ${
                    result.niveau_urgence === 0
                      ? 'bg-green-50'
                      : result.niveau_urgence === 1
                      ? 'bg-yellow-50'
                      : 'bg-red-50'
                  }`}>
                    <div className="flex items-center">
                      <div
                        className={`w-14 h-14 flex items-center justify-center rounded-full ${
                          result.niveau_urgence === 0
                            ? 'bg-green-100 text-green-600'
                            : result.niveau_urgence === 1
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {getUrgenceDetails(result.niveau_urgence).icon}
                      </div>
                      <div className="ml-4">
                        <h3
                          className={`text-xl font-bold ${
                            result.niveau_urgence === 0
                              ? 'text-green-800'
                              : result.niveau_urgence === 1
                              ? 'text-yellow-800'
                              : 'text-red-800'
                          }`}
                        >
                          {getUrgenceDetails(result.niveau_urgence).title}
                        </h3>
                        <p
                          className={`text-sm ${
                            result.niveau_urgence === 0
                              ? 'text-green-600'
                              : result.niveau_urgence === 1
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {getUrgenceDetails(result.niveau_urgence).description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5">
                    <h4 className="font-medium text-gray-700 mb-3">Recommandations:</h4>
                    <ul className="space-y-2">
                      {getUrgenceDetails(result.niveau_urgence).recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <div className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${
                            result.niveau_urgence === 0
                              ? 'bg-green-100'
                              : result.niveau_urgence === 1
                              ? 'bg-yellow-100'
                              : 'bg-red-100'
                          }`}></div>
                          <span className="text-sm text-gray-600">{rec}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                          onClick={() => {
                            setResult(null);
                            setCurrentStep(1);
                          }}
                        >
                          Nouvelle évaluation
                        </button>
                        <button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
                        >
                          Imprimer le rapport
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>MediTriage Pro • Votre assistant de triage médical intelligent</p>
          <p className="mt-1">© 2025 HealthTech Solutions • Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}