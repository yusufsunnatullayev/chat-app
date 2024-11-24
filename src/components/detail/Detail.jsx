import React from "react";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-none flex flex-col w-1/4 h-full overflow-y-scroll">
      {chatId && (
        <>
          <div className="p-5 flex flex-col items-center gap-3 border-b border-gray-500">
            <img
              className="w-[80px] h-[80px] rounded-full object-cover"
              src="./avatar.png"
              alt=""
            />
            <h2>{user?.username}</h2>
          </div>
          <div className="p-5 flex flex-col justify-end h-full gap-7">
            {user && (
              <button
                onClick={handleBlock}
                className="py-2 px-3 rounded-md bg-red-600 text-white font-semibold w-full opacity-70 hover:opacity-100 duration-150"
              >
                {isCurrentUserBlocked
                  ? "You are blocked"
                  : isReceiverBlocked
                  ? "User blocked"
                  : "Block User"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
