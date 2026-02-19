import React, { useState, useEffect } from 'react';
import styles from './SetupProfile.module.css';

const SetupProfile = ({ onSave }) => {
  const [formData, setFormData] = useState({ name: '', bankName: '', bankCode: '', accountNumber: '' });
  const [banks, setBanks] = useState([]);

  // Fetch the "Source of Truth" from your API
  useEffect(() => {
    fetch("http://192.168.43.146:8000/banks")
      .then(res => res.json())
      .then(data => setBanks(data))
      .catch(err => console.error("Bank List Fetch Error:", err));
  }, []);

  const handleBankChange = (e) => {
    const selectedCode = e.target.value;
    const selectedBank = banks.find(b => b.code === selectedCode);
    
    setFormData({
      ...formData,
      bankCode: selectedCode,
      bankName: selectedBank ? selectedBank.name : ''
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Setup Profile</h1>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Full Name</label>
        <input 
          className={styles.input}
          placeholder="e.g. Kamaludeen" 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Account Number</label>
        <input 
          className={styles.input}
          placeholder="0123456789" 
          maxLength={10}
          onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Select Bank</label>
        <select className={styles.input} onChange={handleBankChange} value={formData.bankCode}>
          <option value="">Choose your bank...</option>
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