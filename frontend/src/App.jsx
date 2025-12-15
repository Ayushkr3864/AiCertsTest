import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Routes } from 'react-router'
import CreateProject from './components/Certitificates'
import UploadBatchZip from './components/BatchZip'
import IssuanceDashboard from './components/Dashboard'
import Home from './components/home'
import AdminLogin from './components/AdminLogin'
import Protected from './components/Protected'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="login" element={<AdminLogin />}></Route>
        <Route
          path="/create-project"
          element={
            <Protected>
              <CreateProject />
            </Protected>
          }
        ></Route>
        <Route
          path="/upload-batch"
          element={
            <Protected>
              <UploadBatchZip />
            </Protected>
          }
        ></Route>
        <Route
          path="/dashboard"
          element={
            <Protected>
              <IssuanceDashboard />
            </Protected>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App
