import React, { useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import {loginService} from '../Utils/Services'
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await loginService(email, password);
            
            if(response.status == 200){
                toast.success("Login Success",{
                    autoClose:10,
                    
                })
                window.location.reload()
            }
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
        setLoading(false)
    };

    return (
        <>
            {loading && (
                <div className="loader-container">
                    <ScaleLoader
                        color="#000000"
                        height={40}
                        loading
                        radius={2}
                        width={4}
                    />
                </div>
            )}
            <ToastContainer />
            <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
                <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
                    <div
                        className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
                        style={{
                            backgroundImage: `url(https://www.tailwindtap.com//assets/components/form/userlogin/login_tailwindtap.jpg)`,
                        }}
                    ></div>
                    <div className="w-full p-8 lg:w-1/2">
                        <p className="text-xl text-gray-600 text-center">
                            Welcome back!
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email Address
                                </label>
                                <input
                                    className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                            </div>
                            <div className="mt-4 flex flex-col justify-between">
                                <div className="flex justify-between">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Password
                                    </label>
                                </div>
                                <input
                                    className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                
                            </div>
                            <div className="mt-8">
                                <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                                    Login
                                </button>
                            </div>
                        </form>
                            
                        
                        <div className="mt-4 flex items-center w-full text-center">
                            <Link
                                to={"/signup"}
                                className="text-xs text-gray-500 capitalize text-center w-full"
                            >
                                Don&apos;t have any account yet?
                                <span className="text-blue-700"> Sign Up</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
