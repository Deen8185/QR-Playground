import React, { useState, useEffect } from 'react';
import styles from './ReceiveMoney.module.css';
import { ArrowLeft, Share2, Copy, Loader2, CheckCircle, Building2} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const ReceiveMoney = ({ userData, onBack }) => {
  const [qrString, setQrString] = useState("");
  const [verifiedName, setVerifiedName] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Use your LIVE Render URL here!
  const API_BASE = "https://scan-to-pay-api.onrender.com";

  useEffect(() => {
    const generateAndVerify = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": "Khadijat-U-Kamaludeen-feb14aug170604-dee&deen" 
          },
          body: JSON.stringify({
            account_number: userData.accountNumber,
            bank_code: userData.bankCode 
          })
        });

        const data = await response.json();
        if (response.ok) {
          setQrString(data.payload);
          setVerifiedName(data.account_name); // Name fetched directly from Bank API
        } else {
          console.error("Engine Error:", data.message);
        }
      } catch (err) {
        console.error("Connection failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userData.accountNumber && userData.bankCode) {
      generateAndVerify();
    }
  }, [userData]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className={styles.container}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <ArrowLeft />
        </button>
        <h1 style={{ fontSize: '20px' }}>Receive Money</h1>
      </header>

      <div className={styles.qrWrapper} style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '24px', 
        display: 'flex', 
        justifyContent: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
      }}>
        {loading ? (
          <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Loader2 className="animate-spin" color="#6366f1" size={40} />
            <p style={{ color: '#6366f1', fontWeight: '500' }}>Verifying Account...</p>
          </div>
        ) : (
          <QRCodeSVG value={qrString || "Error"} size={220} level="H" includeMargin={true} />
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {loading ? (
          <p style={{ color: '#999' }}>Securing bridge...</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <CheckCircle size={18} color="#10b981" fill="#10b98122" />
            <p style={{ color: '#10b981', fontWeight: '600' }}>Verified Merchant</p>
          </div>
        )}
      </div>
        <h3 style={{ margin: '32px 0 16px 0', fontSize: '18px' }}>Recipient Details</h3>
      
      {/* 1. Verified Name Card */}
      <div className={styles.detailItem}>
        <div>
          <p className={styles.label}>Verified Name</p>
          <p className={styles.value} style={{ textTransform: 'uppercase' }}>
            {loading ? "Fetching..." : verifiedName || "Unknown"}
          </p>
        </div>
        <Copy size={18} color="#666" />
      </div>

      {/* 2. Account Number Card */}
      <div className={styles.detailItem}>
        <div>
          <p className={styles.label}>Account Number</p>
          <p className={styles.value}>{userData.accountNumber}</p>
        </div>
        <Copy size={18} color="#666" />
      </div>

      {/* 3. NEW: Bank Name Card */}
      <div className={styles.detailItem}>
        <div>
          <p className={styles.label}>Bank</p>
          <p className={styles.value}>
             {/* This maps the bank code back to a name for display */}
             {userData.bankName || "Commercial Bank"} 
          </p>
        </div>
        <Building2 size={18} color="#666" />
      </div>

      <button className={styles.shareBtn} style={{ marginTop: '30px', width: '100%' }}>
        <Share2 size={20} /> Share Payment QR
      </button>
    </div>
  );
};

export default ReceiveMoney;