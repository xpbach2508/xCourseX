import { NotiProps } from "../constant";
// @ts-ignore
import Handlebars from 'handlebars/dist/cjs/handlebars';


const StringTemplate: { [key: string]: string } = {
    likeComment: "{{subject}} liked your comment in {{prepObj}}'s forum",
    replyComment: "{{subject}} replied your comment in {{prepObj}}'s forum",
    commentForum: "{{subject}} commented to {{directObj}}'s forum",
    acceptEnroll: "{{subject}} accepted your enrollment to the {{inObj}} course.",
    newEnroll: "{{subject}} has request to enroll to {{directObj}} course",
}

export const notiTemplate = (noti: NotiProps) => {
    const notiString = Handlebars.compile(StringTemplate[noti.type]);
    const subjectName = noti.subjects.map((sub) => sub.name).join(', ');
    return notiString({subject: subjectName, directObj: noti.directObj.name, inObj: noti.inObj.name, prepObj: noti.prepObj.name});
}