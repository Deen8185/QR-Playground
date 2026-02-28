import React, { useState } from 'react';
import SetupProfile from './Components/SetupProfile';
import Dashboard from './Components/Dashboard';
import ScanQRCode from './Components/ScanQRCode';
import ConfirmPayment from './Components/ConfirmPayment';
import SuccessPage from './Components/SuccessPage';
import ReceiveMoney from './Components/ReceiveMoney';

export default function App() {
  const [currentPage, setCurrentPage] = useState('setup');
  const [myProfile, setMyProfile] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);
  const [lastAmount, setLastAmount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false); // New: Tracks API call status

  const handleProfileSetup = (details) => {
    setMyProfile(details);
    setCurrentPage('dashboard');
  };

  const handleFinalPayment = (paymentData) => {
    setLastAmount(paymentData.amount);
    setCurrentPage('success');
  };

  const handleScanSuccess = async (qrData) => {
    // 1. Extract raw string from the scanner payload
    const payloadString = typeof qrData === 'string' ? qrData : (qrData.payload || "");
    
    if (!payloadString) {
      alert("Empty QR Code detected.");
      return;
    }

    setIsVerifying(true); // Start loading state

    try {
      // 2. Using POST to avoid URL truncation of '&' characters
      const response = await fetch("https://scan-to-pay-api.onrender.com/translate-scan", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-API-KEY": "Khadijat-U-Kamaludeen-feb14aug170604-dee&deen" 
        },
        body: JSON.stringify({ qr_payload: payloadString })
      });

      const apiData = await response.json();
      console.log("BRIDGE ENGINE RESPONSE:", apiData);

      if (response.ok && apiData.status === "success") {
        // 3. Update state BEFORE changing the page
        setScannedUser({
          receiver: apiData.receiver,
          bank_name: apiData.bank_name,
          account: apiData.account,
          bank_code: apiData.bank_code
        }); 
        
        setCurrentPage('confirm-payment');
      } else {
        // Handle API-side errors (Invalid NQR, Missing Bank, etc)
        const errorMsg = apiData.detail || apiData.message || "Could not verify this QR";
        alert("Verification Failed: " + errorMsg);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Bridge Engine is waking up. Please wait 10 seconds and try scanning again.");
    } finally {
      setIsVerifying(false); // End loading state
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black text-white shadow-2xl flex flex-col font-sans relative">
      
      {/* --- LOADING OVERLAY --- */}
      {isVerifying && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-indigo-400 font-medium animate-pulse">Verifying NQR Payload...</p>
          <p className="text-[10px] text-gray-500 mt-2 text-center px-10">
            Waking up Bridge Engine on Render.com (may take a moment)
          </p>
        </div>
      )}

      <div style={{ flex: 1 }}>
        {currentPage === 'setup' && <SetupProfile onSave={handleProfileSetup} />}
        
        {currentPage === 'dashboard' && (
          <Dashboard
            onSendClick={() => setCurrentPage('scanner')}
            onReceiveClick={() => setCurrentPage('receive')}
          />
        )}

        {currentPage === 'scanner' && (
          <ScanQRCode 
            onBack={() => setCurrentPage('dashboard')} 
            onScanSuccess={handleScanSuccess} 
          />
        )}

        {currentPage === 'receive' && (
          <ReceiveMoney 
            userData={myProfile} 
            onBack={() => setCurrentPage('dashboard')} 
          />
        )}

        {/* ✅ Guard: Ensure scannedUser exists before showing ConfirmPayment */}
        {currentPage === 'confirm-payment' && scannedUser ? (
          <ConfirmPayment
            recipientData={scannedUser}
            onBack={() => setCurrentPage('scanner')}
            onConfirm={handleFinalPayment} 
          />
        ) : currentPage === 'confirm-payment' && (
          <div className="p-10 text-center">
            <p>Data lost. Please scan again.</p>
            <button onClick={() => setCurrentPage('scanner')} className="mt-4 text-indigo-500">Go Back</button>
          </div>
        )}

        {currentPage === 'success' && (
          <SuccessPage
            recipient={scannedUser?.receiver}
            amount={lastAmount}
            onDone={() => setCurrentPage('dashboard')}
          />
        )}
      </div>

      <footer className="py-6 text-center border-t border-white/5 bg-black">
        <p className="text-[11px] text-slate-500 tracking-[1.5px] uppercase">
          © {new Date().getFullYear()} • POWERED BY{' '}
          <a 
            href="https://deen8185.github.io/Myportfolio/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-500 font-bold no-underline"
          >
            DEEN
          </a>
        </p>
      </footer>
    </div>
  );
}