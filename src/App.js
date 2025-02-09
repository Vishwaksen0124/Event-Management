// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

const Home = ({ isAuthenticated }) => (
    <div className='main-container'>
        <h2>Welcome to Event Management App</h2>
        {isAuthenticated ? (
            <Link to="/events">Go to Events</Link>
        ) : (
            <div>
                <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
            </div>
        )}
    </div>
);

const App = () => {
    const [events, setEvents] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        if (isAuthenticated) {
            axios.get('https://eventmanager-l1t7.onrender.com/api/events')
                .then(response => setEvents(response.data))
                .catch(error => console.error(error));
        }
    }, [isAuthenticated]);

    const handleEventAdd = (newEvent) => {
        setEvents([...events, newEvent]);
    };

    const handleEventDelete = (id) => {
        axios.delete(`https://eventmanager-l1t7.onrender.com/api/events/${id}`)
            .then(() => setEvents(events.filter(event => event._id !== id)))
            .catch(error => console.error(error));
    };

    return (
        <Router>
            <div className='main-container'>
                <Routes>
                    <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
                    <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/events" element={
                        isAuthenticated ? (
                            <>
                                <EventForm onEventAdd={handleEventAdd} />
                                <EventList events={events} onEventDelete={handleEventDelete} />
                            </>
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
