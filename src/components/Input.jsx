import React, { useContext, useState } from "react";
import {
  Timestamp,
  arrayUnion,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Input = () => {
  const [text, setText] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (!text.trim()) return;

    const messageId = uuid();

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: messageId,
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });

    const lastMessage = {
      text,
    };

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: lastMessage,
      [data.chatId + ".date"]: serverTimestamp(),
      [data.chatId + ".seen"]: true,
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: lastMessage,
      [data.chatId + ".date"]: serverTimestamp(),
      [data.chatId + ".seen"]: false,
    });

    setText("");
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
