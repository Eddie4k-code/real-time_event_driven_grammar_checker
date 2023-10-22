import React, { ButtonHTMLAttributes, InputHTMLAttributes, ReactHTMLElement, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {io} from "socket.io-client";
import axios from 'axios';

function App() {

  //SocketIO backend url
  const socket = io("http://localhost:8000", {path: "/sockets"})

  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [connected, setConnected] = useState(socket.connected);
  const [status, setStatus] = useState("");


  useEffect(() => {

    //Generate a session id for the client.
    localStorage.setItem("sessionID", "user__" + Math.random().toString());
    

    socket.on('connect', () => {
      setConnected(socket.connected);
    });

    socket.on("disconnect", () => {
      setConnected(socket.connected)
    });


    //When text submission occurs notify the client its being checked.
    socket.on("submit", (data) => {
      console.log(data);
      console.log(localStorage.getItem("sessionID"))

      if (localStorage.getItem("sessionID") == data.sessionId) {
      setStatus("Checking...");
      }


      return () => {
        socket.off('connect');
        socket.off('submit');
      }
      
    });

    //When Grammar is checked the result is sent back to the client.
    socket.on("checked", (data) => {
      if (data.sessionId == sessionId) {
        setStatus("Checked!");
        setResult(data.result)
      }
    });

    console.log(status)


  }, []);


  //Handles functionality for when the user submits text
  const handeUploadText = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //axios request to backend (/upload-text)

    await axios.post("http://localhost:8000/upload-text", {
      sessionId: localStorage.getItem("sessionID"),
      text: text
    });

    

    
  }

  //Generates a random session id for client
  const genSessionId = (): string => {
    return "client_" + Math.random().toString();
  }


  return (

      <>
    <input placeholder="Enter Text" onChange={(e) => setText(e.target.value)}></input>
    <button onClick={handeUploadText}>Upload Text</button>
    <h1>{status}</h1>
      </>
   
  );
}

export default App;
