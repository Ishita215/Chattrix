import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

const INITIAL_STATE = {
  chatId: null,
  user: null,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_USER":
      const currentUser = action.payload.currentUser;
      const selectedUser = action.payload.user;
      const chatId =
        currentUser.uid > selectedUser.uid
          ? currentUser.uid + selectedUser.uid
          : selectedUser.uid + currentUser.uid;

      return {
        user: selectedUser,
        chatId,
      };

    default:
      return state;
  }
};

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
