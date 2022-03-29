import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { useState } from "react";

function App() {
  const [message, setMessage] = useState("No Reveal")

  const fetchData = async () => {
    const results = await axios.get("/.netlify/functions/reveal");
    setMessage(results.data.message)
  }

  const reveal = () => {
    fetchData()
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>{ message }</p>
        <btn onClick={reveal}>Reveal</btn>
      </header>
    </div>
  );
}

export default App;
