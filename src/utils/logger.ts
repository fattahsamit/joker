type Level = "info" | "warn" | "error";

function write(level: Level, scope: string, message: string): void {
  const line = `${new Date().toISOString()} [${level.toUpperCase()}] [${scope}] ${message}`;
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

/** Creates a logger that prefixes every line with a scope, e.g. "auth" or "api". */
export function createLogger(scope: string) {
  return {
    info: (message: string) => write("info", scope, message),
    warn: (message: string) => write("warn", scope, message),
    error: (message: string) => write("error", scope, message),
  };
}
