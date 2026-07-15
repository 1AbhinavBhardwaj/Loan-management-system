
export default function DueCustomers({ customers, simDate, onNavigate, onSelectCustomer }) {
  const formatRupees = (amount) => {
    return "₹" + Number(amount).toLocaleString("en-IN");
  };

  const dueTodayList = [];
  const overdueList = [];

  customers.forEach((customer) => {
    customer.loans.forEach((loan) => {
      if (loan.status === "active" && loan.dueDate) {
        if (loan.dueDate === simDate) {
          dueTodayList.push({ customer, loan });
        } else if (loan.dueDate < simDate) {
          overdueList.push({ customer, loan });
        }
      }
    });
  });

  return (
    <div className="page-container">
      <h2>Dues & Collection Tracker</h2>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "30px", fontSize: "14px", color: "var(--text-secondary)" }}>
        <span>Simulated Operations Date:</span>
        <strong className="badge-simple text-blue" style={{ border: "1px solid var(--primary)", backgroundColor: "var(--primary-light)", fontSize: "12px", borderRadius: "var(--radius-sm)" }}>
          {simDate}
        </strong>
      </div>

      {/* Due Today Tracker */}
      <h3 className="text-orange" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px", marginBottom: "15px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        Payments Scheduled for Today ({dueTodayList.length})
      </h3>
      {dueTodayList.length === 0 ? (
        <p className="no-data" style={{ marginBottom: "35px" }}>No customers have payments scheduled for today.</p>
      ) : (
        <table className="simple-table" style={{ marginBottom: "35px" }}>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Product Model</th>
              <th>Outstanding Balance</th>
              <th>Status Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dueTodayList.map(({ customer, loan }, index) => (
              <tr key={index}>
                <td className="bold">{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{loan.productName}</td>
                <td className="bold">{formatRupees(loan.balance)}</td>
                <td>
                  <span className="badge-simple text-orange" style={{ border: "1px solid var(--warning)", backgroundColor: "var(--warning-bg)" }}>
                    Due Today
                  </span>
                </td>
                <td>
                  <button 
                    className="action-btn-green"
                    style={{ padding: "8px 16px", fontSize: "13px" }}
                    onClick={() => {
                      onSelectCustomer(customer.id);
                      onNavigate("update-payment");
                    }}
                  >
                    Collect Payment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Overdue Tracker */}
      <h3 className="text-red" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px", marginBottom: "15px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
        </svg>
        Overdue Payments ({overdueList.length})
      </h3>
      {overdueList.length === 0 ? (
        <p className="no-data">Excellent! There are no overdue client profiles.</p>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Product Model</th>
              <th>Outstanding Balance</th>
              <th>Scheduled Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {overdueList.map(({ customer, loan }, index) => (
              <tr key={index} className="overdue-row">
                <td className="bold">{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{loan.productName}</td>
                <td className="bold">{formatRupees(loan.balance)}</td>
                <td className="bold">{loan.dueDate}</td>
                <td>
                  <button 
                    className="action-btn-red"
                    onClick={() => {
                      onSelectCustomer(customer.id);
                      onNavigate("update-payment");
                    }}
                  >
                    Collect Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
