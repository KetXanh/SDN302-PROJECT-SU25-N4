import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import AppRoute from "./AppRoute"

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <AppRoute/>
    </BrowserRouter>
  )
}

export default App
