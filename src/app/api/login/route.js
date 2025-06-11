import { NextResponse } from "next/server";
import { createConnection } from "../../../../lib/db.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_TOKEN

export async function POST(request) {
    const{name, password} = await request.json();

    try{
        const db = await createConnection()

        const sql = "SELECT * FROM User WHERE Name = ? AND Password = ?"

        const [rows] = await db.query(sql, [name, password])

        if(rows.length === 0){
            return NextResponse.json({error: "User Not Found"})
        }
        
        const user = rows[0]

        const passwordMatch = await bcrypt.compare(password, user.Password)

        if(!passwordMatch){
            return NextResponse.json({error: "Invalid Password"})
        }

        const token = jwt.sign({ id: user.ID, name: user.Name }, SECRET, { expiresIn: '1h' });

        return NextResponse.json({message: "Login Success"}, token);

    }catch(error){
        console.error("Login Error", error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}