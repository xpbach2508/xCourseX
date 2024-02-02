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
      var prepObjData = await handleObj(noti.prepObj);

      // @ts-ignore
      var inObjData = await db[noti.inObj.type].findUnique({
        where: {
          id: noti.inObj.id,
        }
      });

      var directObjData = await handleObj(noti.directObj);

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

async function handleObj(inputObj: objectNoti) {
  var inputObjData;
  if (inputObj.type === "nothing") {
    inputObjData = inputObj;
  } else {
    // @ts-ignore
    inputObjData = await db[inputObj.type].findUnique({
      where: {
        id: inputObj.id,
      },
    });
    if (inputObj.type === "course") {
      inputObjData = {
        id: inputObjData.id,
        name: inputObjData.title,
        image: inputObjData.image,
        type: "course",
      };
    }
    if (inputObjData == null) {
      inputObjData = {
        id: inputObj.id,
        name: "",
        image: "",
        type: inputObj.type,
      };
    }
  }
  return inputObjData;
}