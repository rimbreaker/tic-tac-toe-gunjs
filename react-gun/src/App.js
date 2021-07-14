import {useEffect,useState,useReducer} from 'react'
import Gun from 'gun'
import BoardRoom from './BoardRoom'

const gun =Gun({
  peers:[
    'http://localhost:3030/gun'
  ]
})

const initialState={
  rooms:{}
}

const reducer=(state,room)=>{
  return{
    rooms:{
      ...state.rooms,
      [room.roomName]:room
    }
  }
}

const App=()=>{
  const [roomNameInput,setRoomNameInput]=useState('')
  const [inRoom,setInRoom]=useState(0)

  const [localRooms,dispatch]=useReducer(reducer,initialState)
  const [roomRef,setRoomRef]=useState(null)
  
  useEffect(()=>{
         const rooms=gun.get('rooms')
         rooms.map()
         .on((room,id)=>{
           if(room!==null)
           dispatch({
             id:id,
             roomName:room.roomName,
             userAmount:room.userAmount
           })
          
         })
         
         setRoomRef(rooms)
       },[])

  const onChange=(e)=>{
    setRoomNameInput(e.target.value)
  }

  const submitName =  ()=>{

    const currentRoom = localRooms.rooms[roomNameInput]
    if(currentRoom)
    {
      if(currentRoom.userAmount<2){
        roomRef.get(currentRoom.id)
        .put({
          ...currentRoom,
          userAmount:currentRoom.userAmount+1
        })
        setInRoom(2)
      }else{
        setInRoom(3)
      }
    }
    else{
      roomRef.set(
        {roomName:roomNameInput,
          userAmount:1
        })
        setInRoom(1)
    }
  }

  const deleteRoom=(room)=>{
    roomRef.get(room.id).put(null)
    window.location.reload()
  }

  return(
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
      <div>
      <input
      onChange={onChange}
      placeholder="Room Name"
      name='roomName'
      value={roomNameInput}
      />
      <button onClick={submitName}>join/create room</button>
      {inRoom===1 && <><p>you created a room</p><BoardRoom roomName={roomNameInput} playerNumber={1}/></>}
      {inRoom===2 && <><p>you are in a room </p><BoardRoom roomName={roomNameInput} playerNumber={2}/></>}
      {inRoom===3 && <p>there are too many players in this room</p>}
      </div>
      <ol>
       {
        localRooms.rooms && Object.values(localRooms.rooms).map(room => (
        <li>
          <p>name: {room.roomName}</p>
          <p>players amount: {room.userAmount}</p>
          <span>delete room?<button onClick={()=>deleteRoom(room)}>delete</button></span>
          <br/>
        </li>
      ))
      } 
      </ol>
    </div>
  )
}

 export default App