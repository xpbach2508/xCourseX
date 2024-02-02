import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try{
        const session = await getSession();
        const userId = session?.user.uid;
    
        if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
        }

        const enrollResult = await db.enroll.create({
            data: {
                userId: userId,
                courseId: params.courseId
            }
          });
        const teacher = await db.course.findFirst({
            where: {
                id: params.courseId
            },
            select: {
                userId: true
            }
        })
        return NextResponse.json({enrollResult, teacher});

    } catch (error) {
        console.log("COURSE_ENROLL", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}