import React, { lazy, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
const List = lazy(() => import("./components/list/List"));
const Chat = lazy(() => import("./components/chat/Chat"));
const Detail = lazy(() => import("./components/detail/Detail"));
const Login = lazy(() => import("./components/login"));
const Notification = lazy(() => import("./components/notification"));
const Loader = lazy(() => import("./components/Loader"));

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex main w-[90vw] h-[90vh] bg-opacity-75 bg-darkBlue/50 backdrop-filter backdrop-blur-md">
      {currentUser ? (
        <>
          <List />
          {chatId ? (
            <Chat />
          ) : (
            <div className="w-full h-screen flex items-center justify-center">
              <h1 className="text-lg font-medium bg-darkBlue/60 py-2 px-4 rounded-[40px]">
                select or add user to chat
              </h1>
            </div>
          )}
          <Detail />
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
