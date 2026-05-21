import React, { useState } from "react";

export default function AddCustomer({ simDate, onAddCustomer, onNavigate }) {
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [dueDate, setDueDate] = useState("");

  
  const parsedPrice = parseFloat(price) || 0;
  const parsedDownPayment = parseFloat(downPayment) || 0;
  const remainingBalance = Math.max(0, parsedPrice - parsedDownPayment);

  
  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!name.trim() || !phone.trim() || !productName.trim() || !price) {
      alert("Please fill in all the required fields!");
      return;
    }

    if (parsedPrice <= 0) {
      alert("Product price must be a positive number!");
      return;
    }

    if (parsedDownPayment < 0 || parsedDownPayment > parsedPrice) {
      alert("Down payment must be between 0 and the product price!");
      return;
    }

    if (remainingBalance > 0 && !dueDate) {
      alert("Please select a Next Due Date for the remaining balance!");
      return;
    }

    
    const newCustomer = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      productName: productName.trim(),
      price: parsedPrice,
      downPayment: parsedDownPayment,
      balance: remainingBalance,
      startDate: simDate, 
      dueDate: remainingBalance > 0 ? dueDate : null,
      status: remainingBalance === 0 ? "completed" : "active"
    };

    onAddCustomer(newCustomer);
    
    
    alert("New purchase registered successfully!");
    onNavigate("customer-list");
  };

  return (
    <div className="page-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Register New Purchase</h2>
      <form onSubmit={handleSubmit} className="student-form">
        
        <fieldset>
          <legend>Customer Personal Information</legend>
          
          <div className="form-row">
            <label>Full Name *</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Amit Kumar" 
              required
            />
          </div>

          <div className="form-row">
            <label>Phone Number *</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="10 digit phone number" 
              required
            />
          </div>

          <div className="form-row">
            <label>Residential Address</label>
            <textarea 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Enter full address" 
              rows="3"
            />
          </div>
        </fieldset>

        <fieldset style={{ marginTop: "20px" }}>
          <legend>Product & Down-payment Details</legend>
          
          <div className="form-row">
            <label>Product Name *</label>
            <input 
              type="text" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
              placeholder="e.g. Voltas Refrigerator 300L" 
              required
            />
          </div>

          <div className="form-row">
            <label>Product Price (₹) *</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="e.g. 25000" 
              required
            />
          </div>

          <div className="form-row">
            <label>Down Payment (₹)</label>
            <input 
              type="number" 
              value={downPayment} 
              onChange={(e) => setDownPayment(e.target.value)} 
              placeholder="e.g. 5000" 
            />
          </div>

          <div className="form-row">
            <label>Remaining Balance (₹)</label>
            <input 
              type="text" 
              value={remainingBalance} 
              disabled 
              style={{ backgroundColor: "#e9ecef" }}
            />
          </div>

          {remainingBalance > 0 && (
            <div className="form-row">
              <label>Next Due Date *</label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                required
              />
            </div>
          )}

          <div className="form-row">
            <label>Purchase Date</label>
            <input 
              type="text" 
              value={simDate} 
              disabled 
              style={{ backgroundColor: "#e9ecef" }}
            />
            <small style={{ color: "#6c757d" }}>Automatically logged on current date.</small>
          </div>
        </fieldset>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button type="submit" className="action-btn-green">Save Purchase Record</button>
          <button type="button" className="action-btn-gray" onClick={() => onNavigate("dashboard")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
