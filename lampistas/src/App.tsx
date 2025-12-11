

import Footer from './components/footer';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './App.css'

function App() {
  return (
    <div className="min-h-screen max-w-screen flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: 'white',
            },
          },
        }}
      />
      <main className="flex-grow container mx-auto px-4  pt-16 ">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App