import { useEffect, useState } from "react";

/** Local demo identity. No server: the session and the demo credentials live in
 *  localStorage so a signed-in practice survives a refresh. */

export type SessionRole = "PRACTITIONER" | "CLIENT";

export interface Session {
  role: SessionRole;
  name: string;
  email: string;
  at: string;
}

export interface DemoAccount {
  role: SessionRole;
  name: string;
  email: string;
  password: string;
  note: string;
}

export const ROLE_LABEL: Record<SessionRole, string> = {
  PRACTITIONER: "Practitioner",
  CLIENT: "Client",
};

export const DEMO_ACCOUNTS: Record<SessionRole, DemoAccount> = {
  PRACTITIONER: {
    role: "PRACTITIONER",
    name: "Dr. Rahman",
    email: "rahman@unfazed.in",
    password: "unfazed2026",
    note: "Owns the practice console",
  },
  CLIENT: {
    role: "CLIENT",
    name: "Aarav Verma",
    email: "aarav.verma@gmail.com",
    password: "unfazed2026",
    note: "Sees the client portal",
  },
};

const SESSION_KEY = "unfazed.session.v1";
const REMEMBER_KEY = "unfazed.remembered.v1";
const EVENT = "unfazed:session";

let cache: Session | null | undefined;

const isSession = (value: unknown): value is Session => {
  if (!value || typeof value !== "object") return false;
  const s = value as Partial<Session>;
  return (
    (s.role === "PRACTITIONER" || s.role === "CLIENT") &&
    typeof s.name === "string" &&
    typeof s.email === "string" &&
    typeof s.at === "string"
  );
};

const load = (): Session | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export function readSession(): Session | null {
  if (cache === undefined) cache = load();
  return cache;
}

const emit = () => {
  cache = load();
  window.dispatchEvent(new Event(EVENT));
};

export function signIn(input: Omit<Session, "at">): Session {
  const session: Session = { ...input, at: new Date().toISOString() };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* storage blocked — the session still holds for this tab */
  }
  cache = session;
  emit();
  return session;
}

export function signOut() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  cache = null;
  emit();
}

export function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(() => readSession());
  useEffect(() => {
    const sync = () => setSession(readSession());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return session;
}

export const rememberedEmail = () => {
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
};

export function rememberEmail(email: string | null) {
  try {
    if (email) localStorage.setItem(REMEMBER_KEY, email);
    else localStorage.removeItem(REMEMBER_KEY);
  } catch {
    /* ignore */
  }
}

/* ── Self-service accounts ─────────────────────────────────────────────
 *  Anyone can open an account in this demo. The record lives on this device
 *  only, and the password is kept as a salted SHA-256 digest rather than the
 *  text that was typed. There is no server here, so this protects the demo,
 *  not real clinical data. */

export interface StoredAccount {
  id: string;
  role: SessionRole;
  name: string;
  email: string;
  salt: string;
  hash: string;
  at: string;
}

export interface AccountIdentity {
  role: SessionRole;
  name: string;
  email: string;
}

export type AuthResult =
  | { ok: true; account: AccountIdentity }
  | { ok: false; error: string };

const ACCOUNTS_KEY = "unfazed.accounts.v1";

const isStoredAccount = (value: unknown): value is StoredAccount => {
  if (!value || typeof value !== "object") return false;
  const a = value as Partial<StoredAccount>;
  return (
    typeof a.id === "string" &&
    (a.role === "PRACTITIONER" || a.role === "CLIENT") &&
    typeof a.name === "string" &&
    typeof a.email === "string" &&
    typeof a.salt === "string" &&
    typeof a.hash === "string" &&
    typeof a.at === "string"
  );
};

export function listAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isStoredAccount) : [];
  } catch {
    return [];
  }
}

const saveAccounts = (accounts: StoredAccount[]) => {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    /* storage blocked — the account still works for this tab */
  }
};

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const randomSalt = () => {
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  return toHex(bytes);
};

const digestPassword = async (salt: string, password: string): Promise<string> => {
  const input = `${salt}\u00b7${password}\u00b7unfazed`;
  const subtle = globalThis.crypto?.subtle;
  if (subtle) {
    try {
      const buffer = await subtle.digest("SHA-256", new TextEncoder().encode(input));
      return toHex(new Uint8Array(buffer));
    } catch {
      /* insecure context — fall back to the local mixer below */
    }
  }
  let a = 0x811c9dc5;
  let b = 0x01000193;
  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);
    a = Math.imul(a ^ code, 16777619) >>> 0;
    b = Math.imul(b + code, 2246822519) >>> 0;
  }
  return `local-${a.toString(16)}${b.toString(16)}`;
};

const roleMismatch = (accountRole: SessionRole) =>
  `That email belongs to a ${ROLE_LABEL[accountRole].toLowerCase()} account — switch the tab above.`;

const demoByEmail = (email: string) =>
  Object.values(DEMO_ACCOUNTS).find((account) => account.email.toLowerCase() === email);

/** Check a sign-in attempt against accounts created on this device, then the
 *  published demo logins. */
export async function authenticate(
  emailInput: string,
  password: string,
  expectedRole: SessionRole,
): Promise<AuthResult> {
  const email = emailInput.trim().toLowerCase();
  const stored = listAccounts().find((account) => account.email === email);

  if (stored) {
    const hash = await digestPassword(stored.salt, password);
    if (hash !== stored.hash) {
      return { ok: false, error: "That password doesn't match this account. Try again." };
    }
    if (stored.role !== expectedRole) return { ok: false, error: roleMismatch(stored.role) };
    return { ok: true, account: { role: stored.role, name: stored.name, email: stored.email } };
  }

  const demo = demoByEmail(email);
  if (demo) {
    if (password !== demo.password) {
      return { ok: false, error: "That password doesn't match this account. Try again." };
    }
    if (demo.role !== expectedRole) return { ok: false, error: roleMismatch(demo.role) };
    return { ok: true, account: { role: demo.role, name: demo.name, email: demo.email } };
  }

  return { ok: false, error: "No account uses that email yet — create one below." };
}

/** Open an account for anyone who asks, with no server involved. */
export async function createAccount(input: {
  role: SessionRole;
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim().replace(/\s+/g, " ");
  const taken = "That email already has an account — sign in instead.";

  if (demoByEmail(email) || listAccounts().some((account) => account.email === email)) {
    return { ok: false, error: taken };
  }

  const salt = randomSalt();
  const hash = await digestPassword(salt, input.password);
  const account: StoredAccount = {
    id: `acc_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    role: input.role,
    name,
    email,
    salt,
    hash,
    at: new Date().toISOString(),
  };

  saveAccounts([account, ...listAccounts()]);
  return { ok: true, account: { role: account.role, name: account.name, email: account.email } };
}

export const initialsOf = (name: string) =>
  name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
