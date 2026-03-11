import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { getGitHubUser, setGitHubConfig, clearGitHubConfig, isGitHubConfigured } from '../services/githubStorage';

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
}

interface AuthContextType {
  user: GitHubUser | null;
  loading: boolean;
  configured: boolean;
  login: (token: string, repo: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(isGitHubConfigured());

  useEffect(() => {
    async function init() {
      if (isGitHubConfigured()) {
        const ghUser = await getGitHubUser();
        setUser(ghUser);
        setConfigured(true);
      }
      setLoading(false);
    }
    init();
  }, []);

  const login = useCallback(async (token: string, repo: string): Promise<boolean> => {
    setGitHubConfig(token, repo);
    const ghUser = await getGitHubUser();
    if (ghUser) {
      setUser(ghUser);
      setConfigured(true);
      return true;
    }
    clearGitHubConfig();
    return false;
  }, []);

  const logout = useCallback(() => {
    clearGitHubConfig();
    setUser(null);
    setConfigured(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, configured, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
