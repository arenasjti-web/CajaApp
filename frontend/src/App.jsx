import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';


function App() {

  const notify = () => toast('Here is your toast.');
  return (
    <>
      <button className="btn bg-accent" onClick={notify}>Make me a toast</button>
      <Toaster position="top-center" />
      <div>App</div>
   </>
  )
}

export default App
