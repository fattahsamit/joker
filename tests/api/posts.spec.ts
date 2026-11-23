import { buildNewPost, existingPost } from "../../src/data/posts";
import { expect, test } from "../../src/fixtures";

test.describe("Posts API", () => {
  test(
    "should return post 1 and accept a new post when the posts API is called",
    { tag: "@regression" },
    async ({ api }) => {
      await test.step("fetch an existing post", async () => {
        const { status, body } = await api.getPost(existingPost.id);

        expect(status).toBe(200);
        expect(body).toMatchObject({ id: existingPost.id, userId: existingPost.userId });
      });

      await test.step("create a new post", async () => {
        const newPost = buildNewPost();
        const { status, body } = await api.createPost(newPost);

        expect(status).toBe(201);
        expect(body).toMatchObject({ ...newPost, id: expect.any(Number) });
      });
    },
  );
});
