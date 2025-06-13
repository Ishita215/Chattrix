import React, { useContext, useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const bottomRef = useRef();

  useEffect(() => {
    if (!data.chatId) return;

    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages || []);
    });

    return () => unsub();
  }, [data.chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default Messages;
