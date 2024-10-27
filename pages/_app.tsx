import type { AppProps } from 'next/app';
import { useMemo, useState } from 'react';

import { AuthContext } from '@/context/AuthContext';
import { User } from '@/types/User';

import '@/styles/globals.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'tailwindcss/tailwind.css';

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider
      value={useMemo(() => ({ user, setUser }), [user, setUser])}
    >
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}
