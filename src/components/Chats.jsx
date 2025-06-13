import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) return;

    const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      const data = doc.data();
      if (data) {
        const sortedChats = Object.entries(data).sort(
          (a, b) => b[1]?.date?.seconds - a[1]?.date?.seconds
        );
        setChats(sortedChats);
      }
    });

    return () => unsub();
  }, [currentUser]);

  const handleSelect = async (user) => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    dispatch({ type: "CHANGE_USER", payload: { currentUser, user } });

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [combinedId + ".seen"]: true,
    });
  };

  if (!currentUser) return null;

  return (
    <div className="chats">
      {chats.map(([chatId, chatData]) => {
        const isUnread = chatData.seen === false;

        return (
          <div
            className="userChat"
            key={chatId}
            onClick={() => handleSelect(chatData.userInfo)}
          >
            <img
              src={
                chatData.userInfo?.photoURL ||
                "https://ui-avatars.com/api/?name=" + chatData.userInfo?.displayName
              }
              alt="User"
            />
            <div className="userChatinfo">
              <span>
                {chatData.userInfo?.displayName}
                {isUnread && (
                  <span
                    style={{
                      display: "inline-block",
                      marginLeft: "8px",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                    }}
                  ></span>
                )}
              </span>
              <p>{chatData.lastMessage?.text?.slice(0, 30) || "No messages yet"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
