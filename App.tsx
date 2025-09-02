
import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Credits from './pages/Credits';
import CashSales from './pages/CashSales';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import { Page, CreditTab } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [activeCreditTab, setActiveCreditTab] = useState<CreditTab>('Facturación');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Créditos':
        return <Credits initialTab={activeCreditTab} />;
      case 'Contado':
        return <CashSales />;
      case 'Facturación':
        return <Billing />;
      case 'Inventarios':
        return <Inventory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        setActiveCreditTab={setActiveCreditTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarToggle={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;