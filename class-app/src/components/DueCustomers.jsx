import React from "react";

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
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Date: <strong>{simDate}</strong>
      </p>

      {}
      <h3 className="text-orange">Payments Due Today ({dueTodayList.length})</h3>
      {dueTodayList.length === 0 ? (
        <p className="no-data" style={{ marginBottom: "30px" }}>No customers have payments scheduled for today.</p>
      ) : (
        <table className="simple-table" style={{ marginBottom: "30px" }}>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Product Model</th>
              <th>Outstanding Balance</th>
              <th>Due Date</th>
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
                <td className="bold text-orange">Today ({loan.dueDate})</td>
                <td>
                  <button 
                    className="action-btn-green"
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

      {}
      <h3 className="text-red">Overdue Payments ({overdueList.length})</h3>
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
              <th>Due Date</th>
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
