import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useForm } from 'react-hook-form';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore'; 
import { db } from '../firebase-config/config';
import 'firebase/storage';
import app from '../firebase-config/config';
import "../style/home.css"

export const Home = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();


  const storage = getStorage(app);
  const userCollectionRef = collection(db, 'users');


  const capturePhoto = () => {
    const capturedImage = webcamRef.current.getScreenshot();
    if (capturedImage) { 
      setImage(capturedImage);
    } else {
      console.error('Error capturing image from webcam');
    }
  };

  
  const uploadImage = async () => {
    if (!image) {
      return; 
    }

    try {
      const imageRef = ref(storage, `photos/${Date.now()}.jpg`);
      const uploadTask = await uploadBytes(imageRef, new Blob([image], { type: 'image/jpeg' }));

      const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
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

  const onSubmit = async (data) => {
    let imageUrl;

    if (image) {
      imageUrl = await uploadImage(new Blob([image], { type: 'image/jpeg' })); 
    }

    let adhaarUrl;
    if (data.adhaar) {
      adhaarUrl = await uploadAdhaar(data.adhaar[0]); 
    }

    const createdAt = new Date(); 

    const userData = {
      ...data,
      photo: imageUrl,
      adhaar: adhaarUrl,
      createdAt: createdAt.toISOString(), 
    };

    await addDoc(userCollectionRef, userData);

    setImage(null);
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register('name', { required: true })} placeholder="Name" />
        {errors.name && <p className="error">Name is required</p>}
        <input type="tel" {...register('phoneNo', { required: true })} placeholder="Phone Number" />
        {errors.phoneNo && <p className="error">Phone number is required</p>}
        <input type="email" {...register('email', { required: true })} placeholder="Email" />
        {errors.email && <p className="error">Email is required</p>}
        <div className="webcam-container">
          <Webcam audio={false} ref={webcamRef} className="webcam" />
          <button type="button" className="capture-button" onClick={capturePhoto}>Capture Photo</button>
          {image && (
            <button type="button" className="upload-button" onClick={uploadImage}>Upload Captured Image to Storage</button>
          )}
          {image && <img src={image} alt="Captured Photo" className="captured-image" />}
        </div>
        <input type="file" {...register('adhaar', { required: true })} accept="image/jpeg, image/png, application/pdf" onChange={handleAdhaarChange} />
        {errors.adhaar && <p className="error">Adhaar is required</p>}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};



