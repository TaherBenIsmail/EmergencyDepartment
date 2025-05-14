import React, { useEffect, useState } from "react";
import { Search, Filter, Star, Calendar, MapPin, Heart } from "lucide-react";

interface Specialty {
  _id: string;
  name: string;
}

interface Doctor {
  _id: string;
  name: string;
  lastname: string;
  specialty: string;
  image: string;
  role: string;
}

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState({});
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch specialties
  useEffect(() => {
    fetch("http://localhost:3000/specialite/getspecialite")
      .then((res) => res.json())
      .then((data) => {
        const specialtyMap = {};
        data.forEach((s) => {
          specialtyMap[s._id] = s.name;
        });
        setSpecialties(specialtyMap);
      })
      .catch((error) => console.error("Error fetching specialties:", error));
  }, []);

  // Fetch doctors
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/user/getDoctors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filteredDoctors = data.filter((user) => user.role === "doctor");
          setDoctors(filteredDoctors);
        } else {
          console.error("Expected an array but got:", data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setIsLoading(false);
      });
  }, []);

  // Filter doctors based on selected specialty and search term
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    const matchesSearch = 
      searchTerm === "" || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doctor.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.specialty && specialties[doctor.specialty]?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSpecialty && matchesSearch;
  });

  // Handle appointment scheduling
  const handleMakeAppointment = (doctorId) => {
    window.location.href = `/MakeAppointment/${doctorId}`;
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header and introduction */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            Découvrez Nos Médecins
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Prenez rendez-vous avec nos médecins qualifiés dans diverses spécialités.
          </p>
        </div>

        {/* Search bar and filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un médecin par nom ou spécialité..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative md:w-1/3">
              <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="all">Toutes les spécialités</option>
                {Object.entries(specialties).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6 font-medium">
              {filteredDoctors.length} médecin{filteredDoctors.length !== 1 ? 's' : ''} trouvé{filteredDoctors.length !== 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="relative">
                      {/* Cover */}
                      <div className="h-24 bg-blue-500"></div>
                      
                      {/* Doctor photo */}
                      <div className="absolute -bottom-12 left-6">
                        <div className="rounded-full border-4 border-white bg-white shadow-md">
                          <img
                            src={
                              doctor.image
                                ? `http://localhost:3002/images/${doctor.image}`
                                : "/default-doctor.jpg"
                            }
                            alt={`Dr. ${doctor.name} ${doctor.lastname}`}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-16 pb-6 px-6">
                      {/* Doctor info */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          Dr. {doctor.name} {doctor.lastname}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {doctor.specialty && specialties[doctor.specialty]
                            ? specialties[doctor.specialty]
                            : "Spécialité non spécifiée"}
                        </p>
                      </div>

                      {/* Additional details */}
                      <div className="mb-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2 text-gray-400" />
                          <span className="text-sm">Disponible en téléconsultation</span>
                        </div>
                      </div>

                      {/* Appointment button */}
                      <button
                        onClick={() => handleMakeAppointment(doctor._id)}
                        className="w-full py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                      >
                        <Calendar size={18} className="mr-2" />
                        Prendre rendez-vous
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun médecin trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;