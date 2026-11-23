import type { APIRequestContext, APIResponse } from "@playwright/test";
import { env } from "../config/env";
import type { ApiResult, NewPost, Post } from "./types";

/**
 * Small typed client over Playwright's `request` fixture.
 * Methods return the status and parsed body; assertions belong in specs.
 */
export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string = env.apiUrl,
  ) {}

  getPost(id: number): Promise<ApiResult<Post>> {
    return this.send<Post>(this.request.get(`${this.baseUrl}/posts/${id}`));
  }

  createPost(post: NewPost): Promise<ApiResult<Post>> {
    return this.send<Post>(this.request.post(`${this.baseUrl}/posts`, { data: post }));
  }

  private async send<T>(responsePromise: Promise<APIResponse>): Promise<ApiResult<T>> {
    const response = await responsePromise;
    return { status: response.status(), body: (await response.json()) as T };
  }
}
