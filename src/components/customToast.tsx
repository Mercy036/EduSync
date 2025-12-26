// src/components/CustomToast.tsx
'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import './customToast.css';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomToast() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false} // Ensure this is false so the red/green bar shows
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      className="custom-toast-container"
      toastClassName="custom-toast"
    />
  );
}