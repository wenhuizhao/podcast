import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { TabPanel, TabView } from 'primereact/tabview';
import { useState } from 'react';

import api from '@/services/api';

const LoginPanel = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordConfirm, setPasswordConfirm] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('handleSignIn', email, password);
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      console.log(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.status);
        console.error(error.response);
        // Do something with this error...
      } else {
        console.error(error);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/login/google';
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('cancel', e.target);
  };
  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    console.log(password, passwordConfirm);
    if (password !== passwordConfirm) {
      setErrorMessage('Password need match passwordConfirm');
      return;
    }
    console.log('handleSignup', email, password);
    try {
      const response = await api.post('/register', { email, password });
      console.log(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.status);
        console.error(error.response);
        // Do something with this error...
      } else {
        console.error(error);
      }
    }
  };

  return (
    <TabView
      panelContainerStyle={{
        backgroundColor: 'blue',
        width: '500px',
        height: '600px',
      }}
    >
      <TabPanel header="Sign In">
        <div
          className="flex flex-column px-8 py-5 gap-4"
          style={{
            borderRadius: '12px',
            backgroundImage:
              'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))',
          }}
        >
          <Message
            className="inline-flex flex-column gap-2"
            severity="error"
            text={errorMessage}
          />
          <div className="inline-flex flex-column gap-2">
            <label htmlFor="email" className="text-primary-50 font-semibold">
              Email
            </label>
            <InputText
              id="email"
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            ></InputText>
          </div>
          <div className="inline-flex flex-column gap-2">
            <label htmlFor="email" className="text-primary-50 font-semibold">
              Password
            </label>
            <InputText
              id="password"
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
              type="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            ></InputText>
          </div>
          <div className="flex align-items-center gap-2">
            <Button
              label="Sign-In"
              onClick={handleSignIn}
              text
              className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
            ></Button>
            <Button
              label="Cancel"
              onClick={handleCancel}
              text
              className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
            ></Button>
          </div>
          <div className="flex align-items-center gap-2">
            <button onClick={handleGoogleLogin}>Login with Google</button>
            <p>
              <a href="/reset-password">Forgot Password?</a>
            </p>
          </div>
        </div>
      </TabPanel>
      <TabPanel header="Sign Up">
        <div
          className="flex flex-column justify-content-between px-8 py-5 gap-4"
          style={{
            height: '560px',
            borderRadius: '12px',
            backgroundImage:
              'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))',
          }}
        >
          <Message
            className="inline-flex flex-column gap-2"
            severity="error"
            text={errorMessage}
          />

          <div className="inline-flex flex-column gap-2">
            <label htmlFor="email" className="text-primary-50 font-semibold">
              Email
            </label>
            <InputText
              id="email"
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
              onChange={(e) => setEmail(e.target.value)}
            ></InputText>
          </div>
          <div className="inline-flex flex-column gap-2">
            <label htmlFor="password" className="text-primary-50 font-semibold">
              Password
            </label>
            <InputText
              id="password"
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
            ></InputText>
          </div>
          <div className="inline-flex flex-column gap-2">
            <label htmlFor="password" className="text-primary-50 font-semibold">
              Password Confirm
            </label>
            <InputText
              id="passwordConfirm"
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
              type="password"
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setErrorMessage('');
              }}
            ></InputText>
          </div>
          <div className="flex align-items-center gap-2">
            <Button
              label="Sign-Up"
              onClick={handleSignUp}
              text
              className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
            ></Button>
            <Button
              label="Cancel"
              onClick={handleCancel}
              text
              className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
            ></Button>
          </div>
        </div>
      </TabPanel>
    </TabView>
  );
};

export default LoginPanel;
