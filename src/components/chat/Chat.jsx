import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";

const Chat = () => {
  const [chat, setChat] = useState();
  const [emoji, setEmoji] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setEmoji(false);
  };

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [chat]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res?.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (text === "") return;

    setIsLoading(true);

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });

      const userIdDs = [currentUser.id, user.id];

      await Promise.all(
        userIdDs.map(async (id) => {
          const userChatsRef = doc(db, "userchats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();
            const chatIndex = userChatsData.chats.findIndex(
              (c) => c.chatId === chatId
            );

            if (chatIndex !== -1) {
              userChatsData.chats[chatIndex] = {
                ...userChatsData.chats[chatIndex],
                lastMessage: text,
                isSeen: id === currentUser.id,
                updatedAt: Date.now(),
              };

              await updateDoc(userChatsRef, { chats: userChatsData.chats });
            }
          }
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setText("");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex-1 border-l border-r border-gray-500 h-full flex flex-col ${
        !user && "justify-center items-center"
      }`}
    >
      {!user ? (
        <div className="py-2 px-4 w-[200px] flex justify-center rounded-[40px] bg-darkBlue ">
          <span>select or add user</span>
        </div>
      ) : (
        <>
          {/* Top Section */}
          <div className="p-2 flex items-center justify-between border-b border-gray-500">
            <div className="flex items-center gap-5">
              <img
                className="w-[50px] h-[50px] rounded-full object-cover"
                src="./avatar.png"
                alt=""
              />
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold">{user.username}</span>
              </div>
            </div>
          </div>
          {/* Center Section */}
          <div
            ref={endRef}
            className="center p-5 flex-1 overflow-scroll flex flex-col gap-5"
          >
            {chat?.messages?.map((message) => (
              <div
                key={`${message.senderId}-${message.createdAt}`}
                className={`max-w-[70%] flex ${
                  message.senderId === currentUser.id ? "own" : ""
                }`}
              >
                <div className="flex-1 flex flex-col gap-1">
                  <p className="p-3 rounded-lg bg-darkBlue text-white">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={endRef}></div>
          </div>
          {/* Bottom Section */}
          <form
            onSubmit={handleSend}
            className={`p-4 mt-auto flex gap-5 items-center justify-center border-t border-gray-500 ${
              isCurrentUserBlocked || isReceiverBlocked
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            <input
              className="flex-1 p-3 rounded-lg text-base bg-darkBlue border-none outline-none text-white resize-none"
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            />
            <div className="w-[20px] h-[20px] cursor-pointer relative">
              <img
                onClick={() => setEmoji((prev) => !prev)}
                src="./emoji.png"
                alt=""
              />
              {emoji && (
                <div className="absolute z-10 bottom-[25px] left-0">
                  <EmojiPicker onEmojiClick={handleEmoji} />
                </div>
              )}
            </div>
            <button
              disabled={isCurrentUserBlocked || isReceiverBlocked || isLoading}
              className="text-white font-semibold w-[100px] py-3 px-5 border-none rounded-md cursor-pointer bg-blue-600"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
