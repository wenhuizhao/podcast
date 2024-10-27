import axios from 'axios';
import { useRouter } from 'next/router';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { useEffect, useState } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { downloadFile } from '@/utils/FileUtil';
import { convertISOToLocalTime } from '@/utils/TimeUtil';

import 'primeicons/primeicons.css'; // Icons
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Theme

interface Job {
  title: string;
  time_created: string;
  time_updated: string;
  time_start_process: string;
  status: string;
  output: string;
  error: string;
}

const JobListPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { setUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const resp = await api.get('/jobs');
        console.log(resp);
        setJobs(resp.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.status) {
          if (error.status === 401) {
            router.push('/');
          } else {
            console.log(error.response?.data.message);
            setErrorMessage(error.response?.data.message || error.message);
          }
        } else {
          console.error(error);
        }
      }
    };
    fetchJobs();
  }, []);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge value="In Progress" severity="info" />;
      case 'completed':
        return <Badge value="Completed" severity="success" />;
      case 'failed':
        return <Badge value="Failed" severity="danger" />;
      default:
        return null;
    }
  };
  const logOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setUser(null);
    api.post('/logout');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white min-h-screen flex flex-col items-strech">
      <Header showLogin={() => {}} />
      <main className="flex flex-grow justify-stretch  mx-2 p-2">
        {/* Left Menu */}
        <div className="w-64 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-lg">
          <h2 className="text-white text-2xl font-bold mb-6">Menu</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer transition">
              <i className={'pi pi-video text-xl'}></i>
              <span className="text-lg">Videos</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer transition">
              <i className={'pi pi-user text-xl'}></i>
              <span className="text-lg">Profile</span>
            </div>
            <div className="flex items-center  rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer transition">
              <a
                href="#"
                onClick={logOut}
                className="flex items-center gap-4 p-3"
              >
                <i className={'pi pi-sign-out text-xl'}></i>
                <span className="text-lg">Logout</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Jobs</h1>

          {errorMessage && (
            <Message
              severity="error"
              className="inline-flex flex-column gap-2"
              text={errorMessage}
            />
          )}
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {job.title ? job.title : 'Untitled'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Uploaded: {convertISOToLocalTime(job.time_created)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  {getStatusBadge(job.status)}

                  {/* Download Button */}
                  {job.status === 'completed' && (
                    <Button
                      icon="pi pi-download"
                      label="Download"
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition"
                      onClick={() => downloadFile(job.output)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobListPage;
