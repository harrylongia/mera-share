import { useEffect, useState } from 'react'
import './App.css'
import Index from './components/Index'
import Home from './components/Home'

function App() {
  const [url, setUrl] = useState("")

  useEffect(()=>{
    let url = window.location.pathname.split("/")[1];
    setUrl(url);
  },[])
  return (
    <>
      {url==""?<Home></Home>:<Index url = {url}></Index> }
      </>
  )
}

export default App
