import { Outlet } from 'react-router';
import Navbar from './pages/Navbar';

function App() {

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App