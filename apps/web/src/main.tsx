import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./style.css";
import { Header } from "@repo/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import StakersPage from "./pages/StakersPage";
import StakerPage from "./pages/StakerPage";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col">
          <Header />
          <div className="card">
            <Routes>
              <Route path="/" element={<StakersPage />} />
              <Route path="/stakers" element={<StakersPage />} />
              <Route path="/staker/:address" element={<StakerPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("app")!).render(<App />);
