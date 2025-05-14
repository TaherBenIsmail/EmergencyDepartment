"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Patient {
  _id: string;
  name: string;
  lastname: string;
}

interface Treatment {
  name: string;
  cost: number;
}

interface User {
  role: string;
  name: string;
  email: string;
}

export default function FacturePage() {
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [daysSpent, setDaysSpent] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const FIXED_TREATMENTS: Treatment[] = [
    { name: "Consultation rapide", cost: 30 },
    { name: "Injection d'urgence", cost: 45 },
    { name: "Radiographie", cost: 80 },
    { name: "Hospitalisation brève", cost: 150 },
    { name: "Transfusion", cost: 100 },
  ];

  const EXTRA_OPTIONS = [
    { label: "🥘 Repas spécial", value: 30 },
    { label: "🩺 Suivi personnalisé", value: 80 },
  ];

  useEffect(() => {
    const fetchUserAndPatients = async () => {
      try {
        const userRes = await axios.get("http://localhost:3000/user/session", {
          withCredentials: true,
        });
        setUser(userRes.data.user);

        if (userRes.data.user.role === "doctor") {
          const patientsRes = await axios.get("http://localhost:3000/user/listPatients", {
            withCredentials: true,
          });
          setPatients(patientsRes.data);
        }
      } catch (err) {
        console.error("❌ Erreur :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPatients();
  }, []);

  const toggleTreatment = (t: Treatment) => {
    setTreatments((prev) =>
      prev.find((tr) => tr.name === t.name)
        ? prev.filter((tr) => tr.name !== t.name)
        : [...prev, t]
    );
  };

  const toggleExtra = (value: number) => {
    setSelectedExtras((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const subtotal =
    treatments.reduce((sum, t) => sum + t.cost, 0) +
    daysSpent * 100 +
    selectedExtras.reduce((sum, e) => sum + e, 0);

  const tva = subtotal * 0.07;
  const totalTTC = subtotal + tva;

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const billData = {
      patientId: selectedPatient,
      treatments,
      daysSpent,
      extraCharges: selectedExtras.reduce((a, b) => a + b, 0),
      extraDetails: selectedExtras.map(v => EXTRA_OPTIONS.find(e => e.value === v)?.label),
      description,
    };

    try {
      const res = await axios.post("http://localhost:3000/user/facture/create", billData, {
        withCredentials: true,
      });
      setShowSuccess(true);
      // Reset form
      setSelectedPatient("");
      setTreatments([]);
      setDaysSpent(0);
      setSelectedExtras([]);
      setDescription("");
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error("❌ Erreur :", err);
      alert("Erreur lors de la création de la facture.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-600 font-medium text-lg mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "doctor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md mx-auto border-t-4 border-t-red-500">
          <div className="text-red-500 text-5xl mb-6">⛔️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Accès non autorisé</h2>
          <p className="text-slate-600 mb-8">Vous devez être connecté en tant que médecin pour accéder à cette page.</p>
          <a
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-200"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      {showSuccess && (
        <div className="fixed top-6 right-6 bg-white border-l-4 border-blue-500 text-slate-700 p-4 rounded-lg shadow-xl animate-fade-in-down z-50">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-3">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium">Facture créée avec succès!</p>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Nouvelle Facture</h1>
        </div>
        
        <form
          onSubmit={handleCreateBill}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Patient Selection */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-600 mb-2">Patient</label>
                <div className="relative">
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 appearance-none"
                    required
                  >
                    <option value="">-- Sélectionner un patient --</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} {p.lastname}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-slate-50 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Traitements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FIXED_TREATMENTS.map((t, idx) => (
                <label
                  key={idx}
                  className={`relative flex items-center p-4 border rounded-xl transition-all duration-200 cursor-pointer overflow-hidden
                    ${treatments.some((tr) => tr.name === t.name) 
                      ? "bg-white border-blue-500 shadow-md" 
                      : "bg-white border-slate-200 hover:border-blue-200"}`}
                >
                  <input
                    type="checkbox"
                    className="absolute opacity-0"
                    checked={treatments.some((tr) => tr.name === t.name)}
                    onChange={() => toggleTreatment(t)}
                  />
                  {treatments.some((tr) => tr.name === t.name) && (
                    <div className="absolute top-0 right-0">
                      <div className="w-8 h-8 bg-blue-500 flex items-center justify-center -translate-x-1/2 translate-y-1/2 rotate-45 transform">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                      <span className="text-blue-600 font-bold">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <span className="block font-medium text-slate-800">{t.name}</span>
                      <span className="block text-blue-600 font-bold mt-1">{t.cost} TND</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div className="p-8 border-b border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Options supplémentaires */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Options supplémentaires</h3>
                <div className="space-y-3">
                  {EXTRA_OPTIONS.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-200
                        ${selectedExtras.includes(opt.value) 
                          ? "bg-white border-blue-500 shadow-md" 
                          : "bg-white border-slate-200 hover:border-blue-200"}`}
                    >
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="absolute opacity-0"
                          checked={selectedExtras.includes(opt.value)}
                          onChange={() => toggleExtra(opt.value)}
                        />
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${selectedExtras.includes(opt.value) ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                          {selectedExtras.includes(opt.value) && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="block font-medium text-slate-800">{opt.label}</span>
                        <span className="text-blue-600 font-bold">{opt.value} TND</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Jours */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Jours d'hospitalisation</h3>
                <div className="bg-white p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      type="button"
                      onClick={() => setDaysSpent(Math.max(0, daysSpent - 1))}
                      className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="text-4xl font-bold text-slate-800">{daysSpent}</span>
                    <button 
                      type="button"
                      onClick={() => setDaysSpent(daysSpent + 1)}
                      className="w-12 h-12 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Prix par jour</span>
                    <span className="font-medium">100 TND</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm font-medium">
                    <span>Total jours</span>
                    <span className="text-blue-600 font-bold">{daysSpent * 100} TND</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="p-8 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Remarques / Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 h-24"
              placeholder="Ex : soins intensifs, patient sous surveillance..."
            />
          </div>
          
          {/* Totaux */}
          <div className="p-8 border-b border-slate-100">
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Traitements</span>
                    <span>{treatments.reduce((sum, t) => sum + t.cost, 0).toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Hospitalisation ({daysSpent} jours)</span>
                    <span>{(daysSpent * 100).toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Options supplémentaires</span>
                    <span>{selectedExtras.reduce((sum, e) => sum + e, 0).toFixed(2)} TND</span>
                  </div>
                  <div className="pt-3 flex justify-between items-center text-slate-700 border-t border-slate-200">
                    <span className="font-medium">Sous-total</span>
                    <span className="font-bold">{subtotal.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>TVA (7%)</span>
                    <span>{tva.toFixed(2)} TND</span>
                  </div>
                </div>
                <div className="bg-white p-6 flex flex-col justify-center border-l border-slate-100">
                  <div className="mb-2 text-center">
                    <span className="text-sm text-slate-500">TOTAL TTC</span>
                  </div>
                  <div className="text-center text-4xl font-bold text-blue-600">
                    {totalTTC.toFixed(2)} <span className="text-lg">TND</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bouton */}
          <div className="p-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !selectedPatient}
              className={`px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center
                ${submitting || !selectedPatient
                  ? "bg-slate-300 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-1 hover:shadow-blue-200"}`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <span className="mr-2">Générer la facture</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}