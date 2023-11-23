import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Nav } from './components/Nav';
import { SignUp } from './components/SignUp';

function App() {
  return (
    <>
      <h1>Expenses App</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nav />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
