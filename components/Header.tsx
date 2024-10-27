import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/User';

export interface Props {
  showLogin: () => void;
}
export interface CustomClaim {
  user_id: string;
  email: string;
  exp: number;
}
const Header: React.FC<Props> = (props) => {
  const { showLogin } = props;
  const { user, setUser } = useAuth();
  //console.log('user', user);
  useEffect(() => {
    if (user) {
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode token to get user info
        //console.log('token', token);
        const decoded = jwtDecode<CustomClaim>(token);
        // Check token expiration
        if (decoded.exp * 1000 > Date.now()) {
          const decodedUser: User = {
            userId: decoded.user_id,
            email: decoded.email,
          };
          setUser(decodedUser);
        } else {
          // Token has expired
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

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
            {user ? (
              <Link
                href="/jobs"
                className="text-white font-bold hover:text-blue-800"
              >
                <i className={'pi pi-user text-xl'}></i>
              </Link>
            ) : (
              <Link
                href="#"
                className="text-white font-bold hover:text-blue-800"
                onClick={() => {
                  console.log('click login', showLogin);
                  showLogin();
                  console.log('after call showLogin');
                }}
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
