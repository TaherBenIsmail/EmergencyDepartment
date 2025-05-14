"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaTimesCircle, FaTrashAlt, FaCalendarAlt } from "react-icons/fa";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  // Récupérer la liste des rendez-vous de l'utilisateur
  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/makeappointment/appointments/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des rendez-vous.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDeleteAppointment = async (appointmentId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `http://localhost:3000/makeappointment/${appointmentId}`
      );
      if (response.status === 200) {
        setAppointments(appointments.filter((appointment) => appointment.id !== appointmentId));
        alert("Rendez-vous supprimé avec succès !");
        setShowConfirmDelete(null);
      }
    } catch (err) {
      alert("Erreur lors de la suppression du rendez-vous.");
    }
  };

  const confirmDelete = (appointmentId) => {
    setShowConfirmDelete(appointmentId);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          icon: <FaCheckCircle className="text-blue-600" />
        };
      case "pending":
        return {
          bg: "bg-orange-100",
          text: "text-orange-600",
          icon: <FaClock className="text-orange-600" />
        };
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          icon: <FaTimesCircle className="text-red-600" />
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: <FaClock className="text-gray-600" />
        };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed": return "Confirmé";
      case "pending": return "En attente";
      case "cancelled": return "Annulé";
      default: return "Inconnu";
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center">
            <FaCalendarAlt className="text-white text-2xl" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Mes Rendez-vous
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Consultez et gérez vos rendez-vous médicaux
        </p>

        {loading ? (
          <div className="text-center text-gray-600 p-8">Chargement...</div>
        ) : error ? (
          <div className="text-center text-red-500 p-8">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-gray-600 p-8">Aucun rendez-vous trouvé.</div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appointment) => {
              const statusStyle = getStatusColor(appointment.status);
              
              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-md p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-semibold text-blue-600">
                        {appointment.doctorName}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {appointment.date} à {appointment.time}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {statusStyle.icon}
                        <span>{getStatusText(appointment.status)}</span>
                      </span>

                      {showConfirmDelete === appointment.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm font-medium hover:bg-red-200"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => confirmDelete(appointment.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrashAlt />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}