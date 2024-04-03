require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const supabaseUrl = process.env.URL;
const supabaseKey = process.env.KEY;

const { createClient } = require('@supabase/supabase-js');

// Inicjacja Supabase klienta
const supabase = createClient(
    supabaseUrl,
    supabaseKey
);

app.use(express.json());

app.use(cors({ origin: '*' }))

// app.use(cors({
//   origin: 'https://expenses-app-client-bay.vercel.app', // Adres URL frontendu
//   credentials: true,
// }));

// Żądania, które komunikują się z bazą Supabase
app.get('/expenses/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { data, error } = await supabase.from('expenses').select('*').eq('id', userId);
    if (error) throw error;
    res.json(data);    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/income/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { data, error } = await supabase.from('income').select('*').eq('id', userId);
    if (error) throw error;
    res.json(data);    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getMonths', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { data, error } = await supabase.from('income')
    .select('incomeId, monthName, year, id')
    if (error) throw error;
    res.json(data);    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addExpense', async (req, res) => {
  try {
    const expense = req.body.values.expense;
    const price = req.body.values.price;
    const userId = req.body.userId;
    const idFormat = req.body.idFormat;
    const productLabel = req.body.productLabel;

    const { data, error } = await supabase
    .from('expenses')
    .insert({ id: userId, productCategory: expense, productPrice: price, created_at: idFormat, productLabel: productLabel })
    .select()
    if (error) throw error;
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/updateExpense', async (req, res) => {
  try {
    const expense = req.body.values.expense;
    const price = req.body.values.price;
    const id = req.body.id;
    const userId = req.body.userId;

    const { data, error } = await supabase
    .from('expenses')
    .update({ productCategory: expense, productPrice: price })
    .eq('productLabel', id)
    .eq('id', userId)
    .select()
    if (error) throw error;
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addMonth', async (req, res) => {
  try {
    const userId = req.body.userId;
    const dataIncome = req.body.data;
    const income = req.body.values.income;
    const month = req.body.values.month;
    const year = req.body.values.year;
    const id = req.body.values.id;

    const { data, error } = await supabase
    .from('income')
    .insert([
      { id: userId, incomeId: dataIncome.length+2, monthIncome: income, monthName: month, year: year }
    ])
    if (error) throw error;
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const email = req.body.values.email;
    const password = req.body.values.password;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) throw error;
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const email = req.body.values.email;
    const password = req.body.values.password;
    const name = req.body.values.name;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })

    if (error) throw error;
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addUser', async (req, res) => {
  try {
    const email = req.body.values.email;
    const name = req.body.values.name;
    const id = req.body.data.user.id;

    const { data:userData, error } = await supabase
    .from('users')
    .insert([
      { id, name, email }
    ])
    if (error) throw error;
    res.json(userData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteExpense/:productLabel', async (req, res) => {
  try {
    const productLabel = req.params.productLabel;
    const userId = req.query.userId;

    const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('productLabel', productLabel)
    .eq('id', userId)
    if (error) throw error;
    res.status(200).json({ message: 'Record deleted successfully!' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
