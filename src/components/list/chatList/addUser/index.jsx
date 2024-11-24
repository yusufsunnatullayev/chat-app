import React, { useState } from "react";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/userStore";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const AddUser = ({ setAddMode }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();
  const [result, setResult] = useState("");

  const hanldeSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
        setResult("");
      } else {
        setUser(null);
        setResult("No results found...");
      }
    } catch (error) {
      console.log(error);
      setResult("An error occurred while searching.");
    }
    e.target.reset();
  };

  const handleAdd = async (e) => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userChats");

    try {
      const userChatsDocRef = doc(userChatRef, currentUser.id);
      const userChatsDocSnap = await getDoc(userChatsDocRef);

      if (userChatsDocSnap.exists()) {
        const userChatsData = userChatsDocSnap.data();
        const chatExists = userChatsData.chats.some(
          (chat) => chat.receiverId === user.id
        );

        if (chatExists) {
          toast.warn("This user is already in your chats!");
          return;
        }
      }

      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setAddMode(true);
    }
  };

  return (
    <div className="fixed w-full h-screen bg-darkBlue bg-opacity-50 top-0 left-0 flex items-start justify-center gap-20">
      <div className="p-10 top-20 relative  bg-darkBlue rounded-lg w-1/2 ">
        <IoClose
          onClick={() => setAddMode(true)}
          className="absolute text-xl top-3 right-3 cursor-pointer"
        />
        <form onSubmit={hanldeSearch} className="flex gap-3 w-full">
          <input
            className="py-2 px-3 rounded-lg w-full text-black border-none outline-none"
            type="text"
            placeholder="Username"
            name="username"
          />
          <button className="py-2 px-4 rounded-lg bg-blue-600 text-white cursor-pointer">
            Search
          </button>
        </form>
        {user ? (
          <div className="mt-[50px] flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img
                className="w-[50px] h-[50px] rounded-full object-cover"
                src="./avatar.png"
                alt=""
              />
              <span>{user?.username}</span>
            </div>
            <button
              onClick={handleAdd}
              className="py-1 px-3 rounded-md bg-blue-600 text-white"
            >
              Add User
            </button>
          </div>
        ) : (
          <div className="w-full p-20 flex items-center justify-center">
            <h1>{result}</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUser;
