import { Outlet } from 'react-router';
import Navbar from './pages/Navbar';

function App() {

  return (
    <>
      <Navbar />
      <main className='mt-15'>
        <Outlet />
      </main>
    </>
  )
}

export default App