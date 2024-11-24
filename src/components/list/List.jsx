import React from "react";
import UserInfo from "./userInfo";
import ChatList from "./chatList";

const List = () => {
  return (
    <div className="flex-none h-full w-1/4 flex flex-col">
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
