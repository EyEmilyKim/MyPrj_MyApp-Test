import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  console.log('isLogin', isLogin);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 이벤트 처리하는 함수
  const handleLogin = async (email, password) => {
    console.log('handleLogin called', email);
    try {
      const res = await axios({
        url: `http://localhost:1234/user/login`,
        method: 'POST',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          email: email,
          password: password,
        },
      });
      if (res.status === 200) {
        alert('로그인 성공 !', res.data.user);
        // console.log('로그인 성공 !', res.data.user);
        setIsLogin(true);
        setUser(res.data.user);
      } else {
        alert('로그인 실패..', res.error);
        console.log('로그인 실패..', res.error);
      }
    } catch (error) {
      console.error('handleLogin error', error);
      alert('Login failed. Please try again.');
    }
  };

  // 로그아웃 이벤트 처리하는 함수
  const handleLogout = async () => {
    console.log('handleLogout called');
    // if (socket) {
    //   socket.emit('logout');
    // }
    try {
      const res = await axios({
        url: `http://localhost:1234/user/logout`,
        method: 'POST',
        withCredentials: true,
      });
      if (res.status === 200) {
        alert('로그아웃 성공!');
        setIsLogin(false);
        setUser(null);
      } else {
        alert('로그아웃 실패..', res.error);
        console.log('로그아웃 실패..', res.error);
      }
    } catch (error) {
      console.error('handleLogout error', error);
      alert('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios({
          url: 'http://localhost:1234/user/auth',
          method: 'GET',
          withCredentials: true,
        });
        if (result.data) {
          setIsLogin(true);
          setUser(result.data.user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const contextValue = {
    isLogin,
    user,
    setIsLogin,
    handleLogin,
    handleLogout,
  };

  return isLoading ? null : (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};
