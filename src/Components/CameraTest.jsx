import React, { useEffect, useRef } from 'react';

export default function CameraTest() {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(err => alert("Hardware says: " + err.name));
  }, []);

  return (
    <div style={{ background: 'red', padding: '50px', textAlign: 'center' }}>
      <h2>If this is black/slashed, your OS is blocking Chrome</h2>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '300px', border: '5px solid white' }} />
    </div>
  );
}