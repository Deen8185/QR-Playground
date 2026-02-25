import React, { useState, useEffect } from 'react';
import styles from './SetupProfile.module.css';

const SetupProfile = ({ onSave }) => {
  const [formData, setFormData] = useState({ bankName: '', bankCode: '', accountNumber: '' });
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching the official list from your Render API
    fetch("https://scan-to-pay-api.onrender.com/banks")
      .then(res => res.json())
      .then(data => {
        setBanks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Bank List Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  const handleBankChange = (e) => {
    const selectedCode = e.target.value;
    const selectedBank = banks.find(b => b.code === selectedCode);
    
    setFormData({
      ...formData,
      bankCode: selectedCode,
      bankName: selectedBank ? selectedBank.name : '' // Storing the name for display later
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Setup Profile</h1>
      <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
          QR-API Test Playground.
      </p>
    
      <div className={styles.formGroup}>
        <label className={styles.label}>Account Number</label>
        <input 
          type="number"
          className={styles.input}
          placeholder="0123456789" 
          maxLength={10}
          value={formData.accountNumber}
          onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Select Bank</label>
        <select 
          className={styles.input} 
          onChange={handleBankChange} 
          value={formData.bankCode}
          disabled={loading}
        >
          <option value="">{loading ? "Loading Banks..." : "Choose your bank..."}</option>
          {banks.map(bank => (
            <option key={bank.code} value={bank.code}>{bank.name}</option>
          ))}
        </select>
      </div>
      
      <button 
        className={styles.button}
        disabled={!formData.bankCode || formData.accountNumber.length < 10}
        onClick={() => onSave(formData)}
      >
        Enter Playground
      </button>
    </div>
  );
};

export default SetupProfile;