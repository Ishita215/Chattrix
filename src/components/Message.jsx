import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isOwner = message.senderId === currentUser.uid;

  return (
    <div ref={ref} className={`message ${isOwner ? "owner" : ""}`}>
      <div className="messageInfo">
        <img
          src={
            isOwner
              ? currentUser.photoURL || "https://via.placeholder.com/40"
              : data.user?.photoURL || "https://via.placeholder.com/40"
          }
          alt=""
        />
        <span>
          {new Date(message.date?.seconds * 1000).toLocaleTimeString()}
        </span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
      </div>
    </div>
  );
};

export default Message;
