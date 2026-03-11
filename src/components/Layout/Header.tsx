import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { user, configured, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-blue-600" fill="currentColor">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
          </svg>
          <span className="text-xl font-semibold text-gray-800">NewsHub</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Settings
          </Link>
          {configured && user ? (
            <div className="flex items-center gap-2">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="h-8 w-8 rounded-full"
              />
              <span className="hidden text-sm text-gray-600 sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Connect GitHub
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
