import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Menu from './components/MenuItem';
import OrderSummary from './components/Order';


function App() {
  

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "90vw",
        backgroundColor: "#f3f4f6",
      }}
    >
      <Menu />
      <OrderSummary />
    </div>
  );
}

export default App
