import { useState} from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

function SignIn({setIsAuth}) {
    const [pseudo, setPseudo] = useState('');
    const signin = (event) => {
        socket.emit('signin', pseudo)
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