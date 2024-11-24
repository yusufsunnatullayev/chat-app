import React, { useEffect, useState } from "react";
import AddUser from "./addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(true);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    changeChat(chat.chatId, chat.user);
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-scroll">
      <div className="flex items-center gap-5 p-5">
        <div className="flex-1 p-1 bg-darkBlue bg-opacity-50 flex items-center gap-5 rounded-md">
          <img
            className="w[-20px] h-[20px] flex-none"
            src="./search.png"
            alt=""
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-white flex-1"
            type="text"
            placeholder="Search..."
          />
        </div>
        <button
          onClick={() => setAddMode((prev) => !prev)}
          className="text-2xl w-[35px] px-2 flex items-center justify-center font-semibold bg-darkBlue bg-opacity-50 rounded-lg cursor-pointer"
        >
          {addMode ? "+" : "-"}
        </button>
      </div>
      {filteredChats.map((chat) => (
        <div
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          className={`flex items-center gap-5 p-3 hover:bg-darkBlue/70 cursor-pointer border-b border-gray-500 `}
        >
          <img
            className="w-[50px] h-[50px] rounded-full"
            src="./avatar.png"
            alt=""
          />
          <div className="flex flex-col gap-1">
            <span className="font-medium">{chat.user.username}</span>
            <p className="font-light">{chat.latestMessage}</p>
          </div>
        </div>
      ))}
      {!addMode && <AddUser setAddMode={setAddMode} />}
    </div>
  );
};

export default ChatList;
