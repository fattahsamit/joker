import type { NewPost } from "../api/types";
import { uniqueString } from "../utils/random";

/** An existing post on jsonplaceholder that always returns the same content. */
export const existingPost = { id: 1, userId: 1 } as const;

/** Builds a unique post so repeated or parallel runs never send identical payloads. */
export function buildNewPost(overrides: Partial<NewPost> = {}): NewPost {
  return {
    userId: 1,
    title: uniqueString("qa-post"),
    body: "Created by the Playwright API test suite.",
    ...overrides,
  };
}
