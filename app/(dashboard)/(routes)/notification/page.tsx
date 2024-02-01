import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { getNotification } from "@/actions/get-noti";
import { NotiProps } from "@/lib/constant";
import { notiTemplate } from "@/lib/notification-template/mustache";


export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }
  const userId = session.user.uid;
  const notiResponse = await getNotification(userId);
  return (
    <div className="p-6 space-y-4">
        {notiResponse?.slice().reverse().map((notiItem: NotiProps) => (
        <div key={notiItem.id} className="mb-4">
          <span>
          {notiTemplate(notiItem)}
          </span>
        </div>
    ))}
    </div>
  )
}
