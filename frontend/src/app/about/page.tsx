import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Page"
        description=""
      />

      {/* --- Hero/Doctor Section --- */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-10">
          {/* Left: Doctor Image and Video Call */}
          <div className="relative flex-1 w-full max-w-sm">
            <div className="absolute -top-6 -left-6 z-10 bg-white p-2 rounded-lg shadow-lg">
              <Image
                src="/images/doctor2.png"
                alt="Video Call Doctor"
                width={120}
                height={120}
                className="rounded-lg"
              />
              <div className="text-xs text-white bg-blue-900 py-1 px-2 mt-2 rounded">
                VIDEO CALL SUPPORT
              </div>
            </div>

            <Image
              src="/images/doctor1.png"
              alt="Main Doctor"
              width={400}
              height={500}
              className="rounded-xl shadow-xl w-full h-auto"
            />

            {/* Open Hours Card */}
            <div className="absolute bottom-0 right-0 bg-cyan-500 text-white p-5 rounded-xl w-60 shadow-lg">
              <h4 className="text-lg font-bold mb-2">Open Hours</h4>
              <ul className="text-sm space-y-1">
                <li>Monday: 09:30 – 07:30</li>
                <li>Tuesday: 09:30 – 07:30</li>
                <li>Wednesday: 09:30 – 07:30</li>
                <li>Thursday: 09:30 – 07:30</li>
                <li>Friday: 09:30 – 07:30</li>
                <li>Saturday: 09:30 – 07:30</li>
              </ul>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-bold text-blue-900 leading-tight">
              World ClassName Patient <br />
              Facilities Designed For You
            </h2>
            <p className="text-gray-600">
              Experience the future of healthcare. Our state-of-the-art facilities are
              equipped with the latest technology, ensuring you receive the world&apos;s
              best quality treatment. Here, cutting-edge tools meet unparalleled
              expertise, providing a comfortable and effective path to optimal health.
            </p>

            <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-gray-800">
              <ul className="space-y-2">
                <li>✔️ Comprehensive Specialties</li>
                <li>✔️ Emergency Services</li>
                <li>✔️ Intensive Care Units (ICUs)</li>
                <li>✔️ Telemedicine Facilities</li>
                <li>✔️ Multidisciplinary Team</li>
              </ul>
              <ul className="space-y-2">
                <li>✔️ Research and Development</li>
                <li>✔️ Advanced Imaging Services</li>
                <li>✔️ Rehabilitation Services</li>
                <li>✔️ Patient-Centric Approach</li>
                <li>✔️ Health Information Technology</li>
              </ul>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button className="bg-blue-900 text-white py-2 px-6 rounded-lg hover:bg-blue-800">
                Appointment →
              </button>
              <div>
                <p className="text-blue-800 text-sm">📞 Contact us?</p>
                <p className="font-bold text-blue-900">+1 123 456 7890</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Why Choose Us Section --- */}
      <section className="bg-[#0F2A55] py-16 text-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-10">
          {/* Left Image */}
          <div className="relative w-full max-w-md">
            <Image
              src="/images/doctor3.png"
              alt="Doctor with Family"
              width={500}
              height={500}
              className="rounded-2xl"
            />
            <div className="absolute bottom-0 right-0 bg-cyan-500 text-white text-center px-6 py-4 rounded-xl shadow-xl">
              <p className="text-3xl font-bold">20+</p>
              <p className="text-sm">Years Experienced</p>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-8">
              Why Choose Us For Your Health Care Needs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "More Experience",
                  desc: "We offer a wide range of health services to meet all your needs.",
                },
                {
                  title: "Seamless care",
                  desc: "We offer a wide range of health services to meet all your needs.",
                },
                {
                  title: "The right answers?",
                  desc: "We offer a wide range of health services to meet all your needs.",
                },
                {
                  title: "Unparalleled expertise",
                  desc: "We offer a wide range of health services to meet all your needs.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#1A3B66] p-6 rounded-xl shadow-md space-y-2"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-cyan-500 text-white rounded-full text-lg font-bold">
                    ✓
                  </div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* --- Call to Action + Accepted Insurance + Contact Info --- */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="container mx-auto">
          {/* Call to Action */}
          <div
        className="bg-white bg-[url('/images/doctor5.png')] bg-no-repeat bg-right bg-contain rounded-3xl shadow-md p-10 flex flex-col lg:flex-row items-center justify-between gap-10 min-h-[300px]"
      >
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Schedule Your Consultation Today!
          </h2>
          <button className="bg-cyan-500 text-white font-medium px-6 py-2 rounded-lg hover:bg-cyan-600 flex items-center gap-2">
            Appointment
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>


{/* Insurance Logos */}
<div className="mt-16 text-center">
  <h3 className="text-2xl font-bold text-blue-900 mb-6">Our Accepted Insurance</h3>
  <div className="flex flex-wrap items-center justify-center gap-6">
    {["logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo5.png", "logo6.png"].map((logo, idx) => (
      <div
        key={idx}
        className="w-32 h-20 flex items-center justify-center bg-white rounded-xl shadow-md p-2"
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


    {/* Contact Info */}
    <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center border-t border-gray-300 pt-10">
      <div>
        <h4 className="text-blue-900 font-semibold text-lg mb-2">Get in Touch with us</h4>
        <p className="text-gray-500 text-sm">Lorem Ipsum is simply dummy</p>
      </div>
      <div>
        <div className="flex justify-center mb-2">
          <div className="bg-blue-900 text-white rounded-full p-2">📞</div>
        </div>
        <h4 className="font-medium text-blue-900">Call Us</h4>
        <p className="text-sm text-gray-600">+1 123 456 7890</p>
      </div>
      <div>
        <div className="flex justify-center mb-2">
          <div className="bg-blue-900 text-white rounded-full p-2">📧</div>
        </div>
        <h4 className="font-medium text-blue-900">Send us a Mail</h4>
        <p className="text-sm text-gray-600">info@example.com</p>
      </div>
      <div>
        <div className="flex justify-center mb-2">
          <div className="bg-blue-900 text-white rounded-full p-2">🕒</div>
        </div>
        <h4 className="font-medium text-blue-900">Opening Time</h4>
        <p className="text-sm text-gray-600">Mon - Sat: 7:00 - 17:00</p>
      </div>
    </div>
  </div>
</section>

    </>
  );
};

export default AboutPage;
