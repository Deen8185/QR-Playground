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

  const handleProfileSetup = (details) => {
    setMyProfile(details);
    setCurrentPage('dashboard');
  };

const handleScanSuccess = async (qrData) => {
  // Ensure we are sending the string URL, not the whole object
  const payloadString = typeof qrData === 'string' ? qrData : (qrData.payload || "");

  try {
    const url = `https://scan-to-pay-api.onrender.com/translate-scan?qr_payload=${encodeURIComponent(payloadString)}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: { "X-API-KEY": "Khadijat-U-Kamaludeen-feb14aug170604-dee&deen" }
    });

    const apiData = await response.json();
    console.log("FINAL API VALIDATION:", apiData);

    if (response.ok && apiData.status === "success") {
      setScannedUser({
        receiver: apiData.receiver,
        bank_name: apiData.bank_name,
        account: apiData.account
      }); 
      setCurrentPage('confirm-payment');
    } else {
      alert("Verification Failed: " + (apiData.message || "Invalid QR"));
    }
  } catch (error) {
    alert("Bridge Engine is sleeping. Please wait 30 seconds for Render to wake up.");
  }
};

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black text-white shadow-2xl flex flex-col">
      
      {/* 1. Dynamic Page Content (Wrapped to push footer down) */}
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

      {/* 2. Footer Signature (Now anchored to the bottom) */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '24px 0', 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: 'black' 
      }}>
        <p style={{ 
          fontSize: '11px', 
          color: '#64748b', 
          letterSpacing: '1.5px',
          textTransform: 'uppercase'
        }}>
          © {new Date().getFullYear()} • POWERED BY{' '}
          <a 
            href="https://deen8185.github.io/Myportfolio/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#6366f1', 
              fontWeight: '700', 
              textDecoration: 'none',
            }}
          >
            DEEN
          </a>
        </p>
      </footer>
    </div>
  );
}