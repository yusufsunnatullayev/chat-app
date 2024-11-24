import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";

const Login = () => {
  const [lodaing, setLoading] = useState(false);
  const { resetUser } = useChatStore();

  const hanldeLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("You have successfully logged in!");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
    resetUser();
    e.target.reset();
  };

  const hanldeRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
    resetUser();
    e.target.reset();
  };

  return (
    <div className="w-full h-full flex items-center justify-center gap-[100px]">
      <div className="w-1/3 flex flex-col items-center gap-5">
        <h2 className="text-2xl font-semibold">Welcome back,</h2>
        <form
          onSubmit={hanldeLogin}
          className="p-10 flex w-full flex-col items-center justify-center gap-5"
        >
          <input
            className="w-full p-5 border-none outline-none bg-darkBlue/60 text-white rounded-md"
            type="text"
            placeholder="Email"
            name="email"
          />
          <input
            className="p-5 w-full border-none outline-none bg-darkBlue/60 text-white rounded-md"
            type="password"
            placeholder="Password"
            name="password"
          />
          <button
            disabled={lodaing}
            className={`w-full p-5 rounded-md text-base font-medium ${
              lodaing ? "bg-blue-900 cursor-not-allowed" : "bg-blue-600"
            } border-none cursor-pointer`}
          >
            {lodaing ? "Loading..." : "Sing In"}
          </button>
        </form>
      </div>
      <div className="h-[80%] w-[2px] bg-gray-500"></div>
      <div className="w-1/3  flex flex-col items-center gap-5">
        <h2 className="text-2xl font-semibold">Create an Account</h2>
        <form
          onSubmit={hanldeRegister}
          className="flex w-full p-10 flex-col items-center justify-center gap-5"
        >
          <input
            className="p-5 w-full border-none outline-none bg-darkBlue/60 text-white rounded-md"
            type="text"
            placeholder="Username"
            name="username"
          />
          <input
            className="p-5 w-full border-none outline-none bg-darkBlue/60 text-white rounded-md"
            type="text"
            placeholder="Email"
            name="email"
          />
          <input
            className="p-5 w-full border-none outline-none bg-darkBlue/60 text-white rounded-md"
            type="password"
            placeholder="Password"
            name="password"
          />
          <button
            disabled={lodaing}
            className={`w-full p-5 rounded-md text-base font-medium ${
              lodaing ? "bg-blue-900 cursor-not-allowed" : "bg-blue-600"
            }  border-none cursor-pointer`}
          >
            {lodaing ? "Loading..." : "Sing Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
