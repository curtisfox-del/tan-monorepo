import type { LoginRequest, Post } from "@tan/types";

export class ApiClient {
  constructor(private baseUrl: string, private getToken?: () => Promise<string | null>) {}

  private async headers() {
    const token = this.getToken ? await this.getToken() : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  async login(input: LoginRequest): Promise<{ token: string; user: { id: string; email: string; role: string } }> {
    const res = await fetch(`${this.baseUrl}/api/mobile/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error((await res.json()).error || "Login failed");
    return res.json();
  }

  async getPosts(): Promise<Post[]> {
    const res = await fetch(`${this.baseUrl}/api/mobile/posts`, { headers: await this.headers() });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  }

  async createPost(input: { title: string; content: string }): Promise<Post> {
    const res = await fetch(`${this.baseUrl}/api/mobile/posts`, {
      method: "POST",
      headers: await this.headers(),
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to create post");
    return res.json();
  }
}