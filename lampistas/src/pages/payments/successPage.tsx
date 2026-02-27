import Header from "../../components/header";

export default function SuccessPage() {
  return (
    <div className="bg-white/80 w-full min-h-screen flex flex-col items-center justify-center p-8">
      <Header />
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 mt-24 flex flex-col items-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500 mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7L10.5 17L4 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-700 mb-2 text-center">¡Pago realizado con éxito!</h2>
        <p className="text-gray-700 text-center mb-4">
          En breves le llegará un correo con los datos para poder empezar a usar la plataforma.
        </p>
        <a href="/user/userLogin" className="mt-4 w-full">
          <button className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-amber-600 transition-colors shadow">
            Ir al login
          </button>
        </a>
      </div>
    </div>
  );
}