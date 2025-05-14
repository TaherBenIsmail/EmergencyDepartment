"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Facture {
  _id: string;
  totalCost?: number;
  tva?: number;
  subtotal?: number;
  daysSpent: number;
  extraCharges: number;
  extraDetails: string[];
  treatments: { name: string; cost: number }[];
  doctor: { name: string; lastname: string };
  createdAt: string;
  description?: string;
  status: string;
}

interface User {
  email: string;
  role: string;
}

export default function MesFactures() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const session = await axios.get("http://localhost:3000/user/session", {
          withCredentials: true,
        });
        setUser(session.data.user);

        const res = await axios.get("http://localhost:3000/user/factures/patient", {
          withCredentials: true,
        });
        setFactures(res.data);
      } catch (err) {
        console.error("❌ Erreur chargement factures :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStripePayment = async (billId: string, amount: number) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/user/create-checkout-session",
        {
          amount,
          billId,
          patientEmail: user?.email,
        },
        { withCredentials: true }
      );

      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      console.error("❌ Erreur Stripe :", err);
    }
  };

  const handleFlouciPayment = async (billId: string, amount: number) => {
    if (!amount || amount <= 0) {
      alert("Montant invalide. Veuillez vérifier la facture.");
      return;
    }
  
    try {
      const res = await axios.post(
        "http://localhost:3000/user/flouci/create-payment",
        {
          amount: Math.round(amount * 1000), // 💡 en millimes (ex: 64.2 TND → 64200)
          billId,
          patientEmail: user?.email,
        },
        { withCredentials: true }
      );
  
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      console.error("❌ Erreur Flouci :", err);
      alert("Erreur lors du paiement avec Flouci.");
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Mes Factures</h1>
          <p className="text-blue-600">Gérez et payez vos factures médicales</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : factures.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Aucune facture trouvée</h2>
            <p className="text-gray-500">Vos factures apparaîtront ici une fois émises</p>
          </div>
        ) : (
          <div className="space-y-8">
            {factures.map((facture) => (
              <div
                key={facture._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 border-blue-500"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1">
                        Docteur {facture.doctor?.name} {facture.doctor?.lastname}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Émise le {formatDate(facture.createdAt)}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium 
                      ${facture.status === "paid" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-amber-100 text-amber-800"}`}
                    >
                      {facture.status === "paid" ? "Payée" : "En attente de paiement"}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-blue-800 font-semibold mb-3 flex items-center">
                        <span className="mr-2">💊</span> Traitements
                      </h3>
                      <ul className="space-y-2">
                        {facture.treatments.map((t, i) => (
                          <li key={i} className="flex justify-between items-center text-gray-700">
                            <span>{t.name}</span>
                            <span className="font-medium">{t.cost.toFixed(2)} TND</span>
                          </li>
                        ))}
                      </ul>

                      {facture.description && (
                        <div className="mt-6">
                          <h3 className="text-blue-800 font-semibold mb-2 flex items-center">
                            <span className="mr-2">✍️</span> Remarques
                          </h3>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-md italic">
                            {facture.description}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      {facture.extraDetails?.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-blue-800 font-semibold mb-3 flex items-center">
                            <span className="mr-2">➕</span> Suppléments
                          </h3>
                          <ul className="space-y-1 text-gray-700">
                            {facture.extraDetails.map((label, i) => (
                              <li key={i} className="flex items-center">
                                <span className="text-blue-500 mr-2">•</span> {label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mb-4">
                        <h3 className="text-blue-800 font-semibold mb-2 flex items-center">
                          <span className="mr-2">📅</span> Durée
                        </h3>
                        <p className="text-gray-700">
                          {facture.daysSpent} {facture.daysSpent > 1 ? "jours" : "jour"}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 mt-4">
                        <div className="flex justify-between text-gray-700 mb-2">
                          <span>Sous-total:</span>
                          <span>{facture.subtotal?.toFixed(2) || "—"} TND</span>
                        </div>
                        <div className="flex justify-between text-gray-700 mb-2">
                          <span>TVA (7%):</span>
                          <span>{facture.tva?.toFixed(2) || "—"} TND</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-blue-800 pt-2 border-t border-blue-200">
                          <span>Total TTC:</span>
                          <span>{facture.totalCost?.toFixed(2) || "—"} TND</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {facture.status !== "paid" && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h3 className="text-blue-800 font-semibold mb-3">Méthodes de paiement</h3>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleStripePayment(facture._id, facture.totalCost || 0)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300"
                        >
                          <span className="mr-2">💳</span> Payer avec Stripe
                        </button>
                        <button
                          onClick={() => handleFlouciPayment(facture._id, facture.totalCost || 0)}
                          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300"
                        >
                          <span className="mr-2">💳</span> Payer avec Flouci
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}