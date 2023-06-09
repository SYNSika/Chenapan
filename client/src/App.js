import './App.css';
import SignIn from './Components/SignIn';
import Channels from './Components/Channels';
import {useState} from'react';
import { socket } from './Components/MyCustomSocket';

function App() {
  const [isAuth,setisAuth] = useState(false);
  const [userslist,setusersList] = useState([]);
  const logOut = () => {
    setisAuth(false);
    socket.emit('logout');
  }
  socket.on('userlist', (data) =>{

    setusersList(data);
  });
  return (<div className="App">
    {isAuth? (
      <div>
      <Channels userslist={userslist}/>
      <button onClick={logOut}>Log Out</button>
      </div>
      ):(
      <SignIn setIsAuth={setisAuth}/>
      )}
  </div>
  );
}

export default App;
