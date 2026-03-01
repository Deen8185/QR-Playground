import React, { useEffect, useRef, useState } from 'react';
import styles from './ScanQRCode.module.css';
import { ArrowLeft, Flashlight, Image as ImageIcon, Loader2 } from 'lucide-react';
import jsQR from 'jsqr';

export default function ScanQRCode({ onBack, onScanSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const scanningRef = useRef(true); 

  const API_BASE = "https://scan-to-pay-api.onrender.com";

  // ✅ THE API HANDLER (Encoding/Decoding handled by Python)
  // ✅ Corrected handler inside ScanQRCode.jsx
const handleVerifiedScan = async (rawPayload) => {
  setIsVerifying(true);
  scanningRef.current = false; // Stop the camera loop

  try {
    const response = await fetch(`${API_BASE}/translate-scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "Khadijat-U-Kamaludeen-feb14aug170604-dee&deen"
      },
      body: JSON.stringify({ qr_payload: rawPayload }) 
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      // Pass the WHOLE result object to App.js
      onScanSuccess(result); 
    } else {
      setError(result.message || "Invalid QR Code");
      setTimeout(() => {
        setIsVerifying(false);
        scanningRef.current = true;
      }, 3000);
    }
  } catch (err) {
    setError("Connection Error. Please try again.");
    setTimeout(() => {
      setIsVerifying(false);
      scanningRef.current = true;
    }, 3000);
  }
};

  useEffect(() => {
    let stream = null;
    let animationId = null;

    async function initCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 1280, height: 720 }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          animationId = requestAnimationFrame(tick);
        }
      } catch (err) { setError("Camera access denied."); }
    }

    const tick = () => {
      if (!scanningRef.current) {
        animationId = requestAnimationFrame(tick);
        return;
      }

      if (videoRef.current?.readyState === videoRef.current?.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          handleVerifiedScan(code.data);
        }
      }
      animationId = requestAnimationFrame(tick);
    };

    initCamera();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backBtn}><ArrowLeft /></button>
        <h1 style={{ fontSize: '20px' }}>Scan To Pay</h1>
      </header>

      <div className={styles.cameraArea}>
        <div className={styles.scannerFrame}>
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={styles.video} 
                style={{ filter: isVerifying ? 'blur(8px)' : 'none' }}
            />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {isVerifying && (
            <div className={styles.loadingOverlay}>
              <Loader2 className="animate-spin" color="white" size={48} />
              <p style={{ color: 'white', marginTop: '12px', fontWeight: '600' }}>API Decoding...</p>
            </div>
          )}

          {!isVerifying && (
            <>
              <div className={`${styles.corner} ${styles.topLeft}`}></div>
              <div className={`${styles.corner} ${styles.topRight}`}></div>
              <div className={`${styles.corner} ${styles.bottomLeft}`}></div>
              <div className={`${styles.corner} ${styles.bottomRight}`}></div>
            </>
          )}
        </div>
        
        {error && (
          <div className={styles.errorToast}>
            {error}
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button className={styles.iconBtn}><Flashlight size={24} /></button>
        <button className={styles.iconBtn}><ImageIcon size={24} /></button>
      </div>
    </div>
  );
}