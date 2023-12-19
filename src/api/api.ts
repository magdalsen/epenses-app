import { AddExpenseData, AddMonthData, LoginData, SignupData } from "../components/constans/types";
import { calculateDateForEachMonth } from "../components/utils/utils";
import { supabase } from "../supabaseClient";

export const addUser = async (values:SignupData) => {
    const { name, email, password } = values;
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })
    if (error) throw error;
    if (data && data.user) {
        const { data:userData, error } = await supabase
        .from('users')
        .insert([
          { id: data.user?.id, name, email }
        ])
        if (error != null) {
            alert('User already exist.');
            throw error;
        };
        if (userData === null) alert('Success! Account created!');
    }
}

export const loginUser = async (values:LoginData) => {
    const { email, password } = values;
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) alert(`Login error: ${error}`);
    if (data.user && data) {
        alert(`Hello ${email}!`);
        return data
    }
}

export const fetchDataByRow = async (userId: string) => {
    const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', userId)
    if (error) throw error;
    if (data) {
        return data
    }
}

export const fetchUserData = async (userId:string) => {
    const { data, error } = await supabase
    .from('income')
    .select('*')
    .eq('id', userId)
    if (error) throw error;
    if (data) {
        return data
    }
}

export const addMonth = async (values:AddMonthData, userId: string) => {
    const dbData: (string | string[])[] = [];
    const valuesData = (values.month).concat((values.year).toString());
    const { data, error } = await supabase
    .from('income')
    .select('incomeId, monthName, year')
    if (error) throw error;
    data.map(async (el: { monthName: string; year: number; })=>{
        dbData.push((el.monthName).concat(el.year.toString()));
    })
    const check = dbData.includes(valuesData);
    if (check) {
        alert('Month already exist!');
        return
    } else {
        const { data2, error2 } = await supabase
            .from('income')
            .insert([
              { id: userId, incomeId: data.length+1, monthIncome: values.income, monthName: values.month, year: values.year }
            ])
            if (error2) throw error2;
            alert('Month added!');
            return data2;
    }
}

export const addExpense = async (values:AddExpenseData, userId: string, idFormat: string | undefined, productLabel: string) => {
    const { data, error } = await supabase
    .from('expenses')
    .insert({ id: userId, productCategory: values.expense, productPrice: values.price, created_at: calculateDateForEachMonth(idFormat), productLabel: productLabel })
    .select()
    if (error) throw error;
    if (data) {
        alert('Expense added!');
    }
}

export const updateExpense = async (values: AddExpenseData, editExpense: string, id: string | undefined) => {
    const { data, error } = await supabase
    .from('expenses')
    .update({ productCategory: values.expense, productPrice: values.price })
    .eq('productLabel', id)
    .select()
    if (error) throw error;
    console.log(data);
    return data;
}

export const handleDelete = async (productLabel: string) => {     
    const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('productLabel', productLabel)
    if (error) {
        throw error;
    } else {
        alert('Expense removed!');
    }
}