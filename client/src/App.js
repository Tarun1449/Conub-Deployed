import React, { useEffect } from 'react';
import './App.css';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import store from './Redux/Store';
import SignUp from './Components/SignUp';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Home from './Components/Home';
import { setEmailAndName } from './Redux/Actions';
import { verifyTokenService } from './Utils/Services';

function App() {
  const email = useSelector(state => state.email);
  const navigate = useNavigate();
  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyTokenService();
        store.dispatch(setEmailAndName(response.data.user.email, response.data.user.username));
      } catch (error) {
        console.log("Token Expired :", error);
      
      }
    }
    verify();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        {email === '' ? (
          <>
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <Route path="*" element={<Home />} />
        )}
      </Routes>
      </>
  );
}

export default App;
