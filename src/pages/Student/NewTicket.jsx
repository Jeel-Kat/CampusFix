import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Navbar from "../../components/Navbar";
import { classifyTicket } from "../../services/api";
import { db, storage, auth } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  MapPin,
  PlusCircle,
  ImageIcon,
  Building2,
  Layers,
  DoorOpen,
  Sparkles,
} from "lucide-react";

const DEFAULT_CENTER = [72.8997, 19.073];

const NewTicket = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [building, setBuilding] = useState("Main Building");
  const [floor, setFloor] = useState("Ground");
  const [roomNumber, setRoomNumber] = useState("");

  const [isClassifying, setIsClassifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (map.current) return;

    if (typeof mapboxgl.setTelemetry === "function") {
      mapboxgl.setTelemetry(false);
    }

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 16,
    });

    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedLocation({ lng, lat });

      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      } else {
        marker.current = new mapboxgl.Marker({ color: "#dc2626" })
          .setLngLat([lng, lat])
          .addTo(map.current);
      }
    });
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleClassify = async () => {
    if (!description && !photo) return;
    setIsClassifying(true);
    try {
      const result = await classifyTicket(description, photo);
      setAiResult(result);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aiResult) return;

    setIsSubmitting(true);
    try {
      let photoUrl = null;
      if (photo) {
        const storageRef = ref(
          storage,
          `tickets/${currentUser.uid}/${Date.now()}.jpg`
        );
        await uploadString(storageRef, photo, "data_url");
        photoUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "tickets"), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        description,
        building,
        floor,
        roomNumber,
        location: selectedLocation,
        photoUrl,
        category: aiResult.category,
        urgency: aiResult.urgency,
        summary: aiResult.summary,
        status: "open",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        resolvedAt: null,
        assignedTo: null,
      });

      navigate("/student/my-tickets");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b flex items-center gap-3 bg-gray-50">
            <PlusCircle className="text-red-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              New Complaint
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Issue Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Issue Description
              </label>
              <textarea
                rows={5}
                className="w-full rounded-xl border border-gray-300 p-4 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                placeholder="Describe the issue clearly..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1 text-gray-700">
                  <Building2 size={16} /> Building
                </label>
                <select
                  className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-red-500"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                >
                  <option>Main Building</option>
                  <option>Block A</option>
                  <option>Block B</option>
                  <option>Aryabhat</option>
                  <option>Bhaskaracharya</option>
                  <option>Hostel 1</option>
                  <option>Hostel 2</option>
                  <option>Canteen</option>
                  <option>Library</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1 text-gray-700">
                  <Layers size={16} /> Floor
                </label>
                <select
                  className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-red-500"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                >
                  <option>Ground</option>
                  <option>1st</option>
                  <option>2nd</option>
                  <option>3rd</option>
                  <option>4th</option>
                  <option>5th</option>
                  <option>6th</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1 text-gray-700">
                  <DoorOpen size={16} /> Room (Optional)
                </label>
                <input
                  className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-red-500"
                  placeholder="Room number"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Attach Photo (Optional)
              </label>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-red-500 transition relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <ImageIcon className="text-gray-400 w-10 h-10" />
                  <p className="text-gray-500 text-sm text-center">
                    Click or drag file to upload
                  </p>
                </div>
              </div>

              {photo && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <img
                    src={photo}
                    className="rounded-xl w-full max-h-60 object-cover border border-gray-300 shadow-sm"
                    alt="Preview"
                  />
                </div>
              )}
            </div>

            {/* AI Analysis */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-medium text-gray-800">
                  <Sparkles className="text-indigo-600" /> AI Analysis
                </h3>
                <button
                  type="button"
                  onClick={handleClassify}
                  disabled={isClassifying}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                  {isClassifying ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Analyze"
                  )}
                </button>
              </div>

              {aiResult && (
                <div className="text-sm space-y-1 text-gray-700">
                  <div>
                    <strong>Summary:</strong> {aiResult.summary}
                  </div>
                  <div>
                    <strong>Category:</strong> {aiResult.category}
                  </div>
                  <div>
                    <strong>Urgency:</strong> {aiResult.urgency}/10
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Pin Location (Optional)
              </label>
              <div
                ref={mapContainer}
                className="h-72 rounded-xl border border-gray-300 overflow-hidden shadow-sm"
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <MapPin size={12} /> Click on map to mark location
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !aiResult}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTicket;
