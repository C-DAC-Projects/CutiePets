import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react'; // keep this import if you have lucide-react installed
import '../styles/layout.css';

const Layout = ({ isMobile, sidebarOpen, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Sidebar is part of the flow (flex) so no blank column will appear */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <div className={`main-content ${sidebarOpen ? '' : 'collapsed'}`}>
        {/* Mobile menu button (small screens) */}
        {isMobile && (
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            ☰
          </button>
        )}

        {/* Top navigation bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="dashboard-title">🐾 Cutiepets Admin</h1>
          </div>

          <div className="topbar-right">
            {currentUser ? (
              <div className="user-info">
                {/* only render avatar if we have a name */}
                {currentUser?.name ? (
                  <div className="user-avatar">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                ) : null}

                <span className="user-name">{currentUser?.name || ''}</span>

                <button className="logout-btn" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                Login
              </Link>
            )}
          </div>
        </header>

        {/* Main content area */}
        <main className="content">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} Cutiepets Admin Dashboard</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
