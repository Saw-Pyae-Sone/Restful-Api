"use client"
import {useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(name, password)

    try{
      const response = await fetch('api/login', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({name, password})
      })
      
      const data = await response.json()

      if(!response.ok){
        setMessage(data.error || "Login Failed")
        return
      }

      localStorage.setItem('token', data.token)
      setMessage("Login Successful!")
      router.push('/add')
    }catch(error){
      console.error('Login error', error)
      setMessage("Something went wrong!")
    }
  }

  return (
    <>  
      <div>
        <h2>Login Form</h2>
        <form onSubmit={handleLogin}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
          <br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}
