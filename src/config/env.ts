import dotenv from "dotenv";
import path from "node:path";
import { PROJECT_ROOT } from "./constants";

// override: true so the file wins over existing shell variables. Windows (and some shells) set
// USERNAME to the logged-in OS user, which would otherwise shadow USERNAME from .env. CI has no
// .env file, so it is unaffected and uses the workflow's environment variables.
dotenv.config({ path: path.join(PROJECT_ROOT, ".env"), quiet: true, override: true });

const REQUIRED_VARS = ["ENV", "BASE_URL", "API_URL", "USERNAME", "PASSWORD"] as const;
type RequiredVar = (typeof REQUIRED_VARS)[number];

export interface Env {
  environment: string;
  baseUrl: string;
  apiUrl: string;
  username: string;
  password: string;
  timeoutMs: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;

/** True for empty values and for untouched `.env.example` placeholders such as `<your-username>`. */
function isUnset(value: string | undefined): boolean {
  const trimmed = value?.trim();
  return !trimmed || /^<.*>$/.test(trimmed);
}

function assertAbsoluteUrl(name: RequiredVar, value: string): void {
  try {
    new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute URL (e.g. https://example.com), got "${value}".`);
  }
}

/**
 * Reads and validates environment configuration.
 * Throws at import time, so a misconfigured run stops before any test starts.
 */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const missing = REQUIRED_VARS.filter((name) => isUnset(source[name]));
  if (missing.length > 0) {
    throw new Error(
      `Missing or placeholder value for required environment variable(s): ${missing.join(", ")}.\n` +
        "Copy .env.example to .env and fill in the values (or set them in your shell / CI).",
    );
  }

  const value = (name: RequiredVar): string => (source[name] ?? "").trim();

  const baseUrl = value("BASE_URL");
  // Trailing slashes are dropped so the API client can always join with "/path".
  const apiUrl = value("API_URL").replace(/\/+$/, "");
  assertAbsoluteUrl("BASE_URL", baseUrl);
  assertAbsoluteUrl("API_URL", apiUrl);

  const timeoutRaw = source.TIMEOUT_MS?.trim();
  const timeoutMs = timeoutRaw ? Number(timeoutRaw) : DEFAULT_TIMEOUT_MS;
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error(`TIMEOUT_MS must be a positive integer (milliseconds), got "${timeoutRaw}".`);
  }

  return {
    environment: value("ENV"),
    baseUrl,
    apiUrl,
    username: value("USERNAME"),
    password: value("PASSWORD"),
    timeoutMs,
  };
}

export const env: Env = loadEnv();
