import { useState } from 'react'
import './App.css'
import VoiceButton from './components/VoiceButton'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Recorder from './routes/recorder';
import Root from './routes/root';
import Summary from './routes/summary';
import Navbar from './components/Navbar';

function App() {
  const [summary, setSummary] = useState("");

  return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Root/>} />
                    <Route path="record" element={<Recorder/>} />
                    <Route path="summary" element={<Summary/>} />
                </Routes>
            </Router>
        </>
    )
}

export default App
