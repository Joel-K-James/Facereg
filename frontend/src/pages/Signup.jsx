import React, { useState } from "react";
import vc from "./public/vc.png"
import polygon from "./public/polygon-1.svg"
import { Button, Input } from "@chakra-ui/react";
import { Link ,useNavigate} from "react-router-dom";
import { useUserAuth } from "../context/Authcontext";
import { Alert } from "@chakra-ui/react";


export const Signup = () => {
    const [email,setEmail] = useState("");
    const [pass,setPass] = useState("")
    const [error,setError] = useState("")
    const {signup} = useUserAuth()
    const navigate = useNavigate()
    const handlesignup = async() => {
        setError("")
        try{
          await signup(email,pass)
          alert("User Created Successfully")
          navigate("/login")
        }catch(err){
          setError(err.message)
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
    <div id="loginContainer">
      <div id="loginBg">

      </div>
      <div id="loginform">
        <h1 id="headingLogin">SIGNUP</h1>
        {
            error && <Alert variant={"subtle"} status='error'>{error}</Alert>
        }
        <div>
          <p id="username">EMAIL</p>
          <Input
            type="text"
            placeholder="EMAIL"
            onChange={(e) => setEmail(e.target.value)}
            border="2px solid black"
          />
        </div>
        <div>
          <p id="password">PASSWORD</p>
          <Input
            type="password"
            placeholder="PASSWORD"
            onChange={(e) => setPass(e.target.value)}
            border="2px solid black"
          />
        </div>
        <Button id="loginFormBtn" onClick={handlesignup}>
          SIGN UP
        </Button>
        <p>Already have an account? <Link to={"/"}>Log In</Link></p>
      </div>
    </div>
    </div>
  );
};
