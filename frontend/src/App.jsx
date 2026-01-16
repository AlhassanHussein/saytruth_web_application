import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';

import PublicProfile from './pages/PublicProfile';

// Layout
import BottomNav from './components/BottomNav';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

// Redirect to Home if already logged in
function PublicOnlyRoute({ children }) {
    const token = localStorage.getItem('token');
    if (token) {
        return <Navigate to="/" replace />;
    }
    return children;
}

function App() {
    return (
        <Router>
            <div className="min-h-screen pb-16 bg-background text-foreground font-sans">
                <Routes>
                    <Route path="/login" element={
                        <PublicOnlyRoute>
                            <Login />
                        </PublicOnlyRoute>
                    } />
                    <Route path="/signup" element={
                        <PublicOnlyRoute>
                            <Signup />
                        </PublicOnlyRoute>
                    } />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />

                    <Route path="/search" element={
                        <ProtectedRoute>
                            <Search />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    <Route path="/public/:username" element={<PublicProfile />} />

                    {/* Catch-all route: Redirect based on auth status */}
                    <Route path="*" element={<Navigate to={localStorage.getItem('token') ? "/" : "/login"} replace />} />
                </Routes>
                <BottomNav />
            </div>
        </Router>
    )
}

export default App
