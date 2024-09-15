"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import Navbar from "./components/Navbar";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("/api/posts");
    const data = await response.json();
    setPosts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    if (editingPost) {
      formData.append("id", editingPost.id);
    }

    const method = editingPost ? "PUT" : "POST";
    const response = await fetch("/api/posts", {
      method,
      body: formData,
    });

    if (response.ok) {
      setTitle("");
      setContent("");
      setEditingPost(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPosts();
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      fetchPosts();
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1>Blog Posts</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            required={!editingPost}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            required
          ></textarea>
          <button type="submit">{editingPost ? "Update" : "Add"} Post</button>
        </form>
        <div className={styles.cardContainer}>
          {posts.map((post) => (
            <div key={post.id} className={styles.card}>
              <img
                src={post.imageUrl}
                alt={post.title}
                className={styles.cardImage}
              />
              <div className={styles.cardContent}>
                <h2>{post.title}</h2>
                <p>{post.content.substring(0, 100)}...</p>
                <div className={styles.cardActions}>
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
