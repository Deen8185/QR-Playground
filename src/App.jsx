import React, { useState } from 'react';
import SetupProfile from './Components/SetupProfile';
import Dashboard from './Components/Dashboard';
import ScanQRCode from './Components/ScanQRCode';
import ConfirmPayment from './Components/ConfirmPayment';
import SuccessPage from './Components/SuccessPage';
import ReceiveMoney from './Components/ReceiveMoney';
import CameraTest from './Components/CameraTest';

export default function App() {
  const [currentPage, setCurrentPage] = useState('setup');
  const [myProfile, setMyProfile] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);

  // API PLACEHOLDER: Convert Raw Details -> Secure QR String
  const handleProfileSetup = (details) => {
    // Call your API here to register the user/generate a token
    setMyProfile(details);
    setCurrentPage('dashboard');
  };

  // API PLACEHOLDER: Convert QR String -> Actual User Details
  const handleScanSuccess = async (qrData) => {
    try {
      // encodeURIComponent is necessary for NQR strings (they contain : / ?)
      const url = `http://192.168.43.146:8000/translate-scan?qr_payload=${encodeURIComponent(qrData)}`;

      const response = await fetch(url, {
        method: "POST", 
        headers: {
          "Accept": "application/json",
          "X-API-KEY": "Khadijat-U-Kamaludeen-feb14aug170604-dee&deen" 
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // FIX: Must match your state variable 'scannedUser'
        setScannedUser({
          name: data.receiver, // Mapping API 'receiver' to UI 'name'
          bank: data.bank_name,
          account: data.account
        }); 
        
        setCurrentPage('confirm-payment');
      } else {
        const errorDetail = await response.json();
        alert(`Bank Error: ${errorDetail.detail || "Recipient not found"}`);
      }
    } catch (error) {
      console.error("API Connection Error:", error);
      alert("Critical: Could not connect to the Bridge Engine.");
    }
  };

  return (
     <><div className="max-w-md mx-auto min-h-screen bg-black text-white shadow-2xl">
       {currentPage === 'setup' && <SetupProfile onSave={handleProfileSetup} />}
    {currentPage === 'dashboard' && (
      <Dashboard
        onSendClick={() => setCurrentPage('scanner')}
        onReceiveClick={() => setCurrentPage('receive')}
      />
    )}
    {currentPage === 'scanner' && (
      <ScanQRCode onBack={() => setCurrentPage('dashboard')} onScanSuccess={handleScanSuccess} />
    )}
    {currentPage === 'receive' && (
      <ReceiveMoney userData={myProfile} onBack={() => setCurrentPage('dashboard')} />
    )}
    {currentPage === 'confirm-payment' && scannedUser && (
      <ConfirmPayment
        recipientData={scannedUser}
        onBack={() => setCurrentPage('scanner')}
        onConfirm={() => setCurrentPage('success')}
      />
    )}
    {currentPage === 'success' && (
      <SuccessPage
        recipient={scannedUser?.name}
        onDone={() => setCurrentPage('dashboard')}
      />
    )}
    </div>
    </>
    );
}
