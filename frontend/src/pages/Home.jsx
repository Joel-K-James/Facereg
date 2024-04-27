import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useForm } from "react-hook-form";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config/config";
import "firebase/storage";
import app from "../firebase-config/config";
import "../style/home.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link ,useNavigate} from "react-router-dom";
import axios from 'axios'; 

export const Home = () => {
  const navigate = useNavigate()
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [randomCode, setRandomCode] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const storage = getStorage(app);
  const userCollectionRef = collection(db, "users");

  const capturePhoto = () => {
    const capturedImage = webcamRef.current.getScreenshot();
    if (capturedImage) {
      setImage(capturedImage); 
    } else {
      console.log("Image not captured");
    }
  };

  const uploadImage = async (name) => {
    if (!image) return null;
  
    
    const blob = await (await fetch(image)).blob();
    const imageRef = ref(storage, `photos/${name}/${name}.jpg`);
    try {
      await uploadBytes(imageRef, blob);
      console.log("Uploaded image successfully!");
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleAdhaarChange = (event) => {
    const selectedFile = event.target.files[0];
   
  };

  const uploadAdhaar = async (selectedFile) => {
    const adhaarRef = ref(storage, `adhaar/${selectedFile.name}`);
    await uploadBytes(adhaarRef, selectedFile);
    return await getDownloadURL(adhaarRef);
  };

  const notify1 = () => toast("Captured!!!😉");
  const notify2 = () => toast("🤞 Uploaded Successfully!!!");
  const notify3 = () => toast("✅ Submitted Successfully!!!");

  const onSubmit = async (data) => {
    const name = data.name;
    let imageUrl = null;

    
    const randomCode = Math.random().toString(36).substring(7);
    setRandomCode(randomCode);

    
    if (image) {
      imageUrl = await uploadImage(name);
      notify2(); 
    }

    let adhaarUrl = null;
    if (data.adhaar) {
      adhaarUrl = await uploadAdhaar(data.adhaar[0]);
    }

    const createdAt = new Date();

    const userData = {
      ...data,
      photo: imageUrl,
      adhaar: adhaarUrl,
      code: randomCode, 
      createdAt: createdAt.toLocaleString(),
    };

    await addDoc(userCollectionRef, userData);
    
    setImage(null); 
    setShowVerifyButton(true); 
    console.log("Data is uploaded")
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:8000/download_images'); // Send POST request using Axios
      if (response.status === 200) {
        alert('Images downloaded successfully!');
        navigate("/verify");
      } else {
        alert('Failed to download images.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="background-animation">
      <div className="container">
        <div className="form-container">
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              name="name"
              {...register("name", { required: true })}
              placeholder="Name"
            />
            {errors.name && <p className="error">Name is required</p>}
            <input
              type="tel"
              {...register("phoneNo", { required: true })}
              placeholder="Phone Number"
            />
            {errors.phoneNo && <p className="error">Phone number is required</p>}
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
            />
            {errors.email && <p className="error">Email is required</p>}
            <div className="webcam-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                className="webcam"
                screenshotFormat="image/jpeg"
              />
              <button
                type="button"
                className="capture-button"
                onClick={() => {
                  capturePhoto();
                  notify1();
                }}
              >
                Capture Photo
              </button>
              {image && (
                <img src={image} alt="Captured Photo" className="captured-image" />
              )}
            </div>
            <input
              type="file"
              {...register("adhaar", { required: true })}
              accept="image/jpeg, image/png, application/pdf"
              onChange={handleAdhaarChange}
            />
            {errors.adhaar && <p className="error">Adhaar is required</p>}
            <button type="submit" className="submit-button" onClick={notify3}>
              Submit
            </button>
          </form>
        </div>
        {/* Render the Verify button only if showVerifyButton is true */}
        {showVerifyButton && (
          <div className="bottom-section">
            <input
              type="text"
              className="random-code-input"
              value={randomCode}
              readOnly
            />
            <button
              className="verify-button"
              onClick={handleVerify}
            >
              Verify
            </button>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};
