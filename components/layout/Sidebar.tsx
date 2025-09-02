
import React, { useState } from 'react';
import { Page, CreditTab } from '../../types';
import { ChartPieIcon, CreditCardIcon, ShoppingCartIcon, ArchiveBoxIcon, ChevronDownIcon, Bars3Icon, XMarkIcon, DocumentTextIcon } from '../../assets/icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setActiveCreditTab: (tab: CreditTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen, setActiveCreditTab }) => {
  const [isCreditsOpen, setCreditsOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard' as Page, icon: <ChartPieIcon /> },
    {
      name: 'Créditos' as Page,
      icon: <CreditCardIcon />,
      subItems: ['Facturación', 'Pagos', 'Notas de crédito'],
    },
    { name: 'Contado' as Page, icon: <ShoppingCartIcon /> },
    { name: 'Facturación' as Page, icon: <DocumentTextIcon /> },
    { name: 'Inventarios' as Page, icon: <ArchiveBoxIcon /> },
  ];

  const NavLink: React.FC<{ name: Page; icon: React.ReactNode }> = ({ name, icon }) => (
    <button
      onClick={() => setCurrentPage(name)}
      className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        currentPage === name
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-200 hover:bg-blue-800 hover:text-white'
      }`}
    >
      <span className="w-6 h-6 mr-3">{icon}</span>
      <span className="font-medium">{name}</span>
    </button>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-0'
        } overflow-hidden lg:w-64 lg:relative lg:translate-x-0 fixed lg:static h-full z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 h-16">
          <span className="text-xl font-bold whitespace-nowrap">Supermercado</span>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white p-1">
             <XMarkIcon />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4">
          {navItems.map((item) =>
            !item.subItems ? (
              <NavLink key={item.name} name={item.name} icon={item.icon} />
            ) : (
              <div key={item.name}>
                <button
                  onClick={() => {
                     setCreditsOpen(!isCreditsOpen);
                     setCurrentPage(item.name);
                  }}
                  className={`w-full flex items-center justify-between p-3 my-1 rounded-lg transition-colors duration-200 ${
                    currentPage === item.name
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-200 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 mr-3">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${
                      isCreditsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isCreditsOpen && (
                  <div className="pl-8 py-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <a
                        key={subItem}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage('Créditos');
                            setActiveCreditTab(subItem as CreditTab);
                            if (window.innerWidth < 1024) {
                                setIsOpen(false);
                            }
                        }}
                        className="block text-sm p-2 rounded-md text-gray-300 hover:bg-blue-800 hover:text-white"
                      >
                        {subItem}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <img className="h-10 w-10 rounded-full" src="https://picsum.photos/100" alt="User" />
            <div className="ml-3">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-400">admin@super.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;