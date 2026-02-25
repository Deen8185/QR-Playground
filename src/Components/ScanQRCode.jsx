import React, { useEffect, useRef, useState } from 'react';
import styles from './ScanQRCode.module.css';
import { ArrowLeft, Flashlight, Image as ImageIcon, Loader2 } from 'lucide-react';
import jsQR from 'jsqr';

export default function ScanQRCode({ onBack, onScanSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const scanningRef = useRef(true); // Use a ref to track scanning state across renders

  const API_BASE = "https://scan-to-pay-api.onrender.com";

  const handleVerifiedScan = async (rawPayload) => {
    setIsVerifying(true);
    scanningRef.current = false; // Stop the loop
    
    try {
      const response = await fetch(`${API_BASE}/translate-scan?qr_payload=${encodeURIComponent(rawPayload)}`, {
        method: "GET",
        headers: { "X-API-KEY": "Khadijat-U-Kamaludeen-feb14aug170604-dee&deen" }
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        onScanSuccess(result); 
      } else {
        setError(result.message || "Invalid or Unrecognized QR Code");
        setTimeout(() => {
          setError(null);
          setIsVerifying(false);
          scanningRef.current = true; // Restart scanning after 2s
        }, 2000);
      }
    } catch (err) {
      setError("Bridge Engine is sleeping. Retrying...");
      setTimeout(() => {
        setError(null);
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
                style={{ filter: isVerifying ? 'blur(4px)' : 'none' }}
            />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Verification Overlay */}
          {isVerifying && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '20px',
              zIndex: 10
            }}>
              <Loader2 className="animate-spin" color="white" size={48} />
              <p style={{ color: 'white', marginTop: '12px', fontWeight: '600' }}>Verifying QR...</p>
            </div>
          )}

          {/* Corner Accents */}
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
          <div style={{
            background: '#fee2e2',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500'
          }}>
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