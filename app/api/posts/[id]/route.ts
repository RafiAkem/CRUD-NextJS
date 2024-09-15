import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "app/data/posts.json");

function getPosts() {
  const jsonData = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(jsonData);
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const posts = getPosts();
  const post = posts.find((p: any) => p.id === params.id);

  if (post) {
    return NextResponse.json(post);
  } else {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
