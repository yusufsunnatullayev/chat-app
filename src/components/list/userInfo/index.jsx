import React, { useState } from "react";
import { useUserStore } from "../../../lib/userStore";
import { SlOptionsVertical } from "react-icons/sl";
import { IoClose } from "react-icons/io5";
import { auth } from "../../../lib/firebase";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  const [option, setOption] = useState(false);

  return (
    <div className="p-5 flex relative items-center justify-between">
      <div className="flex items-center gap-5">
        <img
          className="w-[50px] h-[50px] rounded-full object-cover"
          src="./avatar.png"
          alt=""
        />
        <h1 className="text-2xl font-bold text-blue-500">
          {currentUser.username}
        </h1>
      </div>
      <button
        onClick={() => setOption((prev) => !prev)}
        className="cursor-pointer text-xl text-gray-400 hover:text-white duration-150"
      >
        {option ? <IoClose /> : <SlOptionsVertical />}
      </button>
      {option && (
        <div className="p-2 absolute  bg-darkBlue  rounded-md right-8 top-12">
          <button
            onClick={() => auth.signOut()}
            className="py-1 px-3 rounded-md bg-red-600 text-white font-semibold text-base"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
