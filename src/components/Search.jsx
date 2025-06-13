import React, { useState, useContext } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    setErr(false);
    setResults([]);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = [];

      querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (
          user.displayName &&
          user.displayName.toLowerCase().includes(username.toLowerCase().trim()) &&
          user.uid !== currentUser.uid
        ) {
          users.push(user);
        }
      });

      setResults(users);
    } catch (err) {
      console.error(err);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async (user) => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }

      dispatch({ type: "CHANGE_USER", payload: { currentUser, user } });

      setUsername("");
      setResults([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>

      {err && <span>User not found</span>}

      {results.map((user) => (
        <div
          className="userChat"
          key={user.uid}
          onClick={() => handleSelect(user)}
        >
          <img src={user.photoURL || "https://via.placeholder.com/40"} alt="" />
          <div className="userChatinfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Search;
