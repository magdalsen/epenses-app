import { AddExpenseData, AddMonthData, LoginData, SignupData } from "../components/constans/types";

export const addUser = async (values:SignupData, toggleAlertSuccess: { (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (arg0: string): void; }) => {
    try {
        const response = await fetch('http://localhost:8000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values }),
        });

        if (!response.ok) {
            toggleAlertError('Not created!');
            return
        }

        const data = await response.json();
        await addUserToTable(values, data, toggleAlertError, toggleAlertSuccess);

      } catch (error) {
        console.error('Error fetching data:', error);
        toggleAlertError(`Some error occured: ${error}. Please contact with administrator.`);
      }
}

export const addUserToTable = async (values: any, data: any, toggleAlertError: { (alert: string): void; (arg0: string): void; (arg0: string): void; }, toggleAlertSuccess: ((arg0: string) => void)) => {
    try {
                const response = await fetch('http://localhost:8000/addUser', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ values, data }),
                });

                if (response.status === 500) {
                    toggleAlertError('User already exist.');
                    return
                }

                const data2 = await response.json();
                if (data2 === null) toggleAlertSuccess('Success! Account created! Confirm your email address.');
                return data2
              } catch (error) {
                console.error('Error fetching data:', error);
                toggleAlertError(`Some error occured: ${error}. Please contact with administrator.`);
              }
}

export const loginUser = async (values:LoginData, toggleAlertSuccess: { (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (arg0: string): void; }) => {
    try {
        const { email } = values;
        const response = await fetch('http://localhost:8000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values }),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        if (data.user && data) {
            toggleAlertSuccess(`Hello ${email}!`);
            return data
        }
        // toggleAlertSuccess(`Hello ${email}!`);
        // return data
      } catch (error) {
        console.error('Error fetching data:', error);
        toggleAlertError(`Some error occured: ${error}. Please contact with administrator.`);
      }
}

export const fetchDataByRow = async (userId: string, toggleAlertError: { (alert: string): void; (alert: string): void; (alert: string): void; (alert: string): void; }) => {
    try {
      const response = await fetch(`http://localhost:8000/expenses/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return response.json(); // data from server

    } catch (error) {
      console.error('Error fetching data:', error);
      toggleAlertError('Error occured. Please contact with administrator.');
    }
}

export const fetchUserData = async (userId: string, toggleAlertError: ((arg0: string) => void)) => {
    try {
      const response = await fetch(`http://localhost:8000/income/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data
    } catch (error) {
      console.error('Error fetching data:', error);
      toggleAlertError('Error occured. Please contact with administrator.');
    }
}

export const addMonth = async (values:AddMonthData, userId: string, toggleAlertSuccess: { (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (arg0: string): void; }) => {
    const dbData: (string | string[])[] = [];
    const valuesData = values.month.concat((values.year).toString());
    try {
        const response = await fetch('http://localhost:8000/getMonths');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        data.map(async (el: { monthName: string; year: number; })=>{
            dbData.push((el.monthName).concat(el.year.toString()));
        })
        const check = dbData.includes(valuesData);
        if (check) {
            toggleAlertError('Month already exist!');
            return
        } else {
            try {
                const response2 = await fetch('http://localhost:8000/addMonth', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ userId, data, values }),
                });
            
                if (!response2.ok) {
                  throw new Error('Network response was not ok');
                }
            
                const data2 = await response2.json();
                toggleAlertSuccess('Month added!');
                return data2
              } catch (error) {
                console.error('Error fetching data:', error);
                toggleAlertError(`Some error occured: ${error}. Please contact with administrator.`);
              }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toggleAlertError('Error occured. Please contact with administrator.');
      }
}

export const addExpense = async (values:AddExpenseData, userId: string, idFormat: string, productLabel: string, toggleAlertSuccess: { (alert: string): void; (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (alert: string): void; (arg0: string): any; }) => {
    try {
      const response = await fetch('http://localhost:8000/addExpense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values, userId, idFormat, productLabel }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      toggleAlertSuccess('Expense added!');
      return data
    } catch (error) {
      console.error('Error fetching data:', error);
      toggleAlertError(`Some error occured: ${error}. Please contact with administrator.`);
    }
}

export const updateExpense = async (values: AddExpenseData, id: string | undefined, toggleAlertSuccess: { (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (arg0: string): any; }) => {
    try {
      const response = await fetch('http://localhost:8000/updateExpense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values, id }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      toggleAlertSuccess('Data updated!');
      return data
    } catch (error) {
      console.error('Error fetching data:', error);
      toggleAlertError(`Some error occured: ${error}. Please contact with administrator.`);
    }
}

export const handleDelete = async (productLabel: string, toggleAlertSuccess: { (alert: string): void; (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (alert: string): void; (arg0: string): any; }) => {
    try {
        const response = await fetch(`http://localhost:8000/deleteExpense/${productLabel}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        toggleAlertSuccess('Data deleted!');
        return response.json(); // data from server
  
      } catch (error) {
        console.error('Error fetching data:', error);
        toggleAlertError('Error occured. Please contact with administrator.');
      }
}
