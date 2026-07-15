import { useState } from "react";

export default function CustomerList({ customers, onNavigate, onSelectCustomer }) {
  const [search, setSearch] = useState("");

  const formatRupees = (amount) => {
    return "₹" + Number(amount).toLocaleString("en-IN");
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    );
  });

  return (
    <div className="page-container">
      <h2>Registered Customers List</h2>

      {/* Modern Search Bar */}
      <div className="search-container">
        <label className="bold" style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Search Profile:</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search by name or phone..." 
            className="search-input"
          />
          {search && (
            <button 
              className="action-btn-gray" 
              onClick={() => setSearch("")} 
              style={{ 
                position: "absolute", 
                right: "8px", 
                padding: "4px 10px", 
                fontSize: "12px", 
                borderRadius: "var(--radius-sm)",
                height: "auto",
                width: "auto"
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <p className="no-data">No customer records found matching your search.</p>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>Personal Details</th>
              <th>Product Details</th>
              <th>Financial Stats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => {
              return customer.loans.map((loan, lIdx) => {
                const totalPaid = loan.price - loan.balance;
                return (
                  <tr key={`${customer.id}-${loan.id || lIdx}`}>
                    {/* Customer Personal Details */}
                    <td>
                      <div className="bold" style={{ fontSize: "15px", color: "var(--text-primary)" }}>{customer.name}</div>
                      <div style={{ fontSize: "13px", marginTop: "2px" }}>📞 {customer.phone}</div>
                      <div className="text-muted" style={{ fontSize: "12px", marginTop: "4px" }}>
                        📍 {customer.address || "No address entered"}
                      </div>
                    </td>
                    
                    {/* Loan Product Details */}
                    <td>
                      <div className="bold" style={{ color: "var(--primary-text)" }}>{loan.productName}</div>
                      <div style={{ fontSize: "12px", marginTop: "3px", color: "var(--text-secondary)" }}>
                        Price: {formatRupees(loan.price)}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Down-payment: {formatRupees(loan.downPayment)}
                      </div>
                    </td>

                    {/* Financial Status & Balance */}
                    <td>
                      <div>Balance: <span className="bold text-orange">{formatRupees(loan.balance)}</span></div>
                      <div style={{ fontSize: "12px", marginTop: "3px", color: "var(--text-secondary)" }}>
                        Total Paid: {formatRupees(totalPaid)}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Next Due: <span className="bold">{loan.dueDate || "Completed"}</span>
                      </div>
                    </td>

                    {/* Status Badges */}
                    <td>
                      {loan.status === "completed" ? (
                        <span className="badge-simple text-green" style={{ border: "1px solid var(--success)", backgroundColor: "var(--success-bg)" }}>
                          Completed
                        </span>
                      ) : (
                        <span className="badge-simple text-orange" style={{ border: "1px solid var(--warning)", backgroundColor: "var(--warning-bg)" }}>
                          Active Loan
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td>
                      {loan.status === "active" ? (
                        <button 
                          className="action-btn-blue"
                          onClick={() => {
                            onSelectCustomer(customer.id);
                            onNavigate("update-payment");
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          Record Payment
                        </button>
                      ) : (
                        <button className="action-btn-gray" style={{ opacity: 0.6, cursor: "not-allowed" }} disabled>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                          Cleared
                        </button>
                      )}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
