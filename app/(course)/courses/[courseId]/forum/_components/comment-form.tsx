"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useForum } from "./_contexts/forum-context";
import toast from "react-hot-toast";
import { NotificationDataProps } from "@/lib/constant";
import { useSocket } from "@/components/providers/socket/socket-context";
import handleNotification from "@/lib/notification-template/handleNotification";
interface FormData {
  comment: string;
  userId: string | undefined;
  parentId: string | null;
}
interface ParentIdProps {
  parentId: string | null;
  parentUserId: string | null;
}
const CommentForm = ({ parentId, parentUserId }: ParentIdProps) => {
  const router = useRouter();
  const forumContext = useForum();
  const { socket: SocketClient, isConnected } = useSocket();
  const [formData, setFormData] = useState<FormData>({
    comment: "",
    userId: forumContext.userId,
    parentId: parentId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/courses/${forumContext.courseId}/comment`, {
      method: "POST",
      body: JSON.stringify({ formData }),
      headers,
    });
    const response = await res.json();
    if (!res.ok) {
      toast.error(response.message);
    } else {
      const isReplying = parentId ? true : false;
      const isTeacher = response.teacher.userId === forumContext.userId;
      var newNoti : NotificationDataProps = {
        type: isReplying ? 'replyComment' : 'commentForum',
        subjectCount: 1,
        subjects: [{ id: forumContext.userId ?? '', type: 'user', name: forumContext.userName ?? '', image: forumContext.userImage ?? '' }],
        directObj: { id: isReplying ? '' : forumContext.courseId, type: isReplying ? 'nothing' : 'course', name: null, image: null },
        inObj: { id: isReplying ? parentUserId : response.teacher.userId, type: 'user', name: null, image: null },
        prepObj: { id: isReplying ? forumContext.courseId : '', type: isReplying ? "course" : 'nothing', name: null, image: null },
      }
    
      if (!isTeacher) 
      handleNotification(
        SocketClient,
        "comment:forum",
        isReplying ? `${forumContext.userName } replied to your comment.` : `${forumContext.userName } commented to your course.`,
        isReplying ? parentUserId : response.teacher.userId,
        newNoti
      );
      toast.success("Commented");
      setFormData({
        comment: "",
        userId: forumContext.userId,
        parentId: parentId,
      });
      router.refresh();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} method="POST" className="w-2/3">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Comment
          </label>
          <div className="flex">
            <Input
              type="text"
              id="comment"
              name="comment"
              className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 mr-2"
              required
              placeholder=""
              onChange={handleChange}
              value={formData.comment}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
export default CommentForm;
