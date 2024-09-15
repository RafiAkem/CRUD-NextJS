import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

const dataFilePath = path.join(process.cwd(), "app/data/posts.json");
const uploadDir = path.join(process.cwd(), "public/uploads");

function getPosts() {
  const jsonData = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(jsonData);
}

function savePosts(posts: any[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
}

export async function GET() {
  const posts = getPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as File;

  if (!image) {
    return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  const filename = Date.now() + "-" + image.name.replace(/\s/g, "-");
  const imagePath = path.join(uploadDir, filename);

  await writeFile(imagePath, buffer);

  const newPost = {
    id: Date.now().toString(),
    title,
    content,
    imageUrl: `/uploads/${filename}`,
  };

  const posts = getPosts();
  posts.push(newPost);
  savePosts(posts);

  return NextResponse.json(newPost, { status: 201 });
}

export async function PUT(request: Request) {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as File | null;

  const posts = getPosts();
  const index = posts.findIndex((post: any) => post.id === id);

  if (index !== -1) {
    let imageUrl = posts[index].imageUrl;

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = Date.now() + "-" + image.name.replace(/\s/g, "-");
      const imagePath = path.join(uploadDir, filename);

      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const updatedPost = { ...posts[index], title, content, imageUrl };
    posts[index] = updatedPost;
    savePosts(posts);
    return NextResponse.json(updatedPost);
  }

  return NextResponse.json({ error: "Post not found" }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  let posts = getPosts();
  posts = posts.filter((post: any) => post.id !== id);
  savePosts(posts);
  return NextResponse.json({ message: "Post deleted" });
}
