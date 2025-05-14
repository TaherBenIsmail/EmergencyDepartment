"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";

export default function MakeAppointment() {
  const pathname = usePathname();
  const router = useRouter();
  const [doctorId, setDoctorId] = useState(undefined);
  const [doctorFullName, setDoctorFullName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [token, setToken] = useState(null);

  // Récupérer le doctorId depuis l'URL
  useEffect(() => {
    if (pathname) {
      const doctorIdFromUrl = pathname.split("/").pop();
      setDoctorId(doctorIdFromUrl);
      console.log("doctorId récupéré depuis l'URL :", doctorIdFromUrl);
    }
  }, [pathname]);

  // Récupérer les informations du médecin
  useEffect(() => {
    if (doctorId) {
      console.log("Tentative de récupération du médecin avec doctorId :", doctorId);
      axios
        .get(`http://localhost:3000/user/getDoctor/${doctorId}`)
        .then((response) => {
          const { name, lastname } = response.data;
          setDoctorFullName(`${name} ${lastname}`);
          console.log("Nom du médecin récupéré :", doctorFullName);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du médecin :", error);
        });
    }
  }, [doctorId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        // Vérification basique du token
        if (storedToken.split('.').length === 3) {
          setToken(storedToken);
        } else {
          console.error("Token mal formaté");
          localStorage.removeItem("token");
        }
      }
    }
  }, []);
  
  const handleAppointment = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      alert("Veuillez vous reconnecter");
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:3000/makeappointment',
        {
          doctorId,
          userId,
          date: selectedDate?.toISOString().split('T')[0],
          time: selectedTime
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Si la réservation est effectuée avec succès
      if (response.status === 201) {
        alert("Rendez-vous confirmé avec succès !");
        router.push("/"); // Redirection après confirmation
      }
      
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Session expirée, veuillez vous reconnecter");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      } else if (error.response?.status === 409) {
        // Si le créneau est déjà réservé
        alert("Ce créneau est déjà réservé. Veuillez en choisir un autre.");
      } else {
        console.error("Erreur lors de la réservation :", error);
      }
    }
  };
  
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // Vérifier si toutes les conditions sont remplies pour activer le bouton
  const isButtonDisabled = !selectedDate || !selectedTime;

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-6">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          Prendre un rendez-vous avec {doctorFullName || "le médecin"}
        </h2>
        
        <p className="text-gray-500 mb-8 text-center">
          Sélectionnez une date et une heure disponibles pour votre consultation
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <FaCalendarAlt className="text-blue-600" />
                <label className="text-blue-600 font-medium">Date</label>
              </div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                className="w-full p-3 rounded-xl bg-white border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <label className="text-blue-600 font-medium">Heure</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    className={`p-3 rounded-lg transition-all ${
                      selectedTime === time
                        ? "bg-blue-600 text-white font-medium"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="mb-6">
              <Image 
                src="/images/doctor-3d.png" 
                alt="Médecin" 
                width={200} 
                height={200} 
                className="mx-auto"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-blue-600 font-medium">Informations rendez-vous</span>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Médecin:</span>
                  <span className="font-medium">{doctorFullName || "Non sélectionné"}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">
                    {selectedDate ? selectedDate.toLocaleDateString() : "Non sélectionnée"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Heure:</span>
                  <span className="font-medium">{selectedTime || "Non sélectionnée"}</span>
                </div>
              </div>
            </div>
            
            <button
              className={`w-full py-4 mt-6 rounded-xl font-medium flex items-center justify-center gap-2 ${
                isButtonDisabled
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={handleAppointment}
              disabled={isButtonDisabled}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Confirmer le rendez-vous
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}