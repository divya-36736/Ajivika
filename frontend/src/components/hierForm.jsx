import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import API from "../api/axios"; 
import { toast, Toaster } from "react-hot-toast";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function HierForm() {
  const [userDetails, setUserDetails] = useState(null);
  const [nal, setNal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [map, setMap] = useState(null);
  const [wages, setWages] = useState(0);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUserDetails(savedUser);
    } else {
      toast.error("Please login to post a job");
    }
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setLat(selectedLocation.center[1]);
      setLng(selectedLocation.center[0]);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (!map) return;
    const newMarker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([lng, lat])
      .addTo(map);

    newMarker.on("dragend", () => {
      const newLngLat = newMarker.getLngLat();
      setLat(newLngLat.lat);
      setLng(newLngLat.lng);
    });

    map.flyTo({ center: [lng, lat], zoom: 12 });
    setMarker(newMarker);
    return () => newMarker.remove();
  }, [map, lat, lng]);

  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: 12,
      });
      setMap(map);
    };

    if (mapboxgl.supported()) {
      initializeMap();
    }
  }, []); // Initialize map once

  const handleAutocomplete = async () => {
    if (!searchQuery) return;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    setSearchResults(data.features);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setSearchQuery(location.place_name);
    setSearchResults([]);
  };

  const handleHier = async (e) => {
    e.preventDefault();
    
    if (!userDetails || !userDetails.id) {
      toast.error("User session not found. Please login again.");
      return;
    }

    try {
      // data send to backend
      const response = await API.post("/auth/post-job", {
        hirerId: userDetails.id, // MongoDB ObjectId
        nal: Number(nal),
        lat: lat,
        lng: lng,
        wages: Number(wages),
      });

      if (response.data.success) {
        toast.success("Job Posted Successfully on the Map!!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <div className="flex justify-center pt-24">
          <div className="flex flex-col w-[40vw] p-3 bg-white rounded-md relative">
            <Toaster toastOptions={{ duration: 4000 }} position="bottom-center" />
            <form onSubmit={handleHier}>
              <h2 className="text-2xl text-center font-bold mb-6">
                Post Job Details (Contractor)
              </h2>
              
              {/* Profile Greeting */}
              <p className="text-center mb-4 text-gray-600">
                Welcome, <b>{userDetails?.name}</b>
              </p>

              <div className="mb-3 flex gap-4">
                <div className="flex-1">
                  <label>Latitude</label>
                  <input type="text" className="w-full border p-2 rounded" value={lat} disabled />
                </div>
                <div className="flex-1">
                  <label>Longitude</label>
                  <input type="text" className="w-full border p-2 rounded" value={lng} disabled />
                </div>
              </div>

              <div className="mb-3 flex gap-4">
                <div className="flex-1">
                  <label>No. of labourers required</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    placeholder="E.g. 10"
                    onChange={(e) => setNal(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label>Wages (₹)</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    placeholder="Per day"
                    onChange={(e) => setWages(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3 relative">
                <label>Search Work Location</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder="Type address..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleAutocomplete();
                  }}
                />
                <div className="rounded-md absolute top-full left-0 w-full bg-white border shadow-md z-10">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => handleSelectLocation(result)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {result.place_name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button type="submit" className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700">
                  Submit Job Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <div id="map" className="h-[70vh] m-10 rounded-lg border border-gray-400"></div>
      </div>
    </div>
  );
}