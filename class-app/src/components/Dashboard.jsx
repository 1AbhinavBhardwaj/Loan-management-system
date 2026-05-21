import React from "react";

export default function Dashboard({ customers, onNavigate, onSelectCustomer }) {
  
  const formatRupees = (amount) => {
    return "₹" + Number(amount).toLocaleString("en-IN");
  };

  
  const totalCustomers = customers.length;

  let totalOutstanding = 0;
  let activeLoansCount = 0;
  let completedLoansCount = 0;
  const activeLoans = [];

  customers.forEach((customer) => {
    customer.loans.forEach((loan) => {
      if (loan.status === "active") {
        totalOutstanding += loan.balance;
        activeLoansCount += 1;
        activeLoans.push({
          customerName: customer.name,
          customerId: customer.id,
          loanId: loan.id,
          productName: loan.productName,
          price: loan.price,
          balance: loan.balance,
          dueDate: loan.dueDate
        });
      } else if (loan.status === "completed") {
        completedLoansCount += 1;
      }
    });
  });

  return (
    <div className="page-container">
      <h2>Dashboard Overview</h2>
      
      {}
      <div className="stats-container">
        <div className="stat-box">
          <h3>Total Customers</h3>
          <p className="stat-value">{totalCustomers}</p>
        </div>
        <div className="stat-box">
          <h3>Outstanding Amount</h3>
          <p className="stat-value text-red">{formatRupees(totalOutstanding)}</p>
        </div>
        <div className="stat-box">
          <h3>Active Loans</h3>
          <p className="stat-value">{activeLoansCount}</p>
        </div>
        <div className="stat-box">
          <h3>Completed Loans</h3>
          <p className="stat-value text-green">{completedLoansCount}</p>
        </div>
      </div>

      <h3>Active Loans List</h3>
      {activeLoans.length === 0 ? (
        <p className="no-data">No active loans found. All loans are fully cleared!</p>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Product Price</th>
              <th>Remaining Balance</th>
              <th>Next Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeLoans.map((item, index) => (
              <tr key={index}>
                <td>{item.customerName}</td>
                <td>{item.productName}</td>
                <td>{formatRupees(item.price)}</td>
                <td className="bold text-orange">{formatRupees(item.balance)}</td>
                <td className="bold">{item.dueDate}</td>
                <td>
                  <button 
                    className="action-btn-blue"
                    onClick={() => {
                      onSelectCustomer(item.customerId);
                      onNavigate("update-payment");
                    }}
                  >
                    Update Payment
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
