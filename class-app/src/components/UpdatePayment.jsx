import { useState } from "react";

export default function UpdatePayment({ 
  customers, 
  selectedCustomerId, 
  simDate, 
  onRecordPayment, 
  onNavigate 
}) {
  const calculateDefaultDueDate = (baseDate) => {
    if (!baseDate) return "";
    const date = new Date(baseDate);
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  };

  const [payAmount, setPayAmount] = useState("");
  const [payNotes, setPayNotes] = useState("Installment payment");
  const [nextDueDate, setNextDueDate] = useState(() => calculateDefaultDueDate(simDate));
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
    <div className="page-container" style={{ maxWidth: "650px", margin: "0 auto" }}>
      <h2>Update Customer Payment</h2>

      {/* Customer Selector Dropdown */}
      <div className="form-row" style={{ marginBottom: "25px" }}>
        <label className="bold">Select Customer Directory *</label>
        <select 
          value={customerId} 
          onChange={(e) => setCustomerId(e.target.value)}
          className="search-input"
          style={{ width: "100%", padding: "12px", borderRadius: "var(--radius-md)" }}
        >
          <option value="">-- Choose Customer --</option>
          {customers.map((c) => {
            const hasActive = c.loans.some((l) => l.status === "active");
            return (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone}) {hasActive ? "⚡ [Active Loan]" : "✅ [Cleared]"}
              </option>
            );
          })}
        </select>
      </div>

      {customer && activeLoan ? (
        <form onSubmit={handlePaymentSubmit} className="student-form">
          <fieldset>
            <legend>Loan Details & Status</legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", padding: "10px 0", fontSize: "14px" }}>
              <div>
                <strong>Product:</strong> <span style={{ color: "var(--primary-text)" }}>{activeLoan.productName}</span>
              </div>
              <div>
                <strong>Purchase Date:</strong> {activeLoan.startDate}
              </div>
              <div>
                <strong>Original Price:</strong> {formatRupees(activeLoan.price)}
              </div>
              <div>
                <strong>Outstanding Balance:</strong> <span className="text-orange bold">{formatRupees(activeLoan.balance)}</span>
              </div>
            </div>

            {/* Premium warning system alerts */}
            {(showDurationWarning || showTxCountWarning) && (
              <div className="simple-alert-box" style={{ border: "1px solid rgba(220, 53, 69, 0.2)", backgroundColor: "var(--danger-bg)", color: "var(--danger-text)" }}>
                <h4 style={{ margin: "0 0 5px 0", color: "var(--danger-text)", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
                  </svg>
                  System Alert: Account Risk Warning
                </h4>
                {showTxCountWarning && (
                  <p style={{ margin: "3px 0", fontSize: "13px" }}>
                    • <strong>Transaction Threshold:</strong> Account logged {activeLoan.transactions.length} installments (Limit: 5).
                  </p>
                )}
                {showDurationWarning && (
                  <p style={{ margin: "3px 0", fontSize: "13px" }}>
                    • <strong>Payment Overdue:</strong> Active loan duration reached {warningDurationDays} days (~{(warningDurationDays/30).toFixed(1)} months), exceeding standard 6-month limit.
                  </p>
                )}
                <small style={{ color: "var(--text-secondary)", display: "block", marginTop: "5px" }}>
                  Please verify payment capability prior to creating customized schedules.
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
                placeholder={`Outstanding: ${activeLoan.balance}`}
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
                placeholder="UPI, Cash, Bank Transfer, etc."
              />
            </div>
          </fieldset>

          <div style={{ marginTop: "30px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" className="action-btn-gray" onClick={() => onNavigate("customer-list")}>
              Back
            </button>
            <button type="submit" className="action-btn-blue">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Record Payment
            </button>
          </div>
        </form>
      ) : customer ? (
        <div className="no-data" style={{ padding: "30px" }}>
          <p>🎉 This customer does not have any active loans. All accounts are fully paid and closed!</p>
        </div>
      ) : null}
    </div>
  );
}
