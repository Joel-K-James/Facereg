import React from 'react'
import {Route,Routes} from "react-router-dom"
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Signup } from '../pages/Signup'
import { UserAuthContextProvider} from '../context/Authcontext'


export const AllRoutes = () => {
  return (
    <UserAuthContextProvider>
    <Routes>
       <Route path='/' element={<Login/>}/>
       <Route path="/home" element={<Home/>}/>
       <Route path='/signup' element={<Signup/>}/>
    </Routes>
    </UserAuthContextProvider>
  )
}

