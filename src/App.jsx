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
  
const handleScanSuccess = (apiResponse) => {
    // If we are here, ScanQRCode already called the API and got success
    if (apiResponse && apiResponse.status === "success") {
        setScannedUser({
            receiver: apiResponse.receiver,
            bank_name: apiResponse.bank_name,
            account: apiResponse.account,
            bank_code: apiResponse.bank_code
        }); 
        setCurrentPage('confirm-payment');
    } else {
        alert("Invalid data received from scanner.");
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