import type { AppProps } from 'next/app';

import '@/styles/globals.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'tailwindcss/tailwind.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
