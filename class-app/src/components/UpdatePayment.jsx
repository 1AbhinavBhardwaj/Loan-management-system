import React, { useState, useEffect } from "react";

export default function UpdatePayment({ 
  customers, 
  selectedCustomerId, 
  simDate, 
  onRecordPayment, 
  onNavigate 
}) {
  
  const [payAmount, setPayAmount] = useState("");
  const [payNotes, setPayNotes] = useState("Installment payment");
  const [nextDueDate, setNextDueDate] = useState("");
  const [customerId, setCustomerId] = useState(selectedCustomerId || "");

  
  const formatRupees = (amount) => {
    return "₹" + Number(amount).toLocaleString("en-IN");
  };

  const calculateDays = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  
  useEffect(() => {
    if (selectedCustomerId) {
      setCustomerId(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  
  const customer = customers.find((c) => c.id === customerId);
  const activeLoan = customer?.loans.find((l) => l.status === "active");

  
  let showDurationWarning = false;
  let showTxCountWarning = false;
  let warningDurationDays = 0;

  if (activeLoan) {
    
    if (activeLoan.transactions.length > 5) {
      showTxCountWarning = true;
    }

    
    const days = calculateDays(activeLoan.startDate, simDate);
    warningDurationDays = days;
    if (days > 180) {
      showDurationWarning = true;
    }
  }

  
  useEffect(() => {
    if (simDate) {
      const date = new Date(simDate);
      date.setDate(date.getDate() + 30);
      setNextDueDate(date.toISOString().split("T")[0]);
    }
  }, [simDate]);

  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    if (!customerId) {
      alert("Please select a customer first!");
      return;
    }

    if (!activeLoan) {
      alert("This customer has no active loans to update!");
      return;
    }

    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid positive payment amount!");
      return;
    }

    if (amount > activeLoan.balance) {
      alert(`Payment amount exceeds outstanding balance of ${formatRupees(activeLoan.balance)}!`);
      return;
    }

    const newBalance = activeLoan.balance - amount;
    if (newBalance > 0 && !nextDueDate) {
      alert("Please set a next due date for the remaining balance!");
      return;
    }

    
    onRecordPayment({
      customerId: customer.id,
      loanId: activeLoan.id,
      amount: amount,
      date: simDate,
      notes: payNotes,
      nextDueDate: newBalance === 0 ? null : nextDueDate
    });

    alert("Payment transaction successfully recorded!");
    onNavigate("dashboard");
  };

  return (
    <div className="page-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Update Customer Payment</h2>

      {}
      <div className="form-row" style={{ marginBottom: "20px" }}>
        <label className="bold">Select Customer *</label>
        <select 
          value={customerId} 
          onChange={(e) => setCustomerId(e.target.value)}
          className="search-input"
          style={{ width: "100%", padding: "8px" }}
        >
          <option value="">-- Select Customer from Directory --</option>
          {customers.map((c) => {
            const hasActive = c.loans.some((l) => l.status === "active");
            return (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone}) {hasActive ? "[Active Loan]" : "[Cleared]"}
              </option>
            );
          })}
        </select>
      </div>

      {customer && activeLoan ? (
        <form onSubmit={handlePaymentSubmit} className="student-form">
          <fieldset>
            <legend>Loan Details & Status</legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "10px 0" }}>
              <div>
                <strong>Product:</strong> {activeLoan.productName}
              </div>
              <div>
                <strong>Purchase Date:</strong> {activeLoan.startDate}
              </div>
              <div>
                <strong>Original Price:</strong> {formatRupees(activeLoan.price)}
              </div>
              <div>
                <strong>Total Outstanding:</strong> <span className="text-orange bold">{formatRupees(activeLoan.balance)}</span>
              </div>
            </div>

            {}
            {(showDurationWarning || showTxCountWarning) && (
              <div className="simple-alert-box">
                <h4 style={{ margin: "0 0 5px 0", color: "#721c24" }}>⚠️ Warning System Alert</h4>
                {showTxCountWarning && (
                  <p style={{ margin: "3px 0", fontSize: "13px" }}>
                    - <strong>Transaction Threshold Exceeded:</strong> Customer has recorded {activeLoan.transactions.length} transactions (Limit: 5).
                  </p>
                )}
                {showDurationWarning && (
                  <p style={{ margin: "3px 0", fontSize: "13px" }}>
                    - <strong>Payment Duration Alert:</strong> Active loan duration has reached {warningDurationDays} days (~{(warningDurationDays/30).toFixed(1)} months), which exceeds the 6-month limit.
                  </p>
                )}
                <small style={{ color: "#856404", display: "block", marginTop: "5px" }}>
                  Please review their payment capability before accepting further custom schedules.
                </small>
              </div>
            )}
          </fieldset>

          <fieldset style={{ marginTop: "20px" }}>
            <legend>Record New Payment</legend>
            
            <div className="form-row">
              <label>Payment Amount (₹) *</label>
              <input 
                type="number" 
                value={payAmount} 
                onChange={(e) => setPayAmount(e.target.value)} 
                placeholder={`Max limit: ${activeLoan.balance}`}
                required
              />
            </div>

            <div className="form-row">
              <label>Payment Date</label>
              <input 
                type="text" 
                value={simDate} 
                disabled 
                style={{ backgroundColor: "#e9ecef" }}
              />
            </div>

            {}
            {parseFloat(payAmount) !== activeLoan.balance && (
              <div className="form-row">
                <label>Next Due Date *</label>
                <input 
                  type="date" 
                  value={nextDueDate} 
                  onChange={(e) => setNextDueDate(e.target.value)} 
                  required
                />
              </div>
            )}

            <div className="form-row">
              <label>Payment Remarks / Notes</label>
              <input 
                type="text" 
                value={payNotes} 
                onChange={(e) => setPayNotes(e.target.value)} 
                placeholder="UPI, Cash, Bank Transfer etc."
              />
            </div>
          </fieldset>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button type="submit" className="action-btn-blue">Add Payment</button>
            <button type="button" className="action-btn-gray" onClick={() => onNavigate("customer-list")}>Back</button>
          </div>
        </form>
      ) : customer ? (
        <div className="no-data">
          <p>This customer does not have any active loans. All accounts are fully paid and closed!</p>
        </div>
      ) : null}
    </div>
  );
}
