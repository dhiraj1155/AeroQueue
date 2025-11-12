// src/context/ConnectionContext.jsx
import { createContext, useState, useContext } from "react";
import axios from "axios";

const backendUrl = "http://localhost:3000";
const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
  const [connectionState, setConnectionState] = useState({
    isConnected: false,
    isConnecting: false,
    success: "",
    error: "",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const connectBroker = async (formData) => {
    setConnectionState({ isConnected: false, isConnecting: true });
    try {
      await axios.post(`${backendUrl}/connect`, formData, { headers });
      setConnectionState({
        isConnected: true,
        isConnecting: false,
        success: "Connected successfully!",
        error: "",
      });
      localStorage.setItem("brokerFormData", JSON.stringify(formData));
    } catch (err) {
      setConnectionState({
        isConnected: false,
        isConnecting: false,
        success: "",
        error: err.response?.data?.message || "Connection failed",
      });
    }
  };

  const disconnectBroker = async () => {
    try {
      await axios.post(`${backendUrl}/disconnect`, {}, { headers });
      setConnectionState({
        isConnected: false,
        isConnecting: false,
        success: "",
        error: "",
      });
      localStorage.removeItem("brokerFormData");
    } catch (err) {
      setConnectionState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Disconnection failed",
      }));
    }
  };

  return (
    <ConnectionContext.Provider
      value={{ connectionState, connectBroker, disconnectBroker }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext);
