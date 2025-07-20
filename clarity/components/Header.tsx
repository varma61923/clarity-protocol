import React, { useState, useEffect } from 'react';
import { View, Theme } from '../types';
import ClarityLogo from './icons/ClarityLogo';
import WalletConnect from './WalletConnect';
import ThemeToggle from './ThemeToggle';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import SearchIcon from './icons/SearchIcon';
import { useI18n } from '../contexts/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';
import { SiweSession } from '../types';

interface HeaderProps {
  onNavigate: (view: View) => void;
  session: SiweSession | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  theme: Theme;
  toggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const NavLink: React.FC<{ children: React.ReactNode, onClick: () => void, className?: string, isActive?: boolean }> = ({ children, onClick, className="", isActive=false }) => (
  <button onClick={onClick} className={`px-3 py-2 rounded-full text-title-md transition-colors duration-200 ${isActive ? 'text-light-primary dark:text-dark-primary' : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'} ${className}`}>
    {children}
  </button>
);

const SearchInput: React.FC<{ value: string; onChange: (value: string) => void; isMobile?: boolean }> = ({ value, onChange, isMobile = false }) => {
    const { t } = useI18n();
    return (
        <div className="relative w-full max-w-lg">
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-light-on-surface-variant dark:text-dark-on-surface-variant" />
            </div>
            <input
                type="search"
                name="search"
                id={isMobile ? "search-mobile" : "search-desktop"}
                className="block w-full ps-10 pe-4 py-2.5 bg-light-surface-container-high dark:bg-dark-surface-container-high border border-transparent rounded-full text-title-md focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                placeholder={t.searchPlaceholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label={t.search}
            />
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ onNavigate, session, onConnectWallet, onDisconnectWallet, theme, toggleTheme, searchQuery, onSearchChange }) => {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMobileNav = (view: View) => {
    onNavigate(view);
    setIsMenuOpen(false);
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-light-surface-container-low/80 dark:bg-dark-surface-container-low/80 backdrop-blur-sm sticky top-0 z-50 border-b border-light-outline-variant dark:border-dark-outline-variant">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <button onClick={() => onNavigate('home')} className="flex-shrink-0 flex items-center gap-3 text-light-on-surface dark:text-dark-on-surface">
                <ClarityLogo className="h-8 w-8 text-light-primary dark:text-dark-primary" />
                <span className="font-bold text-title-lg">{t.clarity}</span>
              </button>
              <nav className="hidden md:flex ms-6 items-center">
                <NavLink onClick={() => onNavigate('home')}>{t.homeFeed}</NavLink>
                <NavLink onClick={() => onNavigate('governance')}>{t.governance}</NavLink>
                <NavLink onClick={() => onNavigate('whitepaper')}>{t.whitepaper}</NavLink>
              </nav>
            </div>

            <div className="hidden md:flex flex-grow items-center justify-center px-8">
                <SearchInput value={searchQuery} onChange={onSearchChange} />
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden md:block">
                <WalletConnect 
                  session={session}
                  onConnect={onConnectWallet}
                  onDisconnect={onDisconnectWallet}
                  onNavigate={onNavigate}
                />
              </div>
               <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
               <LanguageSwitcher />
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-high dark:hover:bg-dark-surface-container-high">
                  {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-light-surface-dim dark:bg-dark-surface-dim z-40 p-4 flex flex-col">
          <div className="mt-20 flex-grow">
            <div className="px-4">
               <SearchInput value={searchQuery} onChange={onSearchChange} isMobile />
            </div>
            <nav className="flex flex-col items-center gap-4 mt-6">
                <NavLink onClick={() => handleMobileNav('home')} className="text-title-lg">{t.homeFeed}</NavLink>
                <NavLink onClick={() => handleMobileNav('governance')} className="text-title-lg">{t.governance}</NavLink>
                <NavLink onClick={() => handleMobileNav('whitepaper')} className="text-title-lg">{t.whitepaper}</NavLink>
                {session && <NavLink onClick={() => handleMobileNav('subscription')} className="text-title-lg">{t.subscriptions}</NavLink>}
                <div className="mt-8 w-full max-w-xs">
                    <WalletConnect 
                        session={session}
                        onConnect={() => { onConnectWallet(); setIsMenuOpen(false); }}
                        onDisconnect={() => { onDisconnectWallet(); setIsMenuOpen(false); }}
                        onNavigate={(view) => { onNavigate(view); setIsMenuOpen(false); }}
                        isMobile
                    />
                </div>
            </nav>
          </div>
          <div className="text-center text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant pb-4">
             {t.protocolRights.replace('{year}', `${new Date().getFullYear()}`)}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;