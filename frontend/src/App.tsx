import React, { ButtonHTMLAttributes, InputHTMLAttributes, ReactHTMLElement, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {io} from "socket.io-client";
import axios from 'axios';

function App() {

  //SocketIO backend url
  const socket = io("http://localhost:8000", {path: "/sockets"})

  const [text, setText] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [connected, setConnected] = useState(socket.connected);
  const [status, setStatus] = useState("");


  //Structure of what a result looks like
  interface Result {
    message?: string
    replacements?: Array<any>
    sentence?: string
  }


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
      console.log(data);
      console.log(data.sessionId);
      if (localStorage.getItem("sessionID") == data.sessionId) {
        setStatus("Checked!");
        setResults(data.result)
      }
    });



    console.log(status)


  }, []);


  //Sends uploaded text to the backend (userinput service)
  const handleUploadText = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <div className="app-container">
      <h1>Grammar Checker</h1>
      <input
        placeholder="Enter Text"
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleUploadText}>Upload Text</button>
      <h2>Status: {status}</h2>
      <div className="results-container">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="result-item">
              <div className="result-message">{result.message}</div>
              <div className="result-sentence">{result.sentence}</div>
              <div className="result-replacements">
                Replacements: {result.replacements?.map((r) => r.value).join(", ")}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No results to display.</div>
        )}
      </div>
    </div>
  );
}

export default App;
