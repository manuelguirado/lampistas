import Header from "../../../components/header";
import { FormEvent, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router";


type CheckoutFormProps = {
  companyID: number;
  ammount: number;
  userID: number;
};

const UserCheckoutForm = ({
  companyID,
  ammount,
  userID,
}: CheckoutFormProps) => {
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setError("");
    setMessage("");
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:5173/user/payment/success",
        },
        redirect: "if_required",
      });
      if (
        error &&
        (error.type === "card_error" || error.type === "validation_error")
      ) {
        setError(error.message || "");
      } else if (error) {
        setError("Ha ocurrido un error inesperado.");
      } else {
        setMessage("¡Pago realizado correctamente!");
        // Redirigir automáticamente al success page
        setTimeout(() => {
          navigate("/user/payment/success");
        }, 1200);
      }
    } catch (err) {
      setError("Error desconocido");
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-xs mx-auto p-0 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl mt-10 border border-blue-100">
      <Header />
      <div className="flex flex-col items-center gap-1 py-4 px-4 border-b border-blue-100">
        <div className="flex items-center gap-2 mb-1">
          <svg
            className="w-6 h-6 text-primary-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6c0-2.21 3.582-4 8-4s8 1.79 8 4v8c0 2.21-3.582 4-8 4z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-800">
            Realizar el pago 
          </h2>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-extrabold text-primary-600">
            {ammount}€
          </span>
        </div>
        
      </div>
      <form
        className="px-4 pt-4 pb-4"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <PaymentElement />
        </div>
        <button
          disabled={isProcessing || !stripe || !elements}
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-2 rounded-lg shadow transition-colors duration-200 disabled:opacity-50 text-base"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Procesando...
            </span>
          ) : (
            `Suscribirse por ${ammount}€`
          )}
        </button>
        {error && <div className="text-red-600 mt-2 text-center text-sm">{error}</div>}
        {message && (
          <div
            className="text-green-600 mt-2 text-center text-sm"
            onClick={() => navigate("/payments/success")}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default UserCheckoutForm;
