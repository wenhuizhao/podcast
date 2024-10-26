import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export interface Props {
  showLogin: () => void;
  loginState: LoginState;
}
export interface LoginState {
  logged_in: boolean;
  email: string;
}
export interface CustomClaim {
  user_id: string;
  email: string;
  exp: number;
}
const Header: React.FC<Props> = ({ showLogin, loginState }) => {
  const [loginStatus, setLoginStatus] = useState<LoginState>({
    ...loginState,
  });
  const router = useRouter();
  console.log('loginState:', loginState, loginStatus);
  useEffect(() => {
    console.log('setLoginStatus:', loginState);
    setLoginStatus(loginState);
    if (loginState.logged_in) {
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode token to get user info
        console.log('token', token);
        const decoded = jwtDecode<CustomClaim>(token);
        // Check token expiration
        if (decoded.exp * 1000 > Date.now()) {
          setLoginStatus({ logged_in: true, email: decoded.email });
        } else {
          // Token has expired
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
  }, [loginState]);
  const logOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoginStatus({ logged_in: false, email: '' });
    localStorage.removeItem('token');
    router.push('/');
  };
  return (
    <header className="shadow-md bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2">
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center">NotebookVideo</h1>
        <ul className="flex space-x-8">
          <li>
            <Link href="/" className="text-white font-bold hover:text-blue-800">
              Home
            </Link>
          </li>
          <li>
            <Link href="/" className="text-white font-bold hover:text-blue-800">
              Gallery
            </Link>
          </li>
          <li>
            {loginStatus.logged_in ? (
              <Link
                href="#"
                className="text-white font-bold hover:text-blue-800"
                onClick={logOut}
              >
                Logout
              </Link>
            ) : (
              <Link
                href="#"
                className="text-white font-bold hover:text-blue-800"
                onClick={showLogin}
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
