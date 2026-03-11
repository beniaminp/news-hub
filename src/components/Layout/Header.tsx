import { Link } from 'react-router-dom';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

export function Header() {
  const { canInstall, install } = useInstallPrompt();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-blue-600" fill="currentColor">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
          </svg>
          <span className="text-xl font-semibold text-gray-800">NewsHub</span>
        </Link>

        <div className="flex items-center gap-2">
          {canInstall && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Install
            </button>
          )}
          <Link
            to="/settings"
            className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Settings
          </Link>
        </div>
      </div>
    </header>
  );
}
