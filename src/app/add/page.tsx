"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [posts, setposts] = useState([])
  const [note, setNote] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const response = await fetch("api/posts");
      const data = await response.json();
      setposts(data.posts);
    } catch (error) {
      console.log("Error Fetching", error);
    }
  };


  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault();

    try{
      const response = await fetch('api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({note})
      })
      
      const result = await response.json()
      console.log("Response from API", result)
      setMessage("Note Created Successfully!")
      fetchPosts()
    }catch(error){
      console.log("Adding Error", error);
      setMessage("Error Creating Note")
    }
  }

  const handleDelete = async (ID: number) => {
    try{
        await fetch(`api/posts?id=${ID}`, {
        method: 'DELETE',
      })
    setMessage("Note Deleted Successfully!")

    const response = await fetch("api/posts");
    const data = await response.json();
    setposts(data.posts);

    }catch(error){
      console.log("Error Deleteing Note", error)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])
  return (
    <>  
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add Note</h2>
        <div>
          <label htmlFor="Note">Note</label>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} required/>
        </div>
        <button type="submit">Submit</button>
        {message && <p>{message}</p>}
      </form>
    </div>
    <div>
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map(({ ID, Note }, index) => 
          <div key={ID}>
            <p>{index + 1}. {Note}</p>
            <button onClick={() => router.push(`/update?id=${ID}`)}>Update</button>
            <button onClick={() => handleDelete(ID)}>Delete</button>
          </div> )
      ) : (
        <p> No posts found </p>
      )}
    </div>
    </>
  );
}
