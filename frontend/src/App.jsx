import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RootRoutes from './routes/RootRoutes'

const App = () => {
  return (
    <BrowserRouter> 
      <RootRoutes />
    </BrowserRouter>
  )
}

export default App