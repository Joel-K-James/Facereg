import { Input,Button, Divider, AspectRatio } from '@chakra-ui/react'
import React, { useState } from 'react'
import googleimg from "../images/search.png"
import "../style/login.css"
import "../style/global.css"
import vc from "./public/vc.png"
import polygon from "./public/polygon-1.svg"
import {createUserWithEmailAndPassword,signInWithPopup} from "firebase/auth"
import { auth, googleProvider } from '../firebase-config/config'
import { Link ,useNavigate} from "react-router-dom";
import { useUserAuth } from "../context/Authcontext";
import { Alert } from "@chakra-ui/react";

export const Login = () => {
    const [email,setEmail] = useState("");
    const [pass,setPass] = useState("")
    const [error,setError] = useState("")
    const {login,googleSignin} = useUserAuth()
    const navigate = useNavigate()

 
    const handlesignin = async() => {
      try{
        await login(email,pass)
        alert("Login Successfully")
        navigate("/home")
      }catch(err){
        setError(err.message)
      } 
    }
    const signinWithgoogle = async() => {
      try{
       await googleSignin()
       navigate("/home")
      }catch(err){
        console.log(err)
      }
    }
  return (
    <div class="loginpage">
      {
          error && <Alert variant={"subtle"} status='error'>{error}</Alert>
      }


      <img class="logo" alt="" src={vc} />

      


      <div class="content">
  <p class="title">Made in India Video Conferencing</p>
  <p class="description">Vconsol, a fully integrated, enterprise grade video conferencing solution for Android, iOS, Mac, Windows & Linux platforms that’s made in India. With AES 128 GCM encryption, it’s secure, reliable & highly practical.</p>
</div>

      <div id='loginContainer'>
        <div id='loginBg'>
        </div>
        <div id='loginform'>
            <h1 id='headingLogin'>LOGIN</h1>
            {
            error && <Alert variant={"subtle"} status='error'>{error}</Alert>
           }
            <div>
              <p id='username'>EMAIL</p>
              <Input type="text" placeholder='EMAIL' onChange={(e)=>setEmail(e.target.value)} border="2px solid black"/>
            </div>
            <div>
               <p id='password'>PASSWORD</p>
               <Input type="password" placeholder='PASSWORD' onChange={(e)=>setPass(e.target.value)} border="2px solid black"/>
            </div>
            <Button id='loginFormBtn' onClick={handlesignin}>Login</Button>
            <Button id='loginwithBtn' onClick={signinWithgoogle}>
              <div id='glogo'>
                <img src={googleimg} alt="" />
              </div>
              <p id='gtext'>Login with Google</p>
            </Button>
             <p>Don't have an account? <br></br><Link to={"/signup"}> Sign Up</Link></p>
        </div> 
    </div>
     
     
   
    </div>

    
  )
}
