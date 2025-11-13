

import Footer from './components/footer';
import { Outlet } from 'react-router-dom';

import './App.css'

function App() {
  return (
    <div className="min-h-screen max-w-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4  pt-16 ">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App