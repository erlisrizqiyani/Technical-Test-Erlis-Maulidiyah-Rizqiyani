import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CustomerLayout from "../components/layout/CustomerLayout";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import TransactionsPage from "../pages/TransactionsPage";
import AccountPage from "../pages/AccountPage";

function Protected({ children }) {
  const { customer } = useAuth();
  if (!customer) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <Protected>
        <CustomerLayout />
      </Protected>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "account", element: <AccountPage /> }
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);
