import axios from 'axios';
import { Message } from 'primereact/message';
import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import api, { apiRoot } from '@/services/api';
import { User } from '@/types/User';

export interface Props {
  onCancel: () => void;
  onLogin: (fromVideoGeneration: boolean) => void;
  infoMessage: string | null | undefined;
  fromVideoGeneration: boolean;
}

const unverifiedMessage = `Your account is not verified. Please check your email.
    If you can't find the email, check your spam folder.
`;
const SignInPanel: React.FC<Props> = ({
  onCancel,
  onLogin,
  infoMessage,
  fromVideoGeneration,
}) => {
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordConfirm, setPasswordConfirm] = useState<string>();
  const [message, setMessage] = useState<string | null | undefined>(
    infoMessage
  );
  const [messageType, setMessageType] = useState<
    'info' | 'success' | 'warn' | 'error' | 'secondary' | 'contrast'
  >('info');
  const { setUser } = useAuth();

  console.log('infomessage', infoMessage);
  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('handleSignIn', email, password);
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      console.log(response.data.message);
      const token = response.data.token;
      //const decoded = jwtDecode<CustomClaim>(token);
      localStorage.setItem('token', token);
      axios.defaults.headers['Authorization'] = token ? `Bearer ${token}` : '';
      //const loginState: LoginState = { logged_in: true, email: decoded.email };
      const user: User = {
        userId: response.data.userId,
        email: response.data.email,
      };
      setUser(user);
      onLogin(fromVideoGeneration);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.status);
        console.error(error.response);
        if (error.status === 422) {
          //account is not verified.
          setMessage(unverifiedMessage);
          setMessageType('warn');
        } else {
          console.log(error.response?.data.message);
          setMessage(error.response?.data.message);
          setMessageType('error');
        }
      } else {
        console.error(error);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiRoot}/login/google`;
  };

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    console.log(password, passwordConfirm);
    if (password !== passwordConfirm) {
      setMessage('Password need match passwordConfirm');
      setMessageType('error');
      return;
    }
    console.log('handleSignup', email, password);
    try {
      const response = await api.post('/register', { email, password });
      console.log(response.data.message);
      setMessage(response.data.message);
      setMessageType('success');
      setShowSignup(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.status);
        console.error(error.response);
        setMessage(error.response?.data.message);
        setMessageType('error');
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      {!showSignup && (
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg max-w-lg w-full">
          <div className="flex justify-center mb-6">
            <a
              href="#"
              className="text-white text-lg font-semibold hover:underline"
            >
              Sign In
            </a>
          </div>
          <div className="flex justify-center m-4">
            <button
              type="button"
              className="google-sign-in-button"
              onClick={handleGoogleLogin}
            >
              Sign in with Google
            </button>
          </div>
          <form className="space-y-6">
            {message && (
              <div className="flex justify-center">
                <Message
                  className="inline-flex flex-column gap-2"
                  severity={messageType}
                  text={message}
                />
              </div>
            )}
            <div>
              <label className="block text-white text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/10"
                placeholder="Enter your email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setMessage('');
                }}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/10"
                placeholder="Enter your password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setMessage('');
                }}
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                onClick={() => onCancel()}
              >
                Cancel
              </button>
            </div>

            <div className="flex justify-between items-center mt-6">
              <a
                href="#"
                className="text-white hover:underline"
                onClick={() => setShowSignup(true)}
              >
                Register
              </a>
              <a href="#" className="text-white hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      )}
      {showSignup && (
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg max-w-lg w-full">
          <div className="flex justify-center mb-6">
            <a
              href="#"
              className="text-white text-lg font-semibold hover:underline"
            >
              Register New Account
            </a>
          </div>
          <form className="space-y-6">
            {message && (
              <div className="flex justify-center">
                <Message
                  className="inline-flex flex-column gap-2"
                  severity={messageType}
                  text={message}
                />
              </div>
            )}
            <div>
              <label className="block text-white text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/10"
                placeholder="Enter your email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setMessage('');
                }}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/10"
                placeholder="Enter your password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setMessage('');
                }}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium">
                PasswordConfirm
              </label>
              <input
                type="password"
                id="passwordConfirm"
                className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/10"
                placeholder="Enter your passwordConfirm"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPasswordConfirm(e.target.value);
                  setMessage('');
                }}
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                onClick={handleSignUp}
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                onClick={() => onCancel()}
              >
                Cancel
              </button>
            </div>

            <div className="flex justify-between items-center mt-6">
              <a
                href="#"
                className="text-white hover:underline"
                onClick={() => setShowSignup(false)}
              >
                Login
              </a>
              <a href="#" className="text-white hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignInPanel;
