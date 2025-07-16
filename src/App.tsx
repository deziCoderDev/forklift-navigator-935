
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ForkliftsPage from "./pages/Forklifts";
import ReportsPage from "./pages/Reports";
import OperatorsPage from "./pages/Operators";
import OperationsPage from "./pages/Operations";
import MaintenancePage from "./pages/Maintenance";
import GasSupplyPage from "./pages/GasSupply";
import MainLayout from "./components/layout/MainLayout";
import Configuracao from "./pages/Configuracao";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Loading component otimizado
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-600 dark:text-slate-400">Carregando sistema...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="empilhadeiras" element={<ForkliftsPage />} />
              <Route path="operadores" element={<OperatorsPage />} />
              <Route path="operacoes" element={<OperationsPage />} />
              <Route path="manutencao" element={<MaintenancePage />} />
              <Route path="abastecimento" element={<GasSupplyPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="configuracao" element={<Configuracao />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
