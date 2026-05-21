import React, { useState } from "react";

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

      {}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
        <label className="bold">Search:</label>
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search by name or phone..." 
          className="search-input"
        />
        {search && (
          <button className="action-btn-gray" onClick={() => setSearch("")} style={{ padding: "4px 8px" }}>
            Clear
          </button>
        )}
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
            {filteredCustomers.map((customer, cIdx) => {
              return customer.loans.map((loan, lIdx) => {
                const totalPaid = loan.price - loan.balance;
                return (
                  <tr key={`${cIdx}-${lIdx}`}>
                    {}
                    <td>
                      <div className="bold">{customer.name}</div>
                      <div>📞 {customer.phone}</div>
                      <div className="text-muted" style={{ fontSize: "12px" }}> {customer.address || "No address entered"}</div>
                    </td>
                    
                    {}
                    <td>
                      <div className="bold">{loan.productName}</div>
                      <div style={{ fontSize: "12px" }}>Price: {formatRupees(loan.price)}</div>
                      <div style={{ fontSize: "12px" }}>Down-payment: {formatRupees(loan.downPayment)}</div>
                    </td>

                    {}
                    <td>
                      <div>Balance: <span className="bold text-orange">{formatRupees(loan.balance)}</span></div>
                      <div style={{ fontSize: "12px" }}>Total Paid: {formatRupees(totalPaid)}</div>
                      <div style={{ fontSize: "12px" }}>Next Due: {loan.dueDate || "Completed"}</div>
                    </td>

                    {}
                    <td>
                      {loan.status === "completed" ? (
                        <span className="badge-simple text-green" style={{ border: "1px solid green", backgroundColor: "#e2f0d9" }}>
                          Completed
                        </span>
                      ) : (
                        <span className="badge-simple text-orange" style={{ border: "1px solid orange", backgroundColor: "#fff2cc" }}>
                          Active Loan
                        </span>
                      )}
                    </td>

                    {}
                    <td>
                      {loan.status === "active" ? (
                        <button 
                          className="action-btn-blue"
                          onClick={() => {
                            onSelectCustomer(customer.id);
                            onNavigate("update-payment");
                          }}
                        >
                          Record Payment
                        </button>
                      ) : (
                        <button className="action-btn-gray" disabled>
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
