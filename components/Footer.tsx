import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white text-center py-4 mt-auto w-full">
      &copy; 2024 NotebookVideo. All Rights Reserved. |{' '}
      <Link href="/term">Term</Link> | <Link href="/privacy">Privacy</Link>
    </footer>
  );
};
export default Footer;
