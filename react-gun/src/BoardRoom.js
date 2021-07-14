import { useEffect,useReducer,useState } from "react";
import Gun from 'gun'

const gun =Gun({
    peers:[
      'http://localhost:3030/gun'
    ]
  })

const initialState={
    collumn1:[0,0,0],
    collumn2:[0,0,0],
    collumn3:[0,0,0]
  }

const reducer=(state,cell)=>{
    
    let tmpCollumn=Object.values(state)[cell.x]
    tmpCollumn[cell.y]=cell.user
    return{...state
    }
}

const BoardRoom = ({roomName,playerNumber})=>{
    const [boardRef,setBordRef]=useState(null)
    const [localBoard,dispatch]=useReducer(reducer,initialState)

  useEffect(()=>{
    const board=gun.get(roomName)
    board.map()
    .on((cell,id)=>{
      if(cell!==null)
      dispatch({
        x:cell.x,
        y:cell.y,
        user:cell.user,
        id
      })

    })
    setBordRef(board)
  },[])
    
  const makeMove =(currentCellValue,x,y)=>{
      if(currentCellValue===0)
      boardRef.set({x:x,y:y,user:playerNumber})
  }

  const printMark=(cell)=>{
      if(cell===1) return "o"
      if(cell===2) return "x"
  }

    return(
        <div style={{border:"red 2px solid",height:"311px",width:"311px",display:"flex"}}>
            {Object.values(localBoard).map((collumn,i)=>(
                <div key={i+10}>
                    {collumn.map((cell,j)=>(
                        <div 
                        key={i+j} 
                        style={{border:"blue 2px solid",height:"100px",width:"100px"}} 
                        onClick={()=>makeMove(cell,i,j)}>
                        <p 
                        style={{
                            textAlign: "center",
                            fontSize: "xxx-large",
                            padding: 0,
                            margin: "auto"}}>{printMark(cell)}</p>
                    </div>
                    ))}
            </div>
            ))}
        </div>
    )
}

export default BoardRoom