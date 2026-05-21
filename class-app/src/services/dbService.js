


const CUSTOMERS_KEY = "student_lms_customers";
const SIM_DATE_KEY  = "student_lms_date";


const DEMO_SEED = [
  {
    id: "cust_1",
    name: "Jitesh Bhatia",
    phone: "9876543210",
    address: "Hargobindnagar,Phagwara",
    loans: [
      {
        id: "loan_1",
        productName: "Mathura Property",
        price: 50000000,
        downPayment: 15000,
        balance: 49985000,
        startDate: "2026-05-10",
        dueDate: "2026-06-10",
        status: "active",
        transactions: [
          { id: "tx_1", amount: 15000, date: "2026-05-10", type: "downpayment", notes: "First downpayment." }
        ]
      }
    ]
  },
  {
    id: "cust_2",
    name: "Atul Kumar",
    phone: "9812345678",
    address: "LPU phagwara",
    loans: [
      {
        id: "loan_2",
        productName: "Rolls Royce Phantom",
        price: 30000000,
        downPayment: 10000,
        balance: 29990000,
        startDate: "2026-04-15",
        dueDate: "2026-05-20", 
        status: "active",
        transactions: [
          { id: "tx_2", amount: 10000, date: "2026-04-15", type: "downpayment", notes: "Initial downpayment." }
        ]
      }
    ]
  },
  {
    id: "cust_3",
    name: "Arunav Tiwary",
    phone: "9988776655",
    address: "Maheru Village",
    loans: [
      {
        id: "loan_3",
        productName: "iPhone 13",
        price: 60000,
        downPayment: 20000,
        balance: 0,
        startDate: "2026-02-01",
        dueDate: null,
        status: "completed",
        transactions: [
          { id: "tx_3_1", amount: 20000, date: "2026-02-01", type: "downpayment", notes: "Initial downpayment." },
          { id: "tx_3_2", amount: 40000, date: "2026-03-01", type: "installment", notes: "Fully cleared payment." }
        ]
      }
    ]
  }
];


export const generateId = () => {
  return "id_" + Math.floor(Math.random() * 1000000);
};


export const getCustomers = () => {
  const data = localStorage.getItem(CUSTOMERS_KEY);
  if (!data) {
    
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(DEMO_SEED));
    return DEMO_SEED;
  }
  return JSON.parse(data);
};


export const saveCustomers = (customers) => {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};


export const getSimulatedDate = () => {
  const date = localStorage.getItem(SIM_DATE_KEY);
  if (!date) {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(SIM_DATE_KEY, today);
    return today;
  }
  return date;
};


export const saveSimulatedDate = (date) => {
  localStorage.setItem(SIM_DATE_KEY, date);
};
