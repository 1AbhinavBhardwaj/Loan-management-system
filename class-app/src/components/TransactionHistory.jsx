
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

  // Sort transactions chronologically (latest first)
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="page-container">
      <h2>All Payment Transactions Ledger</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "25px", fontSize: "14px" }}>
        Chronological ledger of all payments logged in the system.
      </p>

      {allTransactions.length === 0 ? (
        <p className="no-data">No transactions have been recorded in the database yet.</p>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Product Model</th>
              <th>Payment Type</th>
              <th>Amount Collected</th>
              <th>Remarks / Notes</th>
            </tr>
          </thead>
          <tbody>
            {allTransactions.map((tx, index) => (
              <tr key={tx.id || index}>
                <td className="bold" style={{ color: "var(--text-primary)" }}>{tx.date}</td>
                <td>{tx.customerName}</td>
                <td>{tx.productName}</td>
                <td>
                  {tx.type === "downpayment" ? (
                    <span className="badge-simple text-green" style={{ border: "1px solid var(--success)", backgroundColor: "var(--success-bg)", fontSize: "10px" }}>
                      DOWNPAYMENT
                    </span>
                  ) : (
                    <span className="badge-simple text-blue" style={{ border: "1px solid var(--primary)", backgroundColor: "var(--primary-light)", fontSize: "10px" }}>
                      INSTALLMENT
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
