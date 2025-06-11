import { createConnection } from "../../../../lib/db.js"
import { NextResponse } from "next/server"

export async function GET(request) {
    const {searchParams} = new URL(request.url)
    const id = searchParams.get('id')

    try{
        const db = await createConnection()

        if(id){
            const sqlId = "SELECT * FROM posts WHERE ID = ?"
            const [rows] = await db.query(sqlId, id)
             if (rows.length === 0) {
                return NextResponse.json({ error: "Post not found" }, { status: 404 });
            }
            return NextResponse.json({ post: rows[0] }); 
        }else{
            const sql = "SELECT * FROM posts"
            const [posts] = await db.query(sql)
            return NextResponse.json({posts: posts})
        }
    }catch(error){
        console.log(error)
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function POST(request) {
    try{
        const formData = await request.json()

        const db = await createConnection()

        const [result] = await db.query('INSERT INTO posts (Note) VALUES (?)', [formData.note]);

        return NextResponse.json({ result });

    }catch(error){
        console.log(error)
        return NextResponse.json({error: error.message}, {status: 500})
    }
    
}

export async function PUT(request){
    const {searchParams} = new URL(request.url)
    const id = searchParams.get("id")
    const note = await request.json()

    try{
        const db = await createConnection()

        const sql = "UPDATE posts SET Note = ? WHERE ID = ?"

        const [result] = await db.query(sql, [note.note, id])

        return NextResponse.json({ result , Message: "Updated Successfully"})

    }catch(error){
        console.log(error)
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function DELETE(request){

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if(!id){
        return NextResponse.json({error: "Missing ID"})
    }

    try{
        const db = await createConnection()
        const sql = "DELETE FROM posts WHERE ID = ?"
        const [result] = await db.query(sql, [id])

        return NextResponse.json({result})

    }catch(error){
        console.log(error)
        return NextResponse.json({error: error.message}, {status: 500})
    }
}