import moment from "moment";
import { ExpensesData } from "../constans/types";

export const formatDate = (data:ExpensesData[]) => {
    const dateArr: number[] = [];
    data.map((el: { created_at: string; })=>{
        const date = moment(el.created_at).utc().format('YYYY-MM-DD');
        const newDate = new Date(date);
        dateArr.push(newDate.getFullYear());
    })
    const removeDuplicateDates = [...new Set(dateArr)];
    return removeDuplicateDates
}

export const expensesGetYear = (data:any) => {
    data.forEach((el: { created_at: moment.MomentInput; }) => {
        el.created_at = moment(el.created_at).month(moment(el.created_at).month()).format("MMMM Do YYYY");
        
    });
    return data
}

export const todayDate = new Date().getFullYear();