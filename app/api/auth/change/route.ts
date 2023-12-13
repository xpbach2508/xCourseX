import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const userData = body.formData;
        console.log(userData);
        if (!userData?.email || !userData?.current || !userData?.now) {
            return NextResponse.json({ message: "All field are required." }, { status: 400 });
        }

        const existUser = await db.user.findUnique({
            where:{ 
                email: userData.email,
            },
        })
        
        if(!existUser) {
            return NextResponse.json({message: "User not exist"}, {status: 409});
        }
        if (existUser.password != null) {
            const match = await bcrypt.compare(userData?.current!, existUser.password);
            
            return NextResponse.json({message: "Password changed."}, {status: 201});
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}