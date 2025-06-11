"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/posts?id=${id}`);
        const data = await response.json();
        
        const post = data.post || data.posts;
        if (post && post.Note) {
          setNote(post.Note);
        } else {
          setMessage("Note not found.");
        }
      } catch (error) {
        console.error("Error loading note:", error);
        setMessage("Failed to load note.");
      }
    };

    fetchNote();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch(`/api/posts?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      setMessage("Note updated successfully!");
      setTimeout(() => router.push("/add"), 1000);
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Failed to update note.");
    }
  };

  return (
    <div>
      <h2>Update Note</h2>
      <p>Current Note: {note}</p>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />
        <button type="submit">Update</button>
        <button type="button" onClick={() => router.back()}>
          Cancel
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
