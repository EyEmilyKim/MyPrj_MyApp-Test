import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import './HomePage.css';
import Login from './Login';
import Logout from './Logout';
import Loader from '../util-components/Loader';

export default function HomePage() {
  const { isLoggingIn, isLogin } = useContext(LoginContext);
  const { user } = useContext(LoginContext);

  return (
    <div className="home-body">
      <h1 className="home-title">MyApp-test HomePage</h1>

      {isLoggingIn ? (
        <Loader />
      ) : !isLogin ? (
        <div className="nonLoggedIn-area">
          <Login />
        </div>
      ) : (
        <div className="loggedIn-area">
          <p className="welcome-userName">
            반갑습니다 {user.name || user.email}님~~ !
          </p>
          <Logout />
        </div>
      )}
    </div>
  );
}
