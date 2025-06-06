import { useState } from "react"
import Component from "./Headname"
import { useAuth } from "./AuthContext"
import { useNavigate } from 'react-router-dom';
import gimg from '../images/image.png'

export default function Login(){
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {login} = useAuth();
    const navigate = useNavigate(); 

    const handleLogin = async (e:React.FormEvent) =>{
            e.preventDefault()
            try{
                await login(email,password)
                navigate('/dashboard') 
            }catch(err){
                console.error('Login failed', err);
            }
    }

    return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
            <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-6">
<Component title="Login" />                <div className="flex flex-col space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-100 placeholder-gray-400 text-gray-800 text-sm border border-gray-300 rounded-md px-4 py-2 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Email..."
                        required
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-100 placeholder-gray-400 text-gray-800 text-sm border border-gray-300 rounded-md px-4 py-2 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-black focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Login
                </button>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <a
                    href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <img src={gimg} alt="Google" className="h-5 w-5 mr-2" />
                    Continue with Google
                </a>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </form>
        </div>
    </>
)
}