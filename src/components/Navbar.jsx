import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className='navbar'>
      <span className='logo'>Chattrix</span>
      <div className='user'>
        <img
          src={
            currentUser?.photoURL?.trim()
              ? currentUser.photoURL
              : `https://ui-avatars.com/api/?name=${currentUser?.displayName || "User"}`
          }
          alt="User"
        />
        <span>{currentUser?.displayName}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
