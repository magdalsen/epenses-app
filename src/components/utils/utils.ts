import moment from "moment";
import { ExpensesData } from "../constans/types";
import { monthsListed } from "../constans/constans";

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

export const calculateDateForEachMonth = (idFormat: string | undefined) => {
    const todayDate = new Date();
    const separateDate = idFormat?.split(" ");
    separateDate[0] = monthsListed.indexOf(separateDate[0]);
    todayDate.setMonth(separateDate[0]);
    todayDate.setFullYear(Number(separateDate[1]));
    return todayDate.toISOString();
}

export const createPureMonthAndYearDataFormat = (exp: ExpensesData) => {
    const sliced = (exp.created_at).split(" ");
    return sliced[0] + " " + sliced[2];
}

export const productArrayLength = (expenses: ExpensesData[], idFormat: string) => {
    return expenses.filter((exp:ExpensesData)=>{
        return (createPureMonthAndYearDataFormat(exp)).includes(idFormat);
    }).map((_expens:ExpensesData,i)=>{
        return i+2
    })
}
