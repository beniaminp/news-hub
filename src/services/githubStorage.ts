import { UserPreferences } from '../types';

const PREFS_PATH = 'data/preferences.json';

interface GitHubFileResponse {
  sha: string;
  content: string;
}

function getConfig() {
  const token = localStorage.getItem('newshub_gh_token');
  const repo = localStorage.getItem('newshub_gh_repo'); // "owner/repo"
  return { token, repo };
}

export function isGitHubConfigured(): boolean {
  const { token, repo } = getConfig();
  return Boolean(token && repo);
}

export function setGitHubConfig(token: string, repo: string) {
  localStorage.setItem('newshub_gh_token', token);
  localStorage.setItem('newshub_gh_repo', repo);
}

export function clearGitHubConfig() {
  localStorage.removeItem('newshub_gh_token');
  localStorage.removeItem('newshub_gh_repo');
  localStorage.removeItem('newshub_gh_user');
}

export async function getGitHubUser(): Promise<{ login: string; avatar_url: string; name: string } | null> {
  const { token } = getConfig();
  if (!token) return null;

  // Check cache first
  const cached = localStorage.getItem('newshub_gh_user');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }

  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const user = { login: data.login, avatar_url: data.avatar_url, name: data.name || data.login };
    localStorage.setItem('newshub_gh_user', JSON.stringify(user));
    return user;
  } catch {
    return null;
  }
}

export async function readPreferences(): Promise<{ prefs: UserPreferences; sha: string } | null> {
  const { token, repo } = getConfig();
  if (!token || !repo) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${PREFS_PATH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;

    const data: GitHubFileResponse = await res.json();
    const content = atob(data.content);
    const prefs: UserPreferences = JSON.parse(content);
    return { prefs, sha: data.sha };
  } catch {
    return null;
  }
}

export async function writePreferences(prefs: UserPreferences): Promise<boolean> {
  const { token, repo } = getConfig();
  if (!token || !repo) return false;

  try {
    // Get current SHA if file exists
    let sha: string | undefined;
    const existing = await readPreferences();
    if (existing) sha = existing.sha;

    const content = btoa(JSON.stringify(prefs, null, 2));

    const body: Record<string, string> = {
      message: `Update news preferences`,
      content,
    };
    if (sha) body.sha = sha;

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${PREFS_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return res.ok;
  } catch {
    return false;
  }
}
