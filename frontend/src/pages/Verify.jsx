import React, { useState } from 'react';
import '../style/verify.css';
import { Link ,useNavigate} from "react-router-dom";
import axios from 'axios'; 

const Verify = () => {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/process_images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputValue })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
        alert('Code Verified');
      } else {
        alert('Failed');
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSubmit2 = async () => {
    try {
      const response = await axios.get('http://localhost:8000/video_feed'); // Send POST request using Axios
      if (response.status === 200) {
        alert('Scanning successfully!');
        window.location.href = "http://localhost:8000/video_feed";
      } else {
        alert('Failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">

      <div className="form-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input-box"
          placeholder="Enter your Code"
        />
        <button className="submit-button" onClick={handleSubmit}>
          Verify Code
        </button>
      </div>
      {result && <div className="result">{result}</div>}
      <div className="animation-container">
        <div style={{ width: '100%', height: 0, paddingBottom: '100%', position: 'relative' }}>
          <iframe
            src="https://giphy.com/embed/IsKFVXvVxyeN1aXfgj"
            width="100%"
            height="100%"
            style={{ position: 'absolute' }}
            frameBorder="0"
            className="giphy-embed"
            allowFullScreen
          ></iframe>
        </div>
        <p>
          <a href="https://giphy.com/gifs/security-zkteco-solutions-IsKFVXvVxyeN1aXfgj"></a>
        </p>
        <button className="submit-button2" onClick={handleSubmit2}>
          Start Scan
        </button>
      </div>
    </div>
  );
};

export default Verify;


