import Head from "next/head";

import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import type { Post } from "@prisma/client";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });
  // const data = api.post.getLatest.useQuery();
  // const [latest, setLatest] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  // At the top level of your function component
  const { data } = api.post.getAll.useQuery();

  useEffect(() => {
    if (data) {
      console.log("data: ", data);
      setPosts(data);
    }
  }, [data]); // Only re-run the effect if 'data' changes

  const { mutate } = api.post.create.useMutation();

  // Event handler for button click
  const handleCreateUser = () => {
    // Call the mutate function with the necessary arguments
    mutate(
      {
        name: "newUser",
      },
      {
        onSuccess: (data) => {
          // Handle success - perhaps update state or show a message
          console.log("User created:", data);
          setPosts((currentPosts) => [...currentPosts, data]);
        },
        onError: (error) => {
          // Handle error - perhaps show an error message
          console.error("Error creating user:", error);
        },
      },
    );
  };

  return (
    <>
      <Head>
        <title>2FA site</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800">
        <p className="text-white">Hello 2fa</p>
        <p className="text-white">{hello.data?.greeting}</p>
        <div
          className="m-2 rounded bg-slate-600 p-2 hover:bg-slate-400"
          onClick={() => {
            handleCreateUser();
          }}
        >
          create post
        </div>
        {posts.map((p) => (
          <div>{p.name}</div>
        ))}
      </main>
    </>
  );
}
