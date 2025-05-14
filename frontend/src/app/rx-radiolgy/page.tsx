"use client";
import axios from "axios";
import { useState } from "react";

function xray() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/predict-radiology",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Erreur durant l'envoi :", error);
      setResult({
        label: "Erreur",
        prediction: "0",
        confidence: "0",
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">X-Ray Vision</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Système d'analyse radiologique assistée par intelligence artificielle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload card */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Télécharger une radiographie</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-500 mb-6 text-sm">
                Sélectionnez ou déposez une image radiologique pour obtenir une analyse automatisée
              </p>
              <form onSubmit={handleSubmit}>
                {previewUrl ? (
                  <div 
                    className="border-2 border-dashed border-blue-200 rounded-xl p-4 mb-6 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    <img src={previewUrl} alt="Preview" className="w-full h-64 object-contain rounded-lg" />
                    <p className="text-sm text-blue-600 mt-3 text-center font-medium">
                      <span className="flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                        Cliquez pour changer l'image
                      </span>
                    </p>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-blue-200 rounded-xl p-8 mb-6 bg-blue-50 hover:bg-blue-100 transition cursor-pointer flex flex-col items-center justify-center"
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-blue-600 font-medium">Déposer une image ou cliquer pour parcourir</p>
                    <p className="text-blue-400 text-sm mt-1">Formats acceptés: JPG, PNG</p>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
                <div className="flex justify-between mt-2">
                  <button
                    type="button"
                    onClick={reset}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Réinitialiser
                  </button>
                  <button
                    type="submit"
                    disabled={!file || loading}
                    className={`px-6 py-2 text-white rounded-lg shadow-md flex items-center gap-2 ${
                      !file || loading 
                        ? "bg-gray-400" 
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    } transition-all`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Analyse...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Analyser l'image
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results card */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Résultat de l'analyse</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-500 mb-6 text-sm">
                Interprétation radiologique automatisée basée sur l'intelligence artificielle
              </p>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-pulse"></div>
                    <div className="w-16 h-16 border-t-4 border-blue-600 border-r-4 border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0"></div>
                  </div>
                  <p className="text-blue-600 font-medium mt-4">Analyse en cours...</p>
                  <p className="text-gray-400 text-sm mt-1">Veuillez patienter pendant le traitement</p>
                </div>
              ) : result ? (
                <div className="text-left">
                  <div className="flex items-center mb-4">
                    <span className={`inline-flex items-center justify-center p-2 rounded-lg ${
                      result.confidence > 70 
                        ? "bg-green-100 text-green-700" 
                        : result.confidence > 40 
                        ? "bg-yellow-100 text-yellow-700" 
                        : "bg-red-100 text-red-700"
                    } mr-3`}>
                      {result.confidence > 70 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : result.confidence > 40 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-800">{result.label}</h3>
                  </div>
                  
                  <div className="mb-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      result.confidence > 70 
                        ? "bg-green-100 text-green-700" 
                        : result.confidence > 40 
                        ? "bg-yellow-100 text-yellow-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {result.confidence > 70 
                        ? "Probabilité élevée" 
                        : result.confidence > 40 
                        ? "Probabilité moyenne" 
                        : "Probabilité faible"}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-xl mb-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Score de prédiction:</span>
                        <span className="font-bold">{result.prediction}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, result.prediction * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Indice de confiance:</span>
                        <span className="font-bold">{result.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            result.confidence > 70 
                              ? "bg-gradient-to-r from-green-400 to-green-600" 
                              : result.confidence > 40 
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600" 
                              : "bg-gradient-to-r from-red-400 to-red-600"
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, result.confidence))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>
                        Cette analyse est fournie à titre informatif uniquement. 
                        Consultez un professionnel de santé pour un diagnostic précis.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                  <div className="bg-blue-50 p-3 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-500 text-lg font-medium mb-1">Aucun résultat disponible</h3>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Téléchargez une image radiologique pour obtenir une analyse instantanée
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>© 2025 X-Ray Vision • Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}

export default xray;