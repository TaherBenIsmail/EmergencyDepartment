"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Video from "@/components/Video";
import Brands from "@/components/Brands";
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import TablePage from './document/table/page';
import Chatbot from "@/components/chatbot";
import Doctors from "@/components/Doctors";
import Symptomes from "@/components/Symptomes";

import AppointmentList from "@/components/AppointmentList";
import AppointmentListDoctor from "@/components/AppontmentListDoctor";
import FacturePage from "./facture/page";
import MesFactures from "./facture/mes-factures/page";
import ViolenceDetectionPage from "./violence/page";
import Xray from "./rx-radiolgy/page";
import 'animate.css';
import Image from "next/image";



const Home: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/session", {
          withCredentials: true,
        });
        console.log("response", response);
        setRole(response.data.user.role);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user role", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/session", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("❌ Erreur session :", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);


 useEffect(() => {
  // Dynamically import WOW only on client side
  import('wowjs').then((module) => {
    const WOW = module.WOW;
    new WOW({ live: false }).init();
  });
}, []);


  // if (user?.role === "doctor") {
  //   return <FacturePage />;
  // }

  // if (user?.role === "patient") {
  //   return <MesFactures />;
  // }


  const navigateToAppointment = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Veuillez vous reconnecter !");
      return;
    }

    router.push(`/makeappointment/${userId}`);
  };

  

  return (
    <>
      <ScrollUp />
      <main className="min-h-screen bg-blue-50 font-sans">
    {/* Section principale */}
  <section className="relative bg-gradient-to-b from-blue-100 to-white py-24 px-6 md:px-20 overflow-hidden">
  <div className="grid md:grid-cols-2 items-center gap-10 max-w-7xl mx-auto">
    <div>
      <span className="inline-flex items-center text-sm font-medium text-blue-800 bg-blue-100 px-4 py-1 rounded-full mb-6 shadow-sm">
        ✅ Service 24/7 • 100% confiance
      </span>
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
        Soins médicaux d'<span className="text-blue-700">urgence</span><br /> fiables & rapides
      </h1>
      <p className="text-gray-600 text-lg mb-8">
        Notre équipe médicale est disponible jour et nuit pour tous vos besoins vitaux.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-blue-300 transition-all duration-300 transform hover:scale-105">
          🚑 Urgence immédiate
        </button>
        <button className="bg-white border border-blue-700 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all duration-300 hover:scale-105">
          📅 Prendre rendez-vous
        </button>
      </div>
    </div>

    <div className="relative">
      <img
        src="/images/team-hospital.png"
        alt="Équipe médicale"
        className="w-full rounded-3xl shadow-2xl"
      />
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-lg flex items-center gap-4 animate__animated animate__fadeInUp animate__delay-1s">
        <div className="bg-blue-100 p-3 rounded-full">
          <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">Temps d'attente</p>
          <p className="text-green-600 font-bold">15-20 min</p>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="py-20 px-6 md:px-20 bg-gradient-to-b from-white to-blue-50">
  <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 wow animate__animated animate__fadeInUp">
    🚑 Nos services d'urgence
  </h2>
  <div className="grid md:grid-cols-3 gap-10 text-center">
    {[
      {
        icon: "fas fa-ambulance",
        title: "Urgences générales",
        desc: "Prise en charge rapide de tout type d'urgence, 24h/24.",
        delay: "0.1s",
      },
      {
        icon: "fas fa-procedures",
        title: "Soins intensifs",
        desc: "Unités spécialisées pour les cas critiques avec surveillance continue.",
        delay: "0.3s",
      },
      {
        icon: "fas fa-x-ray",
        title: "Imagerie médicale",
        desc: "Radiographies, scanners et IRM pour diagnostics immédiats.",
        delay: "0.5s",
      },
    ].map((service, index) => (
      <div
        key={index}
        className={`wow animate__animated animate__zoomIn p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out border border-blue-100 hover:scale-105`}
        data-wow-delay={service.delay}
      >
        <div className="text-blue-600 text-5xl mb-4 transition-transform duration-300 hover:scale-110">
          <i className={service.icon}></i>
        </div>
        <h3 className="text-2xl font-semibold text-blue-800 mb-3">{service.title}</h3>
        <p className="text-gray-600">{service.desc}</p>
      </div>
    ))}
  </div>
</section>

<section className="py-24 px-6 md:px-20 bg-white">
  <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
    {/* IMAGE */}
    <div className="wow animate__animated animate__fadeInLeft">
      <img
        src="/images/team-hospital.png" // Remplace ici avec le chemin réel
        alt="Équipe médicale"
        className="rounded-3xl shadow-2xl w-full"
      />
    </div>

    {/* CONTENT */}
    <div className="wow animate__animated animate__fadeInRight">
      <p className="text-teal-600 font-semibold uppercase mb-3">À propos de nous</p>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Nous sommes certifiés pour offrir<br className="hidden md:block" />
        les meilleurs soins médicaux
      </h2>
      <p className="text-gray-600 text-lg mb-8">
        Notre mission est de fournir des soins de santé de la plus haute qualité, basés sur la
        science, l’éthique, et l’humanité. Grâce à notre équipe expérimentée, nous mettons
        votre bien-être au cœur de nos priorités.
      </p>

      {/* List */}
      <ul className="space-y-4 mb-8">
        {[
          "Compétences scientifiques pour de meilleurs résultats",
          "Un environnement de travail sain",
          "Médecins professionnels certifiés",
          "Services d’urgence avancés",
          "Laboratoire digitalisé",
        ].map((item, i) => (
          <li key={i} className="flex items-center space-x-3 text-gray-700 text-base">
            <span className="text-teal-500 text-xl">
              <i className="fas fa-check-circle"></i>
            </span>
            <span className="font-medium">{item}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 transform hover:scale-105">
        En savoir plus
      </button>
    </div>
  </div>
</section>
{/* Insurance Logos */}
<div className="mt-16 text-center">
  <h3 className="text-2xl font-bold text-blue-900 mb-6">Our Accepted Insurance</h3>
  <div className="flex flex-wrap items-center justify-center gap-6">
    {["logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo5.png", "logo6.png"].map((logo, idx) => (
      <div
        key={idx}
        className="w-32 h-20 flex items-center justify-center bg-white rounded-xl shadow-md p-2 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
      >
        <Image
          src={`/images/${logo}`}
          alt={`Insurance Logo ${idx + 1}`}
          width={96}
          height={60}
          className="object-contain w-full h-full"
        />
      </div>
    ))}
  </div>
</div>


<section className="py-24 px-6 md:px-20 bg-white">
  <div className="max-w-7xl mx-auto text-center mb-16">
    <p className="text-blue-600 font-semibold uppercase tracking-wide mb-2">Blog posts</p>
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 wow animate__animated animate__fadeInDown">
      Dernières actualités santé
    </h2>
  </div>

  <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
    {[
      {
        img: "/images/blog-1.png",
        date: "1 Mai 2023",
        title: "La méditation pleine conscience contre le stress",
      },
      {
        img: "/images/blog-2.png",
        date: "4 Mai 2023",
        title: "Bien manger sans se ruiner : astuces santé",
      },
      {
        img: "/images/blog-3.png",
        date: "1 Mai 2023",
        title: "L'importance du dépistage précoce du cancer",
      },
    ].map((post, index) => (
      <div
        key={index}
        className="wow animate__animated animate__fadeInUp bg-white rounded-2xl shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-xl"
        data-wow-delay={`${0.2 + index * 0.2}s`}
      >
        <img src={post.img} alt={post.title} className="w-full h-56 object-cover" />
        <div className="p-6 text-left">
          <p className="text-sm text-gray-500 mb-2">{post.date}</p>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{post.title}</h3>

          <div className="flex items-center justify-between text-sm text-blue-500 mb-4">
            <div className="flex space-x-3">
              <a href="#"><i className="fab fa-linkedin hover:text-blue-700 transition"></i></a>
              <a href="#"><i className="fab fa-twitter hover:text-blue-400 transition"></i></a>
              <a href="#"><i className="fab fa-facebook hover:text-blue-600 transition"></i></a>
            </div>
          </div>

          <a
            href="#"
            className="inline-block text-sm text-blue-600 font-medium hover:underline"
          >
            En savoir plus →
          </a>
        </div>
      </div>
    ))}
  </div>
</section>




  </main>
      {role === "doctor" }
      
      {/* Conditional Rendering for Patients */}
      {role === "patient" && <MesFactures/>}    
            {role === "patient" && <Symptomes/>}    
      {role === "doctor" && <ViolenceDetectionPage/>} 
      {role === "doctor" && <Xray/>}
      {role === "doctor" && <FacturePage />}
      {role === "patient" && <Chatbot />}
      {role === "patient" && <AppointmentList />} 
      {role === "doctor" && <AppointmentListDoctor />} 
      {role === "patient" && <Doctors />}
      {role === "patient" && (
        <button onClick={navigateToAppointment}>Make Appointment</button>
      )}
      
    </>
  );
};

export default Home;