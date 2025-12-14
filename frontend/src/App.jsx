import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Routes } from 'react-router'
import CreateProject from './components/Certitificates'
import UploadBatchZip from './components/BatchZip'
import IssuanceDashboard from './components/Dashboard'
import Home from './components/home'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/create-project" element={<CreateProject />}></Route>
        <Route path="/upload-batch" element={<UploadBatchZip />}></Route>
        <Route path="/dashboard" element={<IssuanceDashboard />}></Route>
      </Routes>
    </>
  );
}

export default App
