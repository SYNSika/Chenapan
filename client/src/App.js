import './App.css';
import SignIn from './Components/SignIn';
import {useState} from'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');
function App() {
  const [isAuth,setisAuth] = useState(false);
  const logOut = () => {
    setisAuth(false);
    socket.emit('logout');
  }
  return (<div className="App">
    {isAuth? (
      <button onClick={logOut}>Log Out</button>
      ):(
      <SignIn setIsAuth={setisAuth}/>
      )}
  </div>
  );
}

export default App;
