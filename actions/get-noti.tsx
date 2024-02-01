import { objectNoti } from "@/lib/constant";
import { db } from "@/lib/db";

export const getNotification = async (userId: string) => {
  try {
    const notiList = await db.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      }
    });
    const mappedNotification = notiList.map((noti) => ({
      ...noti,
      inObj: noti.inObj as objectNoti,
      directObj: noti.directObj as objectNoti,
      prepObj: noti.prepObj as objectNoti,
      subjects: noti.subjects as objectNoti[]
    }));
    const fullDataNoti = await Promise.all(mappedNotification.map(async (noti) => {
      // @ts-ignore
      var prepObjData = await db[noti.prepObj.type].findUnique({
        where: {
          id: noti.prepObj.id,
        }
      });
      // @ts-ignore
      var inObjData = await db[noti.inObj.type].findUnique({
        where: {
          id: noti.inObj.id,
        }
      });
      // @ts-ignore
      var directObjData = await db[noti.directObj.type].findUnique({
        where: {
          id: noti.directObj.id,
        }
      });
      
      if (noti.prepObj.type == 'course') {
        prepObjData = {
          id: prepObjData.id,
          name: prepObjData.title,
          image: prepObjData.image,
          type: 'course'
        };
      };

      return { ...noti,
        inObj: inObjData as objectNoti,
        directObj: directObjData as objectNoti,
        prepObj: prepObjData as objectNoti
      };
    }));

    return fullDataNoti;
  } catch (error) {
    console.log("NOTIFICATION", error);
    return;
  }
};
