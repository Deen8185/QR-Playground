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
  try {
    const url = `https://scan-to-pay-api.onrender.com/translate-scan?qr_payload=${encodeURIComponent(qrData)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "X-API-KEY": "Khadijat-U-Kamaludeen-feb14aug170604-dee&deen" }
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      setScannedUser({
        receiver: data.receiver, // 👈 Match API key 'receiver'
        bank_name: data.bank_name,
        account: data.account
      }); 
      setCurrentPage('confirm-payment');
    } else {
      alert(data.message || "Invalid QR Code");
    }
  } catch (error) {
    alert("Bridge Engine is sleeping. Please wait 30 seconds.");
  }
};
  const handleFinalPayment = (paymentDetails) => {
    // This receives the {receiver, amount, etc} from ConfirmPayment
    setLastAmount(paymentDetails.amount);
    setCurrentPage('success');
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