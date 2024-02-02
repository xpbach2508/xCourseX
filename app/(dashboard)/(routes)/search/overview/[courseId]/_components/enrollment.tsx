"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { NotificationDataProps } from "@/lib/constant";
import { useSocket } from "@/components/providers/socket/socket-context";
import { emitSocketEventClient } from "@/lib/socket/client/emitSocketEventClient";
import { useSession } from "next-auth/react";
import handleNotification from "@/lib/notification-template/handleNotification";

interface EnrollmentProps {
    courseId: string;
    isEnrolled: boolean;
}

export const Enrollment = ({
    courseId,
    isEnrolled,
}: EnrollmentProps) => {

    const [isRequestEnrolled, setIsEnrolled] = useState(isEnrolled);
    const { socket: SocketClient, isConnected } = useSocket();
    const {data: session} = useSession();
    const onClick = async () => {
        try {
            const response = await axios.post(`/api/courses/${courseId}/enroll`);
            setIsEnrolled(true);
            var newNoti : NotificationDataProps = {
                type: 'newEnroll',
                subjectCount: 1,
                subjects: [{ id: session?.user.uid ?? '', type: 'user', name: session?.user.name ?? '', image: session?.user.image ?? '' }],
                directObj: { id: courseId, type: 'course', name: null, image: null },
                inObj: { id: response.data.teacher.userId ?? '', type: 'user', name: null, image: null },
                prepObj: { id: '', type: "nothing", name: null, image: null },
              }
            
            handleNotification(
            SocketClient,
            "enroll:course",
            `${session?.user.name} request to access your course.`,
            response.data.teacher.userId,
            newNoti
            );
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="border rounded-md p-6 text-secondary bg-sky-900">
            <div className="mb-7">
                <h4 className="font-semibold text-lg mb-4">Join learning now</h4>
                <p className="text-sm text-neutral-200"> 
                {isRequestEnrolled ? "Enroll request has been sent. Wait for being approved." : "Press the button below to send an enroll request."}
                
                </p>
            </div>

            <Button
                className="text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md w-full"
                onClick={onClick}
                disabled={isRequestEnrolled}
            >
                {isRequestEnrolled ? "Waiting for approval" : "Enroll"}
            </Button>
        </div>
    )
}