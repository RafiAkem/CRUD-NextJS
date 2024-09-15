"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import styles from "../../page.module.css";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const response = await fetch(`/api/posts/${id}`);
    if (response.ok) {
      const data = await response.json();
      setPost(data);
    } else {
      // Redirect to 404 page or show error message
      router.push("/404");
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1>{post.title}</h1>
        <img
          src={post.imageUrl}
          alt={post.title}
          className={styles.articleImage}
        />
        <p>{post.content}</p>
      </main>
    </>
  );
}
