import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicOnlyRoute from './routes/PublicOnlyRoute';
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import SignTranslation from './pages/SignTranslation';
import Dictionary from './pages/Dictionary';
import Learn from './pages/Learn';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Help from './pages/Help';

function App() {
    return (
        <AuthProvider>
            <Router>
                <MainLayout>
                    <Routes>
                        {/* Public Only Routes - Only for logged-out users */}
                        <Route 
                            path="/" 
                            element={
                                <PublicOnlyRoute>
                                    <Home />
                                </PublicOnlyRoute>
                            } 
                        />
                        <Route 
                            path="/about" 
                            element={
                                <PublicOnlyRoute>
                                    <About />
                                </PublicOnlyRoute>
                            } 
                        />
                        
                        {/* Auth Routes - Available to all */}
                        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
                        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        
                        {/* Protected Routes - Only for logged-in users */}
                        <Route
                            path="/translate"
                            element={
                                <ProtectedRoute>
                                    <SignTranslation />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <SignTranslation />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/learn"
                            element={
                                <ProtectedRoute>
                                    <Learn />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dictionary"
                            element={
                                <ProtectedRoute>
                                    <Dictionary />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Utility Pages - Available to all */}
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/help" element={<Help />} />
                    </Routes>
                </MainLayout>
            </Router>
        </AuthProvider>
    );
}

export default App; 