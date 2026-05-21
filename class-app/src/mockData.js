export const INITIAL_CUSTOMERS = [
  {
    id: "cust_1",
    name: "Abhinav Bhardwaj",
    phone: "9876543210",
    email: "abhinav@lpu.com",
    address: "12 law gate street, Punjab",
    loans: [
      {
        id: "loan_101",
        productName: "Laptop Pro 16\"",
        price: 120000,
        downPayment: 30000,
        balance: 90000,
        startDate: "2026-04-20",
        dueDate: "2026-05-20", 
        status: "active",
        completionDate: null,
        transactions: [
          {
            id: "tx_101_1",
            amount: 30000,
            date: "2026-04-20",
            type: "downpayment",
            notes: "Initial downpayment for laptop."
          }
        ]
      }
    ]
  },
  {
    id: "cust_2",
    name: "Jitesh Bhatia",
    phone: "9812345678",
    email: "jitesh@bhatia.com",
    address: "Hargobindnagar, Phagwara",
    loans: [
      {
        id: "loan_102",
        productName: "NOIDA PROPERTY",
        price: 600000,
        downPayment: 15000,
        balance: 30000,
        startDate: "2026-03-10",
        dueDate: "2026-05-10", 
        status: "active",
        completionDate: null,
        transactions: [
          {
            id: "tx_102_1",
            amount: 15000,
            date: "2026-03-10",
            type: "downpayment",
            notes: "Downpayment."
          },
          {
            id: "tx_102_2",
            amount: 15000,
            date: "2026-04-10",
            type: "installment",
            notes: "First installment."
          }
        ]
      }
    ]
  },
  {
    id: "cust_3",
    name: "Atul Kumar",
    phone: "9898989898",
    email: "atul@uttam.com",
    address: "Teacher's apartment, LPU Phagwara",
    loans: [
      {
        id: "loan_103",
        productName: "Rolls Royce Phantom",
        price: 80000000,
        downPayment: 20000,
        balance: 0,
        startDate: "2026-01-15",
        dueDate: null, 
        status: "completed",
        completionDate: "2026-03-15", 
        transactions: [
          {
            id: "tx_103_1",
            amount: 20000,
            date: "2026-01-15",
            type: "downpayment",
            notes: "Initial downpayment."
          },
          {
            id: "tx_103_2",
            amount: 30000,
            date: "2026-02-15",
            type: "installment",
            notes: "Installment #1."
          },
          {
            id: "tx_103_3",
            amount: 30000,
            date: "2026-03-15",
            type: "installment",
            notes: "Final payment - Balance zero."
          }
        ]
      }
    ]
  },
  {
    id: "cust_4",
    name: "Arunav Tiwary",
    phone: "9777777777",
    email: "arunav@tiwary.com",
    address: "maheru village",
    loans: [
      {
        id: "loan_104",
        productName: "Double-Door Refrigerator",
        price: 50000,
        downPayment: 10000,
        balance: 0,
        startDate: "2026-01-01",
        dueDate: null, 
        status: "completed",
        completionDate: "2026-04-01", 
        transactions: [
          { id: "tx_104_1", amount: 10000, date: "2026-01-01", type: "downpayment", notes: "DP" },
          { id: "tx_104_2", amount: 5000, date: "2026-01-15", type: "installment", notes: "Inst 1" },
          { id: "tx_104_3", amount: 10000, date: "2026-02-01", type: "installment", notes: "Inst 2" },
          { id: "tx_104_4", amount: 5000, date: "2026-02-15", type: "installment", notes: "Inst 3" },
          { id: "tx_104_5", amount: 10000, date: "2026-03-01", type: "installment", notes: "Inst 4" },
          { id: "tx_104_6", amount: 5000, date: "2026-03-15", type: "installment", notes: "Inst 5" },
          { id: "tx_104_7", amount: 5000, date: "2026-04-01", type: "installment", notes: "Inst 6" }
        ] 
      }
    ]
  },
  {
    id: "cust_5",
    name: "Ananya Iyer",
    phone: "9666666666",
    email: "ananya@iyer.com",
    address: "22 Maple Court, Chennai",
    loans: [
      {
        id: "loan_105",
        productName: "Air Conditioner 1.5 Ton",
        price: 40000,
        downPayment: 8000,
        balance: 0,
        startDate: "2025-08-10",
        dueDate: null, 
        status: "completed",
        completionDate: "2026-03-10", 
        transactions: [
          { id: "tx_105_1", amount: 8000, date: "2025-08-10", type: "downpayment", notes: "DP" },
          { id: "tx_105_2", amount: 10000, date: "2025-10-10", type: "installment", notes: "Inst 1" },
          { id: "tx_105_3", amount: 10000, date: "2025-12-10", type: "installment", notes: "Inst 2" },
          { id: "tx_105_4", amount: 12000, date: "2026-03-10", type: "installment", notes: "Final" }
        ] 
      }
    ]
  },
  {
    id: "cust_6",
    name: "Devendra Joshi",
    phone: "9555555555",
    email: "dev@joshi.com",
    address: "90 Cedar Boulevard, Hyderabad",
    loans: [
      {
        id: "loan_106",
        productName: "Front Load Washing Machine",
        price: 35000,
        downPayment: 5000,
        balance: 0,
        startDate: "2025-06-01",
        dueDate: null, 
        status: "completed",
        completionDate: "2026-02-15", 
        transactions: [
          { id: "tx_106_1", amount: 5000, date: "2025-06-01", type: "downpayment", notes: "DP" },
          { id: "tx_106_2", amount: 5000, date: "2025-07-01", type: "installment", notes: "Inst 1" },
          { id: "tx_106_3", amount: 5000, date: "2025-08-15", type: "installment", notes: "Inst 2" },
          { id: "tx_106_4", amount: 5000, date: "2025-10-01", type: "installment", notes: "Inst 3" },
          { id: "tx_106_5", amount: 5000, date: "2025-11-15", type: "installment", notes: "Inst 4" },
          { id: "tx_106_6", amount: 5000, date: "2025-12-20", type: "installment", notes: "Inst 5" },
          { id: "tx_106_7", amount: 5000, date: "2026-02-15", type: "installment", notes: "Final" }
        ] 
      }
    ]
  }
];

export const loadData = () => {
  const data = localStorage.getItem("lms_customers");
  if (!data) {
    localStorage.setItem("lms_customers", JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
  return JSON.parse(data);
};

export const saveData = (customers) => {
  localStorage.setItem("lms_customers", JSON.stringify(customers));
};

export const getSimulatedDate = () => {
  return localStorage.getItem("lms_simulated_date") || "2026-05-20";
};

export const saveSimulatedDate = (date) => {
  localStorage.setItem("lms_simulated_date", date);
};
