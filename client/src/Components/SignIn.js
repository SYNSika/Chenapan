import { useState} from 'react'
import { socket,} from './MyCustomSocket';

function SignIn({setIsAuth}) {
    const [pseudo, setPseudo] = useState('');
    const signin = (event) => {
        socket.emit('signin', pseudo, (error) => {
          if (error) {
            alert(error)
          }
        })
        setIsAuth(true);
    }
  return (
    <div className='signIn'>
        <label SignIn>Sign In</label>
        <input placeholder='pseudo' onChange={(event) => {
            setPseudo(event.target.value)
        }}/>
        <button onClick={signin}>Sign In</button>
    </div>
  )
}

export default SignIn