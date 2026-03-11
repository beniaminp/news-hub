import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [token, setToken] = useState('');
  const [repo, setRepo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(token, repo);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid token or unable to access the repository. Check your token has "repo" scope.');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Connect to GitHub</h1>
          <p className="mt-2 text-gray-500">
            Your preferences are stored as a file in your GitHub repo
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            <p className="mb-2 font-medium">How it works:</p>
            <ol className="list-inside list-decimal space-y-1 text-blue-600">
              <li>Create a <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="underline">Personal Access Token</a> with <code className="rounded bg-blue-100 px-1">repo</code> scope</li>
              <li>Enter it below with your news-hub repo name</li>
              <li>Preferences sync as commits to <code className="rounded bg-blue-100 px-1">data/preferences.json</code></li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="repo" className="mb-1 block text-sm font-medium text-gray-700">
                Repository
              </label>
              <input
                id="repo"
                type="text"
                required
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="owner/news-hub"
              />
              <p className="mt-1 text-xs text-gray-400">The repo where this app is deployed</p>
            </div>
            <div>
              <label htmlFor="token" className="mb-1 block text-sm font-medium text-gray-700">
                Personal Access Token
              </label>
              <input
                id="token"
                type="password"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="ghp_xxxxxxxxxxxx"
              />
              <p className="mt-1 text-xs text-gray-400">Stored locally in your browser only</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip — use without syncing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
