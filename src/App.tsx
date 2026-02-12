import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import Products from "./pages/Products.tsx";
import Register from "./pages/Register.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/login' element={<Login />} />
        <Route path='/Register' element={<Register />} />

        <Route path='/products' element={<Products />} />
      </Routes>
    </>
  );
}

export default App;

// 1- npm install @supabase/supabase-js
