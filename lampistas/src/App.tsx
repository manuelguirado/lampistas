import Header from './components/header';
import Footer from './components/footer';
import { Outlet } from 'react-router-dom';


import './App.css'

function App() {


  return (
  
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 mt-20">
          <Outlet />
        </main>
        <Footer />
      </div>
   
   
  )
}

export default App
