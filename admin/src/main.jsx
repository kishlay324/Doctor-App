import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import AdminContextProvider, { AdminContext } from "./context/AdminContext.jsx";
import DoctorContextProvider from "./context/DoctorContext.jsx";


import AppContextProvider from "./context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </HashRouter>
);
