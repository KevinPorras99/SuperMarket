
import React from 'react';
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '../../assets/icons';

interface HeaderProps {
  sidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarToggle }) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0">
      <div className="flex items-center">
        <button onClick={sidebarToggle} className="lg:hidden text-gray-500 mr-4">
          <Bars3Icon />
        </button>
        <div className="relative hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="text-gray-400" />
          </span>
          <input
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar..."
            type="search"
          />
        </div>
      </div>
      <div className="flex items-center">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <BellIcon />
        </button>
        <div className="ml-3 relative">
          <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
            <img className="h-8 w-8 rounded-full" src="https://picsum.photos/100" alt="" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
