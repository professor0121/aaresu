import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RootRoutes from './routes/RootRoutes'
import { useDispatch } from 'react-redux'
import { loadUser } from './redux/auth/authThunks'
import { useEffect } from 'react'

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <RootRoutes />
    </BrowserRouter>
  )
}

export default App