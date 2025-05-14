"use client";
import { useState, useEffect } from "react";

export default function Violence() {
  const [video, setVideo] = useState(null);
  const [label, setLabel] = useState("");
  const [isFight, setIsFight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [animateResult, setAnimateResult] = useState(false);

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    synth.speak(utter);
  };

  const playSiren = () => {
    const audio = new Audio("/sirene.mp3");
    audio.play();
  };

  useEffect(() => {
    if (isFight === true) {
      playSiren();
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000); // Popup visible for 5 seconds
    }
  }, [isFight]);

  useEffect(() => {
    if (label) {
      setAnimateResult(true);
      const timer = setTimeout(() => setAnimateResult(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [label]);

  // Simulate upload progress for better UX
  useEffect(() => {
    let interval;
    if (loading) {
      setUploadProgress(0);
      interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 400);
    } else if (uploadProgress > 0) {
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleUpload = async () => {
    if (!video) return;

    const formData = new FormData();
    formData.append("video", video);
    setLoading(true);
    setLabel("");
    setIsFight(null);

    try {
      const res = await fetch("http://localhost:3000/api/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const resultRaw = data.result || "";
      const lastWord = resultRaw.trim().split(/\s+/).pop().toLowerCase();

      if (lastWord === "fight") {
        setLabel("❗ Violence détectée !");
        setIsFight(true);
        speak("Attention, violence détectée !");
      } else if (lastWord === "nonfight") {
        setLabel("✅ Pas de violence détectée.");
        setIsFight(false);
        speak("Analyse terminée, aucune violence détectée.");
      } else {
        setLabel("❌ Résultat inconnu.");
        setIsFight(null);
        speak("Le résultat est inconnu.");
      }
    } catch (err) {
      console.error("Erreur :", err);
      setLabel("❌ Erreur lors de l'analyse.");
      setIsFight(null);
      speak("Erreur lors de l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setPreviewUrl(URL.createObjectURL(file));
      setLabel("");
      setIsFight(null);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideo(file);
        setPreviewUrl(URL.createObjectURL(file));
        setLabel("");
        setIsFight(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Détection de Violence</h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Système intelligent d'analyse vidéo pour détecter les situations de violence
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              {/* Drag & Drop Zone */}
              <div 
                className={`h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-700 font-medium mb-1">
                  {dragActive ? "Déposez votre fichier vidéo ici" : "Glissez et déposez votre fichier vidéo"}
                </p>
                <p className="text-gray-500 text-sm text-center">ou</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                  Parcourir vos fichiers
                </button>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept="video/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </div>

              {video && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 font-medium truncate">{video.name}</span>
                  </div>
                </div>
              )}

              {/* Analysis Button */}
              <button
                onClick={handleUpload}
                disabled={!video || loading}
                className={`w-full mt-6 px-6 py-3 rounded-lg flex items-center justify-center font-semibold transition-all duration-300 shadow-md ${
                  video && !loading
                    ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {!loading ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Lancer l'analyse
                  </>
                ) : (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyse en cours...
                  </>
                )}
              </button>

              {/* Upload Progress Bar */}
              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(uploadProgress)}%</p>
                </div>
              )}
            </div>

            <div className="md:w-1/2 bg-gray-50 p-8">
              {/* Video Preview */}
              {previewUrl ? (
                <div className="rounded-lg overflow-hidden shadow-md mb-6">
                  <video 
                    src={previewUrl} 
                    controls 
                    className="w-full h-64 object-cover bg-black"
                  />
                </div>
              ) : (
                <div className="h-64 rounded-lg bg-gray-200 flex items-center justify-center mb-6">
                  <p className="text-gray-500 text-center px-4">
                    L'aperçu vidéo sera affiché ici
                  </p>
                </div>
              )}

              {/* Analysis Result */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Résultat de l'analyse</h3>
                
                {label ? (
                  <div 
                    className={`p-6 rounded-lg border ${animateResult ? 'scale-105' : ''} transition-all duration-300 ${
                      isFight === true
                        ? "bg-red-50 border-red-200"
                        : isFight === false
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    <div className={`text-2xl font-bold mb-2 ${
                      isFight === true
                        ? "text-red-600"
                        : isFight === false
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}>
                      {isFight === true && (
                        <span className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {label}
                        </span>
                      )}
                      {isFight === false && (
                        <span className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {label}
                        </span>
                      )}
                      {isFight === null && label && (
                        <span className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {label}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      isFight === true
                        ? "text-red-500"
                        : isFight === false
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}>
                      {isFight === true && "Une situation de violence a été identifiée dans cette vidéo."}
                      {isFight === false && "Aucune violence n'a été détectée dans cette vidéo."}
                      {isFight === null && label && "Impossible de déterminer le contenu de cette vidéo."}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-gray-100 border border-gray-200">
                    <p className="text-gray-500">
                      {video 
                        ? "Cliquez sur 'Lancer l'analyse' pour détecter la violence"
                        : "Veuillez d'abord sélectionner une vidéo"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="mt-12 max-w-3xl mx-auto bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-800">À propos de cet outil</h3>
              <p className="mt-2 text-sm text-gray-600">
                Ce système utilise l'intelligence artificielle pour analyser les vidéos et détecter les situations de violence. 
                L'analyse est effectuée localement et prend généralement entre 10 et 30 secondes selon la durée de la vidéo.
                Une alerte sonore sera émise si une situation de violence est détectée.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Popup */}
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 flex justify-center z-50 animate-bounce">
          <div className="bg-red-600 text-white px-8 py-4 rounded-b-lg shadow-2xl flex items-center mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xl font-bold tracking-wider">ALERTE VIOLENCE DÉTECTÉE !</span>
          </div>
        </div>
      )}
    </div>
  );
}