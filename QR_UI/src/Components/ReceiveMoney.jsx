import React, { useState, useEffect } from 'react';
import styles from './ReceiveMoney.module.css';
import { ArrowLeft, Share2, Copy, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const ReceiveMoney = ({ userData, onBack }) => {
  const [qrString, setQrString] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateBridgeQR = async () => {
      try {
        const response = await fetch("http://192.168.43.146:8000/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": "Khadijat-U-Kamaludeen-feb14aug170604-dee&deen" 
          },
          body: JSON.stringify({
            account_number: userData.accountNumber,
            bank_code: userData.bankCode // Ensure your profile setup captures this!
          })
        });

        const data = await response.json();
        if (response.ok) {
          setQrString(data.payload); // This is the "nqr://..." string
        } else {
          console.error("Engine Error:", data.detail);
        }
      } catch (err) {
        console.error("Connection failed:", err);
      } finally {
        setLoading(false);
      }
    };

    generateBridgeQR();
  }, [userData]);

  return (
    <div className={styles.container}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'white' }}>
          <ArrowLeft />
        </button>
        <h1 style={{ fontSize: '20px' }}>Receive Money</h1>
      </header>

      <div className={styles.qrWrapper} style={{ background: 'white', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <div style={{ height: '220px', display: 'flex', alignItems: 'center' }}>
            <Loader2 className="animate-spin" color="#6366f1" size={40} />
          </div>
        ) : (
          <QRCodeSVG value={qrString || "Error generating QR"} size={220} />
        )}
      </div>

      <p style={{ textAlign: 'center', color: '#666', marginTop: '16px', fontSize: '14px' }}>
        Scan this QR to pay {userData.name}
      </p>

      <button className={styles.shareBtn} style={{ marginTop: '30px' }}>
        <Share2 size={20} /> Share Payment Link
      </button>

      <h3 style={{ margin: '24px 0 16px 0' }}>Account Details</h3>
      <div className={styles.detailItem}>
        <div><p className={styles.label}>Account Name</p><p className={styles.value}>{userData.name}</p></div>
        <Copy size={18} color="#666" />
      </div>
      <div className={styles.detailItem}>
        <div><p className={styles.label}>Account Number</p><p className={styles.value}>{userData.accountNumber}</p></div>
        <Copy size={18} color="#666" />
      </div>
    </div>
  );
};

export default ReceiveMoney;