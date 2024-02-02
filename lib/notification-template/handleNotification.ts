import { NotificationDataProps } from "../constant";
import { emitSocketEventClient } from "../socket/client/emitSocketEventClient";
import type { Socket } from "socket.io-client";

export default async function pushNoti(
    SocketClient: Socket | null,
    eventName: string,
    eventMessage: string,
    receiveId: string,
    newNoti: NotificationDataProps,

) {
  emitSocketEventClient(SocketClient, eventName, {
    message: eventMessage,
    userId: receiveId,
  });

  const pushNoti = await fetch(`/api/users/notification`, {
    method: "POST",
    body: JSON.stringify(newNoti),
  });
}
