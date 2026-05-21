import React, { useState, useEffect } from "react";
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

export default function App() {
  
  const [customers, setCustomers] = useState([]);
  const [simDate, setSimDate] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  
  useEffect(() => {
    const loadedCustomers = getCustomers();
    setCustomers(loadedCustomers);

    const loadedDate = getSimulatedDate();
    setSimDate(loadedDate);
  }, []);

  
  useEffect(() => {
    if (customers.length > 0) {
      saveCustomers(customers);
    }
  }, [customers]);

  useEffect(() => {
    if (simDate) {
      saveSimulatedDate(simDate);
    }
  }, [simDate]);

  
  
  useEffect(() => {
    if (simDate && customers.length > 0) {
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
  }, [simDate, customers]);

  
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

  return (
    <div className="app-container">
      {}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-name">GANESH FINANCE</div>
          <div className="brand-sub">LOAN HUMARA<br></br>TENSION AAPKA</div>
        </div>

        <nav>
          <div className="sidebar-section-label">Operations</div>
          <ul className="nav-list">
            <li className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}>
              <button onClick={() => navigateTo("dashboard")}>Dashboard</button>
            </li>
            <li className={`nav-item ${activeTab === "add-customer" ? "active" : ""}`}>
              <button onClick={() => navigateTo("add-customer")}>Add Customer</button>
            </li>
            <li className={`nav-item ${activeTab === "customer-list" ? "active" : ""}`}>
              <button onClick={() => navigateTo("customer-list")}>Customer List</button>
            </li>
            <li className={`nav-item ${activeTab === "update-payment" ? "active" : ""}`}>
              <button onClick={() => navigateTo("update-payment")}>Update Payment</button>
            </li>
            <li className={`nav-item ${activeTab === "due-customers" ? "active" : ""}`}>
              <button onClick={() => navigateTo("due-customers")}>Due Customers</button>
            </li>
            <li className={`nav-item ${activeTab === "transaction-history" ? "active" : ""}`}>
              <button onClick={() => navigateTo("transaction-history")}>Transactions</button>
            </li>
          </ul>
        </nav>
      </aside>

      {}
      <main className="main-content">
        <header className="header">
          <div className="page-title">
            <h1>GANESH FINANCE</h1>
          </div>

          {}
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

        {}
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