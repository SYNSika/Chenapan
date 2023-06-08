import React from 'react'

function Channels(userslist) {
    const listUsers = Array.from(userslist)

  return (
    <div className='channels'>
      <h2>Connected users</h2>
      <table>
        <thead>
          <tr>Username</tr>
        </thead>
        <tbody>
          {listUsers.map(user => (
            <tr>
              {user.username}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Channels