import { createContext, useState, useEffect, useRef } from "react";

interface LoginContextType {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultLoginContext: LoginContextType = {
  isLogin: false,
  setIsLogin: () => {},
};

export const LoginContext =
  createContext<LoginContextType>(defaultLoginContext);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <LoginContext.Provider
      value={{
        isLogin,
        setIsLogin,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
