import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Zap,
  Map as MapIcon,
  BarChart3,
  Clock,
  EyeOff
} from "lucide-react";

//Carousel for Key Capabilities
import { useEffect, useState } from "react";

// NEXT
export default function Landing() {

  /* === INSIDE LANDING PAGE COMPONENT === */
  const [featureIndex, setFeatureIndex] = useState(0);

  const features = [
    {
      icon: Zap,
      title: "Automated Classification",
      desc: "Issues are categorized and prioritized automatically to ensure faster response times.",
    },
    {
      icon: MapIcon,
      title: "Location-Based Reporting",
      desc: "Identify the exact campus location to assist maintenance teams.",
    },
    {
      icon: Shield,
      title: "Transparent Tracking",
      desc: "Track complaint status and resolution history in real time.",
    },
    {
      icon: Clock,
      title: "SLA-Based Resolution",
      desc: "Complaints are handled within defined time limits to ensure accountability.",
    },
    {
      icon: EyeOff,
      title: "Anonymous Complaints",
      desc: "Report sensitive issues without revealing your identity.",
    },
    {
      icon: BarChart3,
      title: "Admin Analytics Dashboard",
      desc: "Admins can monitor trends and department performance.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="text-xl font-semibold tracking-tight">CampusFix</div>
        <Link
          to="/login"
          className="px-5 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Campus Issue Reporting & Grievance Portal
          </h1>

          <p className="text-gray-700 mb-6 max-w-3xl">
            A centralized platform for students and staff to report
            campus-related issues, track resolution progress, and ensure
            accountability through transparent workflows.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
            >
              Lodge a Complaint <ArrowRight size={18} />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition"
            >
              View Features
            </a>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="max-w-6xl mx-auto px-6 pb-16 overflow-hidden">
        <h2 className="text-2xl font-bold text-center mb-10">
          Key Capabilities
        </h2>

        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${featureIndex * (100 / 3)}%)`,
          }}
        >
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="min-w-full md:min-w-[33.333%] px-3">
                <div className="bg-white border border-gray-200 rounded-lg p-6 h-full">
                  <Icon size={28} className="text-red-600 mb-3" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-white border-t border-gray-200 py-16"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-10">System Features</h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Zap size={18} className="text-red-600" />
                Efficient Complaint Submission
              </h3>
              <p className="text-gray-700 mb-4">
                Submit complaints with supporting images and location details
                through a structured and easy-to-use interface.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Photo evidence support</li>
                <li>• Campus location tagging</li>
                <li>• Priority assignment</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <BarChart3 size={18} className="text-red-600" />
                Administrative Oversight
              </h3>
              <p className="text-gray-700 mb-4">
                Administrators can monitor complaint volumes, resolution times,
                and departmental performance.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Analytics dashboard</li>
                <li>• Department assignment</li>
                <li>• Resolution tracking</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Shield size={18} className="text-red-600" />
                Secure & Controlled Access
              </h3>
              <p className="text-gray-700 mb-4">
                Role-based access ensures only authorized personnel can view or
                act on specific complaints.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Firebase authentication</li>
                <li>• Role-based permissions</li>
                <li>• Audit-ready logs</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <MapIcon size={18} className="text-red-600" />
                Campus-Specific Design
              </h3>
              <p className="text-gray-700 mb-4">
                Built for academic institutions with campus-level mappings and
                workflows.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Building-wise tracking</li>
                <li>• Issue heatmaps</li>
                <li>• Area-based analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
              <p className="text-gray-600 text-sm">Institutional Use</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <p className="text-gray-600 text-sm">Complaint Submission</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">AI</div>
              <p className="text-gray-600 text-sm">Assisted Prioritization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>© 2025 CampusFix — KJ Somaiya College of Engineering, Mumbai</p>
          <p className="mt-1">Powered by Firebase & Google Generative AI</p>
        </div>
      </footer>
    </div>
  );
}
