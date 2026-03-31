import React, { createContext, useContext, useState } from "react";

// Create context
const StockContext = createContext();

// Provider
export const StockProvider = ({ children }) => {
  const [selectedStock, setSelectedStock] = useState(null);

  return (
    <StockContext.Provider value={{ selectedStock, setSelectedStock }}>
      {children}
    </StockContext.Provider>
  );
};

// Custom hook
export const useStock = () => useContext(StockContext);
