export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type NewPost = Omit<Post, "id">;

/** Response wrapper: keeps the HTTP status next to the parsed body so specs can assert both. */
export interface ApiResult<T> {
  status: number;
  body: T;
}
