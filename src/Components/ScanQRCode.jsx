import React, { useEffect, useRef, useState } from 'react';
import styles from './ScanQRCode.module.css';
import { ArrowLeft, Flashlight, Image as ImageIcon } from 'lucide-react';
import jsQR from 'jsqr'; // This is the logic that actually "reads" the code

export default function ScanQRCode({ onBack, onScanSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    let animationFrameId = null;

    async function initCamera() {
      try {
        const constraints = {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Start the scanning loop once the video is ready
          requestAnimationFrame(tick);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Camera blocked or not found. Please check permissions.");
      }
    }

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });

        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          console.log("Found QR code:", code.data);
          onScanSuccess(code.data); // This sends the data to App.jsx to switch pages
          return; // Stop the loop once scanned
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    initCamera();

    // Cleanup: Stop camera and loop when leaving page
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backBtn}><ArrowLeft /></button>
        <h1 style={{ fontSize: '20px' }}>Scan QR Code</h1>
      </header>

      <div className={styles.cameraArea}>
        <div className={styles.scannerFrame}>
          {/* The real video feed */}
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted  // 👈 Add this: Essential for autoPlay to work in most browsers
                className={styles.video} 
                style={{ display: 'block' }} // 👈 Ensure it's not hidden
            />
          
          {/* Hidden canvas used for processing frames */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Corner Accents */}
          <div className={`${styles.corner} ${styles.topLeft}`}></div>
          <div className={`${styles.corner} ${styles.topRight}`}></div>
          <div className={`${styles.corner} ${styles.bottomLeft}`}></div>
          <div className={`${styles.corner} ${styles.bottomRight}`}></div>
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>

      <div className={styles.controls}>
        <button className={styles.iconBtn}><Flashlight size={24} /></button>
        <button className={styles.iconBtn}><ImageIcon size={24} /></button>
      </div>
    </div>
  );
}