import React, { useState } from 'react';
import api from '@/services/api';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/reset-password', { email });
      console.log(response.data.message);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ResetPasswordRequest;
