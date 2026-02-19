import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    const raw = localStorage.getItem("auth_customer");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.get(
      `/customers?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    if (!data?.length) throw new Error("Email atau password salah");

    const c = data[0];
    const session = { id: c.id, name: c.name, email: c.email, phone: c.phone, balance: c.balance };
    setCustomer(session);
    localStorage.setItem("auth_customer", JSON.stringify(session));
  };

  const refreshMe = async () => {
    if (!customer?.id) return;
    const { data } = await api.get(`/customers/${customer.id}`);
    const session = { id: data.id, name: data.name, email: data.email, phone: data.phone, balance: data.balance };
    setCustomer(session);
    localStorage.setItem("auth_customer", JSON.stringify(session));
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem("auth_customer");
  };

  const value = useMemo(() => ({ customer, login, logout, refreshMe }), [customer]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
