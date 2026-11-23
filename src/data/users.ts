import { env } from "../config/env";

export interface UserCredentials {
  username: string;
  password: string;
}

/**
 * Test users. `validUser` comes from the environment (never commit real credentials).
 * The other accounts are the public demo accounts listed on the saucedemo login page.
 */
export const users = {
  validUser: { username: env.username, password: env.password },
  lockedOutUser: { username: "locked_out_user", password: "secret_sauce" },
  invalidUser: { username: "invalid_user", password: "wrong_password" },
} satisfies Record<string, UserCredentials>;
