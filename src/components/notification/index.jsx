import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  return (
    <div>
      <ToastContainer autoClose={2000} position="bottom-right" />
    </div>
  );
};

export default Notification;
