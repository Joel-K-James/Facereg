import React from 'react'
import {Route,Routes} from "react-router-dom"
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Signup } from '../pages/Signup'
import { UserAuthContextProvider} from '../context/Authcontext'
import Verify from '../pages/Verify'


export const AllRoutes = () => {
  return (
    <UserAuthContextProvider>
    <Routes>
       <Route path='/' element={<Login/>}/>
       <Route path="/home" element={<Home/>}/>
       <Route path='/signup' element={<Signup/>}/>
       <Route path='/verify' element={<Verify/>}/>
    </Routes>
    </UserAuthContextProvider>
  )
}

