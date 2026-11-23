import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolved from this file's location, so paths work regardless of the directory a command runs from.
export const PROJECT_ROOT = fileURLToPath(new URL("../../", import.meta.url));

/** Where the auth setup project saves the logged-in browser state. Git-ignored. */
export const AUTH_STATE_PATH = path.join(PROJECT_ROOT, "playwright", ".auth", "user.json");
