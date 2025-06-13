import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const avatarList = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Christopher",
  "https://api.dicebear.com/9.x/big-smile/svg?seed=Aidan",
  "https://api.dicebear.com/9.x/croodles/svg?seed=Ryker",
  "https://api.dicebear.com/9.x/open-peeps/svg?seed=Sophia",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia",
];

const Register = () => {
  const [err, setErr] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarList[0]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, {
        displayName,
        photoURL: selectedAvatar,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: selectedAvatar,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err.message);
      setErr(true);
    }
  };

  return (
    <div className="formcontainer">
      <div className="formWrapper">
        <span className="logo">Chattrix</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Display name" />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />

          <p style={{
  fontSize: "14px",
  fontWeight: "500",
  color: "#5d5b8d",
  margin: "10px 0 0"
}}>
  👾 Choose your vibe
</p>

<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "10px 0" }}>
  {avatarList.map((avatar, index) => (
    <img
      key={index}
      src={avatar}
      alt={`avatar-${index}`}
      onClick={() => setSelectedAvatar(avatar)}
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        cursor: "pointer",
        border: selectedAvatar === avatar ? "2px solid #8da4f1" : "2px solid transparent",
      }}
    />
  ))}
</div>


          <button type="submit">Sign up</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
