import React from 'react';
import styles from './Dashboard.module.css'; // Import your custom CSS
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const Dashboard = ({ onSendClick, onReceiveClick }) => {
  return (
    <>
        <div className={styles.container}>
          <header>
            <h1 style={{ fontSize: '24px', margin: 0 }}>Payment Bridge</h1>
            <p style={{ color: '#888', fontSize: '14px' }}>Seamless payments</p>
          </header>

          <div className={styles.balanceCard}>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>Total Balance</p>
            <h2 className={styles.amount}>₦250,480.00</h2>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>NGN</span>
          </div>

          <div className={styles.actionGrid}>
            <button className={styles.sendBtn} onClick={onSendClick}>
              <ArrowUpRight size={24} />
              <div style={{ marginTop: '8px' }}>Send</div>
            </button>
            <button className={styles.receiveBtn} onClick={onReceiveClick}>
              <ArrowDownLeft size={24} color="#5d3fd3" />
              <div style={{ marginTop: '8px' }}>Receive</div>
            </button>
          </div>

        <section className={styles.transactionsSection}>
          <div className={styles.sectionHeader}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Recent Transactions</h3>
            <button className={styles.viewAllBtn}>View All</button>
          </div>

          <div className={styles.transactionCard}>
            <div className={styles.userInfo}>
              <div className={styles.iconBadge}>
                <ArrowDownLeft className="text-green-500" size={20} />
              </div>
              <div>
                <p className={styles.userName}>John Adebayo</p>
                <p className={styles.timeText}>
                  <Clock size={10} /> 2 hours ago
                </p>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <p className={styles.amountText}>+ ₦12,500</p>
              <p className={styles.statusText}>Received</p>
            </div>
          </div>
        </section>
      </div>
  </>
  );
};

export default Dashboard;