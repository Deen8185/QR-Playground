import React, { useState } from 'react';
import SetupProfile from './Components/SetupProfile';
import Dashboard from './Components/Dashboard';
import ScanQRCode from './Components/ScanQRCode';
import ConfirmPayment from './Components/ConfirmPayment';
import SuccessPage from './Components/SuccessPage';
import ReceiveMoney from './Components/ReceiveMoney';

// ✅ Python import removed (it was causing a JS crash)

export default function App() {
  const [currentPage, setCurrentPage] = useState('setup');
  const [myProfile, setMyProfile] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);
  const [lastAmount, setLastAmount] = useState(0);

  const handleProfileSetup = (details) => {
    setMyProfile(details);
    setCurrentPage('dashboard');
  };

  // ✅ HANDLER FOR THE SUCCESSFUL PAYMENT
  const handleFinalPayment = (paymentData) => {
    setLastAmount(paymentData.amount);
    setCurrentPage('success');
  };

  const handleScanSuccess = async (qrData) => {
    // 📨 Extract the string from the scanner object
    const payloadString = typeof qrData === 'string' ? qrData : (qrData.payload || "");

    try {
      const url = `https://scan-to-pay-api.onrender.com/translate-scan?qr_payload=${encodeURIComponent(payloadString)}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: { "X-API-KEY": "Khadijat-U-Kamaludeen-feb14aug170604-dee&deen" }
      });

      const apiData = await response.json();
      console.log("BRIDGE ENGINE RESPONSE:", apiData);

      if (response.ok && apiData.status === "success") {
        // ✅ The API found the name and bank!
        setScannedUser({
          receiver: apiData.receiver,
          bank_name: apiData.bank_name,
          account: apiData.account
        }); 
        setCurrentPage('confirm-payment');
      } else {
        // 🚩 The API Rulebook caught an invalid QR (nqr:// missing)
        alert("Verification Failed: " + (apiData.detail || apiData.message || "Invalid QR"));
      }
    } catch (error) {
      alert("Bridge Engine is sleeping. Please wait 30 seconds for Render to wake up.");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black text-white shadow-2xl flex flex-col font-sans">
      
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

        {currentPage === 'confirm-payment' && scannedUser && (
          <ConfirmPayment
            recipientData={scannedUser}
            onBack={() => setCurrentPage('scanner')}
            onConfirm={handleFinalPayment} 
          />
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