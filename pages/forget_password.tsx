import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Message } from 'primereact/message';
import { useEffect, useState } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import api from '@/services/api';

const ForgetPassword: React.FC = () => {
  const [message, setMessage] = useState<string>();
  const [severity, setSeverity] = useState<
    'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' | undefined
  >();

  const searchParam = useSearchParams();
  console.log('forget_password searchParam', searchParam.get('token'));
  const token = searchParam.get('token');

  useEffect(() => {
    const resetPassword = async () => {
      try {
        const resp = await api.post(`/reset-password/${token}`);
        console.log(resp);
        setSeverity('success');
        setMessage(resp.data.message);
      } catch (error) {
        setSeverity('error');
        if (axios.isAxiosError(error)) {
          setMessage(error.response?.data.message);
          console.log(error);
        } else {
          setMessage('something wrong when reset password');
        }
      }
    };
    if (token) {
      resetPassword();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white min-h-screen flex flex-col items-strech">
      <Header showLogin={() => {}} />
      <main className="flex flex-grow flex-col container mx-auto p-2 flex flex-col items-center">
        <h2 className="text-lg font-bold m-5">Reset password</h2>
        <div>
          <Message severity={severity} text={message} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgetPassword;
