"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { AlertTriangle, Clock, Calendar, Phone, User, Stethoscope, FileText, MessageCircle, ArrowRight } from "lucide-react";

// Component imports
import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import Chatbot from "@/components/chatbot";
import Doctors from "@/components/Doctors";
import AppointmentList from "@/components/AppointmentList";
import AppointmentListDoctor from "@/components/AppontmentListDoctor";
import FacturePage from "./facture/page";
import MesFactures from "./facture/mes-factures/page";
import TablePage from './document/table/page';

const Home: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState(null);
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/session", {
          withCredentials: true,
        });
        setRole(response.data.user.role);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-blue-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute top-0 w-24 h-24 border-4 border-blue-600 rounded-full animate-ping opacity-20"></div>
            <div className="w-24 h-24 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-blue-800">Emergency Response System</h2>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const navigateToEmergencyAppointment = () => {
    setEmergencyMode(true);
    router.push(`/emergency-appointment`);
  };

  const navigateToAppointment = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to continue!");
      return;
    }
    router.push(`/makeappointment/${userId}`);
  };

  // Emergency Hero Section
  const EmergencyHero = () => (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/emergency-pattern.svg')] opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 w-8 h-8 mr-2" />
              <h2 className="text-xl font-bold text-white">EMERGENCY RESPONSE</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Rapid Care When <span className="text-red-400">Every Second</span> Counts
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Our emergency department is equipped with state-of-the-art technology and staffed by experienced healthcare professionals ready to provide immediate care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={navigateToEmergencyAppointment}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center transition-all transform hover:scale-105"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Emergency Assistance
              </button>
              <button 
                onClick={navigateToAppointment}
                className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-800 font-bold rounded-lg flex items-center justify-center transition-all"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Appointment
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Emergency Response Times</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                  <p className="text-gray-700">Current Wait Time: <span className="font-bold">10 minutes</span></p>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  <p className="text-gray-700">Available Doctors: <span className="font-bold">8</span></p>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                  <p className="text-gray-700">Ambulance Status: <span className="font-bold">Available</span></p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Emergency Contacts</h4>
                <div className="flex items-center text-lg font-bold text-red-600">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>911</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Emergency Services Section
  const EmergencyServices = () => (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">Our Emergency Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Clock className="w-12 h-12 text-blue-600" />,
              title: "24/7 Emergency Care",
              description: "Round-the-clock emergency medical services with experienced staff ready to respond to any situation."
            },
            {
              icon: <User className="w-12 h-12 text-blue-600" />,
              title: "Trauma Center",
              description: "Advanced trauma care with specialized equipment and trauma-trained medical professionals."
            },
            {
              icon: <Stethoscope className="w-12 h-12 text-blue-600" />,
              title: "Specialized Care",
              description: "Expert care for cardiac events, strokes, severe injuries, and other emergency situations."
            }
          ].map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 transition-all hover:shadow-xl">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Quick Actions Section
  const QuickActions = () => (
    <section className="py-12 bg-blue-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Calendar className="w-8 h-8 text-blue-200" />,
              title: "Appointments",
              description: "Schedule or view your upcoming appointments",
              action: "View Calendar",
              path: "/appointments"
            },
            {
              icon: <FileText className="w-8 h-8 text-blue-200" />,
              title: "Medical Records",
              description: "Access your medical history and reports",
              action: "View Records",
              path: "/records"
            },
            {
              icon: <MessageCircle className="w-8 h-8 text-blue-200" />,
              title: "Consult Online",
              description: "Chat with available doctors",
              action: "Start Chat",
              path: "/chat"
            },
            {
              icon: <Phone className="w-8 h-8 text-blue-200" />,
              title: "Emergency Hotline",
              description: "Direct line to emergency services",
              action: "Call Now",
              path: "tel:911"
            }
          ].map((item, index) => (
            <div key={index} className="bg-blue-700 rounded-lg p-6 text-white hover:bg-blue-600 transition-all cursor-pointer">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-blue-100 mb-4">{item.description}</p>
              <div className="flex items-center text-blue-200 font-medium">
                {item.action}
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <ScrollUp />
      
      {/* Different views based on user role */}
      {role === "doctor" ? (
        <>
          <TablePage />
          <FacturePage />
          <AppointmentListDoctor />
        </>
      ) : (
        <>
          {/* Replace generic Hero with Emergency-focused Hero */}
          <EmergencyHero />
          
          {/* Add Emergency Services section */}
          <EmergencyServices />
          
          {/* Add Quick Actions section */}
          <QuickActions />
          
          {/* Original components */}
          <MesFactures />
          <Chatbot />
          <AppointmentList />
          <Doctors />
        </>
      )}
    </>
  );
};

export default Home;