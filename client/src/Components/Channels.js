import React, { useCallback } from 'react'
import { socket } from './MyCustomSocket'

function Channels({userslist}) {
  let filteredList = userslist.filter(user => user.id!== socket.id)
  userslist = filteredList.map(user => user.username)
  const onClickHandler = (e) => {
    console.log(e.target.getAttribute('data-item'))
  }

  const generateUserList = function({userslist}) {
    if(userslist.length === 0) {return <div>No users Connected</div>}
    const generateRow = rowData => (<tr data-item={rowData} onClick={onClickHandler}>{rowData}</tr>)
    return (
      <table>
        <tbody>
          {userslist.map(user => generateRow(user))}
        </tbody>
      </table>
    )
  }
  
  return (
    <div className='channels'>
      <h2>Connected users</h2>
      {generateUserList({userslist})}
    </div>
  )
}

export default Channels