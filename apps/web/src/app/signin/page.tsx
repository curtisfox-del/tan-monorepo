'use client';

import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/mobile/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    alert(res.ok ? `Token (first 12): ${data.token.slice(0,12)}...` : data.error);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Sign in</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Sign in (mobile token)</button>
      </form>
    </main>
  );
}