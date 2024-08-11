// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Payment from './Payment';
import Feedback from './Feedback';
import Dashboard from './Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Payment />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
