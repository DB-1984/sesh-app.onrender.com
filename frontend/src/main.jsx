import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store.js";
import "./index.css";
import App from "./App.jsx";
import LoginRegisterPage from "./pages/LoginRegisterPage.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import ViewSesh from "./components/ViewSesh.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardStats from "./components/DashboardStats.jsx";
import Profile from "./pages/Profile.jsx";
import OAuthSuccess from "./pages/OAuthSuccess.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/users/login" element={<LoginRegisterPage mode="login" />} />
      <Route
        path="/users/register"
        element={<LoginRegisterPage mode="register" />}
      />

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/users" element={<Header />}>
          {/* 1. Dashboard handles ONLY Stats & Profile */}
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<DashboardStats />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* 2. Sesh View: Sibling to Dashboard, but still under Header */}
          {/* Use :id to match useParams() call */}
          <Route path="sesh/:id" element={<ViewSesh />}>
            <Route path="exercise/:exerciseId/edit" element={<></>} />
          </Route>
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      {/* Catch-all redirect to login */}
      <Route path="*" element={<Navigate to="/users/login" replace />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
