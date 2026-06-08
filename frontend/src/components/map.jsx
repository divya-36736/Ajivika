// import React, { useRef, useEffect, useState } from 'react';
// import maplibregl from 'maplibre-gl';
// import { GeocodingControl } from "@maptiler/geocoding-control/react";
// import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
// import "@maptiler/geocoding-control/style.css";
// import 'maplibre-gl/dist/maplibre-gl.css';
// import { db } from '../firebase.config';
// import { collection, getDocs } from 'firebase/firestore';

// export default function Map() {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const [zoom] = useState(10);
//   const [API_KEY] = useState('4OjFkG91zRTKmrnLHyBh');
//   const [mapController, setMapController] = useState();
//   const [markersData, setMarkersData] = useState([]);

//   useEffect(() => {
//     if (map.current) return;

//     map.current = new maplibregl.Map({
//       container: mapContainer.current,
//       style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
//       center: [76.5213,31.6862], // Default center
//       zoom: zoom
//     });

//     map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
//     setMapController(createMapLibreGlMapController(map.current, maplibregl));

//     // Fetch locations and display markers
//     fetchLocationsAndDisplayMarkers();

//   }, [API_KEY, zoom]);

//   // Function to fetch locations data from Firestore and display markers
//   const fetchLocationsAndDisplayMarkers = async () => {
//     try {
//       const colRef = collection(db, "location");
//       const snapshot = await getDocs(colRef);
      
//       const locations = [];
//       snapshot.forEach(doc => {
//         const data = doc.data();
//         const locationID = doc.id; // Get the ID of the location
//         locations.push({
//           ID: locationID, // Add the location ID to the object
//           lat: data.lat,
//           lng: data.lng,
//           nal: data.nal,
//           wages: data.wages
//         });
//       });
//       setMarkersData(locations);
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//     }
//   };

//   useEffect(() => {
//     displayMarkers();
//   }, [markersData]);

//   // Function to display markers
//   const displayMarkers = () => {
//     markersData.forEach(marker => {
//       if (marker.nal > 0) {
//       const popupContent = `
//         <div>
//           <p>No. of Labourers Required: ${marker.nal}</p>
//           <p>Wages: Rs. ${marker.wages}</p>
//           <a href='/form?lat=${marker.lat}+lng=${marker.lng}+wages=${marker.wages}+nal=${marker.nal}+ID=${marker.ID}'>Open Form</a>
//         </div>
//       `;

//       new maplibregl.Marker()
//         .setLngLat([marker.lng, marker.lat])
//         .setPopup(new maplibregl.Popup({ closeButton: false }).setHTML(popupContent))
//         .addTo(map.current);
//   }});
//   };

//   return (
//     <div className="w-full p-10">
//       <div className="z-10 fixed p-10">
//         <div>
//           <GeocodingControl apiKey={API_KEY} mapController={mapController} className="p-10"/>
//         </div>
//       </div>
//       <div className="h-[75vh] border-2 border-gray-500 rounded-xl" ref={mapContainer} />
//     </div>
//   );
// }

import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import "@maptiler/geocoding-control/style.css";
import 'maplibre-gl/dist/maplibre-gl.css';

// 1. Firebase hata kar Axios import kiya
import API from '../api/axios'; 

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom] = useState(10);
  const [API_KEY] = useState(import.meta.env.VITE_MAPTILER_API_KEY);
  const [mapController, setMapController] = useState();
  const [markersData, setMarkersData] = useState([]);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [76.5213, 31.6862], // Default center
      zoom: zoom
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    setMapController(createMapLibreGlMapController(map.current, maplibregl));

    // Fetch locations and display markers
    fetchLocationsAndDisplayMarkers();

  }, [API_KEY, zoom]);

  // 2. Firebase getDocs() ki jagah Axios GET request
  const fetchLocationsAndDisplayMarkers = async () => {
    try {
      const response = await API.get("/auth/get-locations"); 
      
      // Backend se aane wale data ko state mein set karna
      // (Assumption: Backend response.data.locations mein data bhej raha hai)
      if (response.data && response.data.locations) {
        setMarkersData(response.data.locations);
      }
    } catch (error) {
      console.error("Error fetching locations from backend:", error);
    }
  };

  useEffect(() => {
    displayMarkers();
  }, [markersData]);

  // 3. Popup URL mein marker.ID ki jagah marker._id (MongoDB format) use kiya
  const displayMarkers = () => {
    markersData.forEach(marker => {
      if (marker.nal > 0) {
        const popupContent = `
          <div>
            <p>No. of Labourers Required: ${marker.nal}</p>
            <p>Wages: Rs. ${marker.wages}</p>
            <a href='/form?ID=${marker._id}&lat=${marker.lat}&lng=${marker.lng}&wages=${marker.wages}&nal=${marker.nal}'>Open Form</a>
          </div>
        `;

        new maplibregl.Marker()
          .setLngLat([marker.lng, marker.lat])
          .setPopup(new maplibregl.Popup({ closeButton: false }).setHTML(popupContent))
          .addTo(map.current);
      }
    });
  };

  return (
    <div className="w-full p-10">
      <div className="z-10 fixed p-10">
        <div>
          <GeocodingControl apiKey={API_KEY} mapController={mapController} className="p-10"/>
        </div>
      </div>
      <div className="h-[75vh] border-2 border-gray-500 rounded-xl" ref={mapContainer} />
    </div>
  );
}
