import { useEffect, useState } from 'react'



function App() {
  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState([])
  const [loadState, setLoadState]= useState("")
  
  function createNewChat(){
    setMessage(null)
    setValue('')
    setCurrentTitle(null)
  }

  function handleClick(uniqueTitle){
      setCurrentTitle(uniqueTitle)
      setValue('')
      setCurrentTitle(null)
  }

  async function handleSubmit(){
      const options = {
        method : "POST",
        body : JSON.stringify({
          message:value
        }),
        headers: {
          "Content-Type" : "application/json"
        }
      }
      setLoadState("Let me think.....Please Wait....!")
      try{
        const response = await fetch('https://chat-gpt-server-76da.onrender.com/completions', options)
        const data = await response.json()
        console.log(data)
        setMessage(data.choices[0].message)
        setLoadState("")
      }catch(err){
        console.error(err)
      }
  }
 
  console.log(message)
  useEffect(()=>{
    console.log(currentTitle, value, message)
    if(!currentTitle && value && message){
      setCurrentTitle(value)
    }
    if(currentTitle&&value&&message){
      setPreviousChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role : "user",
            content : value
        },{
            title : currentTitle,
            role : message.role,
            content: message.content
        }
      ]
      ))
    }
  },[message, currentTitle])
 const currentChat =  previousChats.filter(previousChats => previousChats.title === currentTitle)
 const uniqueTitles =  Array.from(new Set(previousChats.map(prevChat=>{
  return prevChat.title;
})));

  return (
    <div className="App">
      <section className='sidebar'>
      <button onClick={createNewChat} className='button'> + New Chat</button>
      
      <ul className='history'>
  {uniqueTitles?.map((uniqueTitle, index) => (
    <li key={index} onClick={() => handleClick(uniqueTitle)}>
      {uniqueTitle}
    </li>
  ))}
</ul>

      <nav>
        <p>Made by Bikku BS</p>
      </nav>
      </section>
    
      <section className='main'>
        {!currentTitle&&<h1>My ChatGPT</h1>}
        <h4>{loadState}</h4>
      
          <ul className='feed'>
              {currentChat?.map((chatMessage, index)=><li key={index}>
                <p className='role'>{chatMessage.role}</p>
                <p className='msg'>{chatMessage.content}</p>
              </li>)}
          </ul>
              <div className='bottom-section'></div>
              <div className='input-container'>
                <input value={value} onChange={(e)=>{setValue(e.target.value)}}/>
                <div id="submit" onClick={handleSubmit}>
                  Submit
                </div>
                <p className='info'>
                ChatGPT Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts
                </p>
              </div>



        
      </section>
     
    </div>
  )
}

export default App
