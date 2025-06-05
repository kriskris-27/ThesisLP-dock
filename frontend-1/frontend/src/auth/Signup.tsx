import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import gimg from '../images/image.png';
import Component from './Headname';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { email, password, name });
      navigate('/login');
    } catch (err) {
      console.error('Signup failed', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <form onSubmit={handleSignup} className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-6">
<Component title="Sign up" />        
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-gray-100 placeholder-gray-400 text-gray-800 text-sm border border-gray-300 rounded-md px-4 py-2 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-gray-100 placeholder-gray-400 text-gray-800 text-sm border border-gray-300 rounded-md px-4 py-2 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-gray-100 placeholder-gray-400 text-gray-800 text-sm border border-gray-300 rounded-md px-4 py-2 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-black focus:outline-none focus:ring focus:ring-blue-300"
        >
          Sign Up
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
          href="http://localhost:5001/api/auth/google"
          className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <img src={gimg} alt="Google" className="h-5 w-5 mr-2" />
          Continue with Google
        </a>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
