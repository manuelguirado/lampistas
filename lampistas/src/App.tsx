

import { useEffect } from 'react';
import Footer from './components/footer';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { setupAllAutoRefresh } from './utils/authUtils';

import './App.css'

function App() {
  useEffect(() => {
    // Configurar auto-refresh para todos los tipos de usuario logueados
    const cleanup = setupAllAutoRefresh();
    return cleanup; // Limpiar todos los intervalos al desmontar
  }, []);

  return (
    <div className=" flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            duration: 1000,
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