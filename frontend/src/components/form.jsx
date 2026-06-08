// import React, { useState, useEffect } from "react";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../firebase.config"; // Assuming you have your Firebase configuration in this file
// import { toast, Toaster } from "react-hot-toast";
// import { collection, addDoc } from "firebase/firestore"; // Import collection and addDoc functions

// function Form() {
//   const [applyingLocation, setApplyingLocation] = useState("");
//   const [applyingAs, setApplyingAs] = useState("individual");
//   const [numberOfLabourers, setNumberOfLabourers] = useState("1");
//   const [nal, setNal] = useState(0);
//   const [name, setName] = useState("");
//   const [uidNo, setUidNo] = useState("");
//   const [mobileNo, setMobileNo] = useState("");
//   const [wages, setWages] = useState(0);
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const coord = urlParams.get("lat");
//     const lat = parseFloat(coord.split(" ")[0]).toFixed(3);
//     const lng = parseFloat(coord.split(" ")[1].split("=")[1]).toFixed(3);
//     const nal = coord.split(" ")[3].split("=")[1];
//     const wages = coord.split(" ")[2].split("=")[1];
//     if (lat && lng && nal) {
//       setApplyingLocation(`${lat}, ${lng}`);
//       setNal(nal);
//       setWages(wages);
//     }
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const urlParams = new URLSearchParams(window.location.search);
//     const coord = urlParams.get("lat");
//     const ID = coord.split(" ")[4].split("=")[1];
//     try {
//       const formData = {
//         applyingAs,
//         numberOfLabourers,
//         name,
//         uidNo,
//         mobileNo,
//       };

//       if (parseInt(numberOfLabourers) > nal) {
//         toast.error("Number of labourers cannot exceed the available posts.");
//         return;
//       }

//       const entriesCollectionRef = collection(db,"filledPosition",ID,"entries");
//       await addDoc(entriesCollectionRef, formData);
//       toast.success("Hired Successfully");
//       let updatedNal = nal - parseInt(numberOfLabourers);
//       updatedNal = Math.max(updatedNal, 0);

//       const locationDocRef = doc(db, "location", ID);
//       await updateDoc(locationDocRef, { nal: updatedNal });
//     } catch (error) {
//       console.error("Error updating number of available workers:", error);
//     }
//   };

//   return (
//     <div className="flex justify-center">
//       <Toaster
//         toastOptions={{ duration: 4000 }}
//         position="bottom-center"
//         reverseOrder={false}
//       />
//       <div className="flex flex-col w-[40vw] p-3 bg-white rounded-md">
//         <h2 className="text-2xl text-center font-bold mb-6">
//           Application Form
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex w-full">
//             <div className="w-1/2 mr-2">
//               <label htmlFor="applyingLocation" className="block mb-1">
//                 Location (Lat/Lng):
//               </label>
//               <input
//                 type="text"
//                 id="applyingLocation"
//                 value={applyingLocation}
//                 disabled
//                 className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
//               />
//             </div>
//             <div className="w-1/2 ml-2">
//               <label htmlFor="postavail" className="block mb-1">
//                 Post Available:
//               </label>
//               <input
//                 type="text"
//                 id="postavail"
//                 value={nal}
//                 disabled
//                 className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
//               />
//             </div>
//             <div className="w-1/2 ml-4">
//               <label htmlFor="applyingLocation" className="block mb-1">
//                 Wages:
//               </label>
//               <input
//                 type="text"
//                 id="wages"
//                 value={wages}
//                 disabled
//                 className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
//               />
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <span className="block font-medium mb-1">Applying As:</span>
//             <div>
//               <input
//                 type="radio"
//                 id="individual"
//                 value="individual"
//                 checked={applyingAs === "individual"}
//                 onChange={() => {
//                   setApplyingAs("individual");
//                   setNumberOfLabourers("1");
//                 }}
//                 className="mr-2 appearance-none border border-gray-300 rounded-full h-3 w-3 checked:bg-gray-500 outline-offset-1 outline-gray-300 outline"
//               />
//               <label htmlFor="individual" className="mr-4">
//                 Individual
//               </label>
//             </div>
//             <div>
//               <input
//                 type="radio"
//                 id="contractor"
//                 value="contractor"
//                 checked={applyingAs === "contractor"}
//                 onChange={() => setApplyingAs("contractor")}
//                 className="mr-2 appearance-none border border-gray-300 rounded-full h-3 w-3 checked:bg-gray-500 outline-offset-1 outline-gray-300 outline"
//               />
//               <label htmlFor="contractor" className="mr-4">
//                 Contractor
//               </label>
//             </div>
//           </div>
//           {applyingAs === "contractor" && (
//             <div>
//               <label htmlFor="numberOfLabourers" className="block mb-1">
//                 Number of Labourers:
//               </label>
//               <input
//                 type="number"
//                 id="numberOfLabourers"
//                 value={numberOfLabourers}
//                 onChange={(e) => setNumberOfLabourers(e.target.value)}
//                 required
//                 className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
//               />
//             </div>
//           )}
//           <div>
//             <label htmlFor="name" className="block mb-1">
//               Name:
//             </label>
//             <input
//               type="text"
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="uidNo" className="block mb-1">
//               UID No.:
//             </label>
//             <input
//               type="text"
//               id="uidNo"
//               value={uidNo}
//               onChange={(e) => setUidNo(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="mobileNo" className="block mb-1">
//               Mobile No.:
//             </label>
//             <input
//               type="tel"
//               id="mobileNo"
//               value={mobileNo}
//               onChange={(e) => setMobileNo(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
//             />
//           </div>
//           <div>
//             <button
//               type="submit"
//               className="w-full bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600 transition duration-300"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Form;


import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import API from "../api/axios"; // Firebase hata kar apna Axios import kiya

function Form() {
  const [applyingLocation, setApplyingLocation] = useState("");
  // Dhyan dein: Backend enum ke hisaab se pehla letter capital ('Individual', 'Contractor') kar diya gaya hai
  const [applyingAs, setApplyingAs] = useState("Individual"); 
  const [numberOfLabourers, setNumberOfLabourers] = useState("1");
  const [nal, setNal] = useState(0);
  const [name, setName] = useState("");
  const [uidNo, setUidNo] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [wages, setWages] = useState(0);

  useEffect(() => {
    // Naye clean URL format se data nikalna
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get("lat");
    const lng = urlParams.get("lng");
    const urlNal = urlParams.get("nal");
    const urlWages = urlParams.get("wages");

    if (lat && lng) {
      setApplyingLocation(`${parseFloat(lat).toFixed(3)}, ${parseFloat(lng).toFixed(3)}`);
    }
    if (urlNal) setNal(Number(urlNal));
    if (urlWages) setWages(Number(urlWages));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const ID = urlParams.get("ID"); // MongoDB _id fetch karna

    if (!ID) {
      toast.error("Location ID missing from URL.");
      return;
    }

    // Determine total workers based on selection
    const workers = applyingAs === "Individual" ? 1 : Number(numberOfLabourers);

    if (workers > nal) {
      toast.error(`Number of labourers cannot exceed the available ${nal} posts.`);
      return;
    }

    try {
      // Backend ko data bhejna (Dhyan rahe route aapke auth.routes.js ke hisaab se ho)
      const response = await API.post("/auth/form-fill", {
        locationId: ID,
        applyingAs: applyingAs,
        numberOfLabourers: workers,
        name,
        uidNo,
        mobileNo,
      });

      if (response.data.success) {
        toast.success("Application Submitted Successfully!");
        
        // Backend jo 'remainingPosts' bhejega, usse UI ka number update karna
        setNal(response.data.remainingPosts); 
        
        // Optional: Submit hone ke baad inputs clear karna
        setName("");
        setUidNo("");
        setMobileNo("");
        setNumberOfLabourers("1");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error. Booking failed.");
      console.error("Booking error:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <Toaster toastOptions={{ duration: 4000 }} position="bottom-center" reverseOrder={false} />
      <div className="flex flex-col w-[40vw] p-3 bg-white rounded-md">
        <h2 className="text-2xl text-center font-bold mb-6">Application Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Top Read-Only Fields */}
          <div className="flex w-full">
            <div className="w-1/2 mr-2">
              <label htmlFor="applyingLocation" className="block mb-1">Location (Lat/Lng):</label>
              <input
                type="text"
                id="applyingLocation"
                value={applyingLocation}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500 bg-gray-100 text-gray-600"
              />
            </div>
            <div className="w-1/2 ml-2">
              <label htmlFor="postavail" className="block mb-1">Post Available:</label>
              <input
                type="text"
                id="postavail"
                value={nal}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500 bg-gray-100 text-gray-600 font-bold"
              />
            </div>
            <div className="w-1/2 ml-4">
              <label htmlFor="wages" className="block mb-1">Wages (₹):</label>
              <input
                type="text"
                id="wages"
                value={wages}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500 bg-gray-100 text-gray-600"
              />
            </div>
          </div>

          {/* Radio Buttons for Individual/Contractor */}
          <div className="flex items-center space-x-4 mt-4">
            <span className="block font-medium mb-1">Applying As:</span>
            <div>
              <input
                type="radio"
                id="Individual"
                value="Individual"
                checked={applyingAs === "Individual"}
                onChange={() => {
                  setApplyingAs("Individual");
                  setNumberOfLabourers("1");
                }}
                className="mr-2 cursor-pointer"
              />
              <label htmlFor="Individual" className="mr-4 cursor-pointer">Individual</label>
            </div>
            <div>
              <input
                type="radio"
                id="Contractor"
                value="Contractor"
                checked={applyingAs === "Contractor"}
                onChange={() => setApplyingAs("Contractor")}
                className="mr-2 cursor-pointer"
              />
              <label htmlFor="Contractor" className="mr-4 cursor-pointer">Contractor</label>
            </div>
          </div>

          {/* Conditional Field: Number of Labourers */}
          {applyingAs === "Contractor" && (
            <div>
              <label htmlFor="numberOfLabourers" className="block mb-1">Number of Labourers:</label>
              <input
                type="number"
                id="numberOfLabourers"
                min="2"
                value={numberOfLabourers}
                onChange={(e) => setNumberOfLabourers(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
              />
            </div>
          )}

          {/* Personal Details Inputs */}
          <div>
            <label htmlFor="name" className="block mb-1">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label htmlFor="uidNo" className="block mb-1">UID No.:</label>
            <input
              type="text"
              id="uidNo"
              value={uidNo}
              onChange={(e) => setUidNo(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label htmlFor="mobileNo" className="block mb-1">Mobile No.:</label>
            <input
              type="tel"
              id="mobileNo"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gray-600 text-white rounded-md px-4 py-3 hover:bg-gray-700 transition duration-300 font-bold tracking-wide"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;