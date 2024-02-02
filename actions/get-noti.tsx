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
      var prepObjData;
      if (noti.prepObj.type === "nothing") {
        prepObjData = noti.prepObj;
      } else {
        // @ts-ignore
        prepObjData = await db[noti.prepObj.type].findUnique({
          where: {
            id: noti.prepObj.id,
          },
        });
      }
      if (noti.prepObj.type == 'course') {
        prepObjData = {
          id: prepObjData.id,
          name: prepObjData.title,
          image: prepObjData.image,
          type: 'course'
        };
      };

      // @ts-ignore
      var inObjData = await db[noti.inObj.type].findUnique({
        where: {
          id: noti.inObj.id,
        }
      });

      var directObjData;
      if (noti.directObj.type === 'nothing') {
        directObjData = noti.directObj;
      } else {
        // @ts-ignore
        directObjData = await db[noti.directObj.type].findUnique({
          where: {
            id: noti.directObj.id,
          }
        });
        if (noti.directObj.type == 'course') {
          directObjData = {
            id: directObjData.id,
            name: directObjData.title,
            image: directObjData.image,
            type: 'course'
          };
        };
      }
      

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
