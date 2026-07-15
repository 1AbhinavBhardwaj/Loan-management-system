
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
      
      {/* Premium Stat Cards */}
      <div className="stats-container">
        <div className="stat-box">
          <div className="stat-box-content">
            <h3>Total Customers</h3>
            <p className="stat-value">{totalCustomers}</p>
          </div>
          <div className="stat-box-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "24px", height: "24px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A9.642 9.642 0 0 1 12 20.25a9.642 9.642 0 0 1-3-.109v-.11C9 18.922 9 18 9 18M9 18v-.003c0-1.113.285-2.16.786-3.07M9 18A5.5 5.5 0 0 0 3.5 12.5m6 5.5H9a5.5 5.5 0 0 1-5.5-5.5m0 0A3.5 3.5 0 0 1 7 9a3.5 3.5 0 0 1 3.5 3.5M3.5 12.5v-.003c0-1.113.285-2.16.786-3.07M7.5 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM11.25 11.25a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM22.5 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM18.75 11.25a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
            </svg>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-content">
            <h3>Outstanding Amount</h3>
            <p className="stat-value text-red">{formatRupees(totalOutstanding)}</p>
          </div>
          <div className="stat-box-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "24px", height: "24px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-content">
            <h3>Active Loans</h3>
            <p className="stat-value">{activeLoansCount}</p>
          </div>
          <div className="stat-box-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "24px", height: "24px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-content">
            <h3>Completed Loans</h3>
            <p className="stat-value text-green">{completedLoansCount}</p>
          </div>
          <div className="stat-box-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "24px", height: "24px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>
      </div>

      <h3>Active Loans Registry</h3>
      {activeLoans.length === 0 ? (
        <p className="no-data">No active loans found. All loans are fully cleared!</p>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Product Model</th>
              <th>Product Price</th>
              <th>Remaining Balance</th>
              <th>Next Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeLoans.map((item, index) => (
              <tr key={index}>
                <td className="bold">{item.customerName}</td>
                <td>{item.productName}</td>
                <td>{formatRupees(item.price)}</td>
                <td className="bold text-orange">{formatRupees(item.balance)}</td>
                <td className="bold">{item.dueDate || "Not Scheduled"}</td>
                <td>
                  <button 
                    className="action-btn-blue"
                    onClick={() => {
                      onSelectCustomer(item.customerId);
                      onNavigate("update-payment");
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
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
