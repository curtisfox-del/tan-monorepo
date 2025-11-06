import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, View, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ApiClient } from '@tan/api';
import { styled } from 'nativewind';

const queryClient = new QueryClient();
const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:3000";

const SText = styled(Text);
const SView = styled(View);
const SInput = styled(TextInput);

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const api = new ApiClient(API_BASE, async () => token);

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");

  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleLogin() {
    const { token: t } = await api.login({ email, password });
    await SecureStore.setItemAsync("authToken", t);
    setToken(t);
  }

  async function loadPosts() {
    const p = await api.getPosts();
    setPosts(p);
  }

  async function createPost() {
    await api.createPost({ title, content });
    setTitle("");
    setContent("");
    await loadPosts();
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        {!token ? (
          <SView className="gap-2">
            <SText className="text-xl font-bold">Sign in</SText>
            <SInput className="border p-3 rounded" value={email} onChangeText={setEmail} placeholder="Email" />
            <SInput className="border p-3 rounded" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
          </SView>
        ) : (
          <SView className="gap-3">
            <SText className="text-lg">Authenticated ✅</SText>
            <Button title="Load Posts" onPress={loadPosts} />
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <SText className="py-1">{item.title}</SText>}
            />
            <SInput className="border p-3 rounded" value={title} onChangeText={setTitle} placeholder="New post title" />
            <SInput className="border p-3 rounded" value={content} onChangeText={setContent} placeholder="Content" />
            <Button title="Create Post" onPress={createPost} />
          </SView>
        )}
      </SafeAreaView>
    </QueryClientProvider>
  );
}