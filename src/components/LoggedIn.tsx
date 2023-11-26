import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { supabase } from "../supabaseClient";
import { Button, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import moment from "moment";
import style from "./LoggedIn.module.css";
import { Link } from "react-router-dom";

interface IncomeData {
    id: string;
    monthIncome: number;
    monthName: string;
    year: number;
}

interface ExpensesData {
    [x: string]: any;
    created_at: string;
    id: string;
    productCategory: string;
    productId: string;
    productPrice: number;
}

export const LoggedIn = () => {
    const { logOut, userId }=useUserContext();
    const [income, setIncome] = useState([]);
    const [years, setYears] = useState<number[]>([]);
    const [expenses, setExpenses] = useState([]);

    const formatDate = (data:ExpensesData) => {
        const dateArr: number[] = [];
        data.map((el: { created_at: string; })=>{
            const date = moment(el.created_at).utc().format('YYYY-MM-DD');
            const newDate = new Date(date);
            dateArr.push(newDate.getFullYear());
        })
        const removeDuplicateDates = [...new Set(dateArr)];
        setYears(removeDuplicateDates);
    }

    const expensesGetYear = (data:any) => {
        data.forEach((el: { created_at: moment.MomentInput; }) => {
            el.created_at = moment(el.created_at).month(moment(el.created_at).month()).format("MMMM Do YYYY");
            
        });
        setExpenses(data);
    }

    const fetchDataByRow = async () => {
        const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', userId)
        if (error) throw error;
        if (data) {
            formatDate(data);
            expensesGetYear(data);
        }
    }

    const fetchUserData = async () => {
        const { data, error } = await supabase
        .from('income')
        .select('*')
        .eq('id', userId)
        if (error) throw error;
        if (data) {
            setIncome(data);
        }
    }

    useEffect(()=>{
        fetchUserData();
        fetchDataByRow();
    },[]);

    return (
        <>
            <Button colorScheme='blue' variant='solid' type="submit" onClick={()=>alert('Nothing yet:)')}>Add month</Button>
            <Button colorScheme='blue' variant='outline' type="submit" onClick={()=>logOut()}>Logout</Button>
            <div>You are logged in.</div>

            <Tabs variant='enclosed'>
                <TabList>
                    {years.map((year)=>(
                        <Tab>{year}</Tab>
                    ))}
                </TabList>
                <TabPanels>
                {years.map((year)=>(
                    <div>
                    <div className={style.expenseBox_1}>
                        {income.map((incomeYear:IncomeData)=>(
                            <TabPanel>
                                {incomeYear.year === year ?
                                <div className={style.expenseBox}>
                                    <div>{incomeYear.monthName}</div>
                                    <div>Income: {incomeYear.monthIncome} zł</div>
                                    <div>
                                         Expenses: {expenses.map((exp:ExpensesData)=>(
                                                     <>
                                                        {(exp.created_at).includes(year.toString()) && (exp.created_at).includes(incomeYear.monthName) ? <div>
                                                            <div>{exp.productPrice} zł</div>
                                                            <Link to={`/expenseDetails/${incomeYear.monthName}-${year.toString()}`}>
                                                                <Button colorScheme="blue" variant="solid" type="button">Details</Button>
                                                            </Link>
                                                            </div> : ''}
                                                     </>
                                                   ))}    
                                    </div>
                                </div> : ''}

                            </TabPanel>
                        ))}
                    </div>
                    </div>
                ))}
                </TabPanels>
            </Tabs>
        </>
    )
}