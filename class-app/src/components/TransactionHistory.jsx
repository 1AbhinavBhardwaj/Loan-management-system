import React from "react";

export default function TransactionHistory({ customers }) {
  const formatRupees = (amount) => {
    return "₹" + Number(amount).toLocaleString("en-IN");
  };

  
  const allTransactions = [];

  customers.forEach((customer) => {
    customer.loans.forEach((loan) => {
      loan.transactions.forEach((tx) => {
        allTransactions.push({
          ...tx,
          customerName: customer.name,
          productName: loan.productName
        });
      });
    });
  });

  
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="page-container">
      <h2>All Payment Transactions Ledger</h2>
      <p style={{ color: "#666", marginBottom: "15px" }}>
        Chronological list of all payments logged in the system.
      </p>

      {allTransactions.length === 0 ? (
        <p className="no-data">No transactions have been recorded in the database yet.</p>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Product Model</th>
              <th>Payment Type</th>
              <th>Amount Collected</th>
              <th>Remarks / Notes</th>
            </tr>
          </thead>
          <tbody>
            {allTransactions.map((tx, index) => (
              <tr key={index}>
                <td className="bold">{tx.date}</td>
                <td>{tx.customerName}</td>
                <td>{tx.productName}</td>
                <td>
                  {tx.type === "downpayment" ? (
                    <span className="badge-simple text-blue" style={{ border: "1px solid blue", backgroundColor: "#e8f4fd" }}>
                      DOWNPAYMENT (DP)
                    </span>
                  ) : (
                    <span className="badge-simple text-green" style={{ border: "1px solid green", backgroundColor: "#e2f0d9" }}>
                      INSTALLMENT (INST)
                    </span>
                  )}
                </td>
                <td className="bold text-green">{formatRupees(tx.amount)}</td>
                <td>{tx.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
