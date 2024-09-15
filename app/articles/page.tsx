"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../page.module.css";
import Navbar from "../components/Navbar";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

export default function Articles() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("/api/posts");
    const data = await response.json();
    setPosts(data);
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1>Artikel</h1>
        <div className={styles.cardContainer}>
          {posts.map((post) => (
            <Link
              href={`/articles/${post.id}`}
              key={post.id}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className={styles.cardImage}
                />
                <div className={styles.cardContent}>
                  <h2>{post.title}</h2>
                  <p>{post.content.substring(0, 100)}...</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
