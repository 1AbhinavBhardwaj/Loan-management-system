import { useState, useEffect } from "react";
import {
  getCustomers,
  saveCustomers,
  getSimulatedDate,
  saveSimulatedDate,
  generateId
} from "./services/dbService";

import Dashboard from "./components/Dashboard";
import AddCustomer from "./components/AddCustomer";
import CustomerList from "./components/CustomerList";
import UpdatePayment from "./components/UpdatePayment";
import DueCustomers from "./components/DueCustomers";
import TransactionHistory from "./components/TransactionHistory";
import Login from "./components/Login";

export default function App() {
  // Direct state initialization from localStorage to prevent mount race conditions
  const [customers, setCustomers] = useState(() => getCustomers());
  const [simDate, setSimDate] = useState(() => getSimulatedDate());
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("student_lms_logged_in") === "true";
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  // Persist customers whenever state changes
  useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  // Persist simulated date whenever state changes
  useEffect(() => {
    if (simDate) {
      saveSimulatedDate(simDate);
    }
  }, [simDate]);

  // Alert system for payments due on the current simulated date
  useEffect(() => {
    if (isLoggedIn && simDate && customers.length > 0) {
      const duesToday = [];
      customers.forEach((customer) => {
        customer.loans.forEach((loan) => {
          if (loan.status === "active" && loan.dueDate === simDate) {
            duesToday.push(customer.name);
          }
        });
      });

      if (duesToday.length > 0) {
        alert(
          `🔔 ALERT: There are ${duesToday.length} customer(s) with payments due today:\n\n` +
          duesToday.map((name, i) => `${i + 1}. ${name}`).join("\n") +
          `\n\nPlease check the Due Tracker tab to record payments.`
        );
      }
    }
  }, [simDate, customers, isLoggedIn]);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    localStorage.setItem("student_lms_logged_in", "true");
    localStorage.setItem("student_lms_username", username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("student_lms_logged_in");
    localStorage.removeItem("student_lms_username");
  };

  const handleAddCustomer = (newRecord) => {
    const newCustId = generateId();
    const newLoanId = generateId();
    const newTxId = generateId();

    const newLoanItem = {
      id: newLoanId,
      productName: newRecord.productName,
      price: newRecord.price,
      downPayment: newRecord.downPayment,
      balance: newRecord.balance,
      startDate: newRecord.startDate,
      dueDate: newRecord.dueDate,
      status: newRecord.status,
      transactions: [
        {
          id: newTxId,
          amount: newRecord.downPayment,
          date: newRecord.startDate,
          type: "downpayment",
          notes: "Initial purchase downpayment."
        }
      ]
    };

    const newCustomerItem = {
      id: newCustId,
      name: newRecord.name,
      phone: newRecord.phone,
      address: newRecord.address,
      loans: [newLoanItem]
    };

    setCustomers((prev) => [...prev, newCustomerItem]);
  };

  const handleRecordPayment = ({ customerId, loanId, amount, date, notes, nextDueDate }) => {
    setCustomers((prevCustomers) => {
      const updated = prevCustomers.map((customer) => {
        if (customer.id !== customerId) return customer;

        const updatedLoans = customer.loans.map((loan) => {
          if (loan.id !== loanId) return loan;

          const newBalance = Math.max(0, loan.balance - amount);
          const isCleared = newBalance === 0;
          const newTxId = generateId();

          const newTx = {
            id: newTxId,
            amount: amount,
            date: date,
            type: "installment",
            notes: notes || "Installment payment"
          };

          return {
            ...loan,
            balance: newBalance,
            status: isCleared ? "completed" : "active",
            dueDate: isCleared ? null : nextDueDate,
            transactions: [...loan.transactions, newTx]
          };
        });

        return {
          ...customer,
          loans: updatedLoans
        };
      });

      return updated;
    });
  };

  const navigateTo = (tab) => {
    setActiveTab(tab);
  };

  const handleNextDay = () => {
    const d = new Date(simDate);
    d.setDate(d.getDate() + 1);
    setSimDate(d.toISOString().split("T")[0]);
  };

  const handleResetDate = () => {
    const today = new Date().toISOString().split("T")[0];
    setSimDate(today);
  };

  // If not logged in, render only the Login component
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="logo-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <div className="brand-name">GANESH FINANCE</div>
          <div className="brand-sub">LOAN HUMARA • TENSION AAPKA</div>
        </div>

        <div className="user-profile-summary">
          <div className="avatar">A</div>
          <div className="user-info">
            <div className="user-name">Administrator</div>
            <div className="user-role">System Operator</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Operations</div>
          <ul className="nav-list">
            <li className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}>
              <button onClick={() => navigateTo("dashboard")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="nav-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                </svg>
                Dashboard
              </button>
            </li>
            <li className={`nav-item ${activeTab === "add-customer" ? "active" : ""}`}>
              <button onClick={() => navigateTo("add-customer")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="nav-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.062a8.497 8.497 0 0 0-11.25 11.25m11.25-11.25c.073.272.12.553.14.842a4.5 4.5 0 0 1-4.482 4.796c-.646.01-1.27-.17-1.802-.515L3 18.75m9-15.312a8.497 8.497 0 0 1 11.25 11.25M3 18.75h18" />
                </svg>
                Add Customer
              </button>
            </li>
            <li className={`nav-item ${activeTab === "customer-list" ? "active" : ""}`}>
              <button onClick={() => navigateTo("customer-list")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="nav-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A9.642 9.642 0 0 1 12 20.25a9.642 9.642 0 0 1-3-.109v-.11C9 18.922 9 18 9 18M9 18v-.003c0-1.113.285-2.16.786-3.07M9 18A5.5 5.5 0 0 0 3.5 12.5m6 5.5H9a5.5 5.5 0 0 1-5.5-5.5m0 0A3.5 3.5 0 0 1 7 9a3.5 3.5 0 0 1 3.5 3.5M3.5 12.5v-.003c0-1.113.285-2.16.786-3.07M7.5 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM11.25 11.25a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM22.5 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM18.75 11.25a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
                </svg>
                Customer List
              </button>
            </li>
            <li className={`nav-item ${activeTab === "update-payment" ? "active" : ""}`}>
              <button onClick={() => navigateTo("update-payment")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="nav-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007M9 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007M15 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007M21 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007M3 18.75h18M3 21h18M3 4.5a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 4.5v12a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 16.5v-12Z" />
                </svg>
                Update Payment
              </button>
            </li>
            <li className={`nav-item ${activeTab === "due-customers" ? "active" : ""}`}>
              <button onClick={() => navigateTo("due-customers")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="nav-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Due Customers
              </button>
            </li>
            <li className={`nav-item ${activeTab === "transaction-history" ? "active" : ""}`}>
              <button onClick={() => navigateTo("transaction-history")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="nav-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                Transactions
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="logout-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header">
          <div className="page-title">
            <h1>GANESH FINANCE</h1>
          </div>

          {/* Simulated Date Controller */}
          <div className="date-sim-widget">
            <span className="date-sim-label">Date:</span>
            <input
              type="date"
              className="date-sim-input"
              value={simDate}
              onChange={(e) => setSimDate(e.target.value)}
            />
            <button className="btn-sim-control" onClick={handleNextDay}>
              +1 Day
            </button>
            <button className="btn-sim-reset" onClick={handleResetDate}>
              Today
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="view-body">
          {activeTab === "dashboard" && (
            <Dashboard
              customers={customers}
              onNavigate={navigateTo}
              onSelectCustomer={setSelectedCustomerId}
            />
          )}

          {activeTab === "add-customer" && (
            <AddCustomer
              simDate={simDate}
              onAddCustomer={handleAddCustomer}
              onNavigate={navigateTo}
            />
          )}

          {activeTab === "customer-list" && (
            <CustomerList
              customers={customers}
              onNavigate={navigateTo}
              onSelectCustomer={setSelectedCustomerId}
            />
          )}

          {activeTab === "update-payment" && (
            <UpdatePayment
              key={`${selectedCustomerId}-${simDate}`}
              customers={customers}
              selectedCustomerId={selectedCustomerId}
              simDate={simDate}
              onRecordPayment={handleRecordPayment}
              onNavigate={navigateTo}
            />
          )}

          {activeTab === "due-customers" && (
            <DueCustomers
              customers={customers}
              simDate={simDate}
              onNavigate={navigateTo}
              onSelectCustomer={setSelectedCustomerId}
            />
          )}

          {activeTab === "transaction-history" && (
            <TransactionHistory customers={customers} />
          )}
        </div>
      </main>
    </div>
  );
}