import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [loading, setLoading] = useState(false);
  const [model, setModal] = useState({
    email: '',
    password: '',
  });
  const navigate=useNavigate()
  const login = async () => {
    setLoading(true);
    console.log(model);
  
    try {
      const response = await axios.post(
        'https://phpstack-1250641-4484399.cloudwaysapps.com/api/agent/login',
        model
      );
      console.log(response);
  
      // Success toast with custom text color
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          color: 'white', // Text color
          backgroundColor: 'green', // Background color for success
        },
      });
      
      setLoading(false); 
      setModal({})
      navigate('/Agentchat')
    } catch (error) {
      console.error(error);
  
      // Error toast with custom text color
      toast.error('Login failed. Please check your credentials!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          color: 'white', // Text color
          backgroundColor: 'red', // Background color for error
        },
      });
      setModal({})
    } finally {
      setLoading(false); // Stop loading after the process ends
      setModal({})
    }
  };
  

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-96 z-10">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
        <input
          type="email"
          className="w-full p-3 mt-4 border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Email"
          onChange={(e) => {
            setModal((prev) => ({
              ...prev,
              email: e.target.value,
            }));
          }}
        />
        <input
          type="password"
          className="w-full p-3 mt-4 border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Password"
          onChange={(e) => {
            setModal((prev) => ({
              ...prev,
              password: e.target.value,
            }));
          }}
        />
        <button
          onClick={login}
          className="w-full p-3 mt-6 bg-gray-900 text-white rounded-md font-semibold disabled:bg-gray-600"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin mx-auto"></div>
          ) : (
            'Login'
          )}
        </button>
      </div>
        <ToastContainer />
    </>
  );
}

export default Login;
