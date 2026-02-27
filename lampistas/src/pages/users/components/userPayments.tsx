
import { useState } from "react";
import { Elements } from '@stripe/react-stripe-js';
import api from "../../../api/intercepttors";
import { loadStripe } from '@stripe/stripe-js';
import  UserCheckoutForm from "./userChekcout";
import { useTranslation } from "react-i18next";


type UserPaymentsProps = {
    userID: number;
    ammount: number;
    companyID: number;
};

export default function UserPayments({ userID, ammount , companyID }: UserPaymentsProps) {
    const { t } = useTranslation("users.paymentsPage");
    const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
    const [clientSecret, setClientSecret] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
  
    // Obtener publishable key solo una vez
    useState(() => {
        api.get('/payments/config').then(config => {
            const { publishedKey } = config.data;
            if (typeof publishedKey === 'string' && publishedKey.startsWith('pk_')) {
                setStripePromise(loadStripe(publishedKey));
            }
        });
    });

   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Enviar los datos necesarios al backend
            const subscription = await api.post('/payments/create-payment', {
                ammount: ammount,
                userID,
                companyID,
            }).then(res => res.data);
            setClientSecret(subscription.clientSecret);
            setFormSubmitted(true);
        } catch (error) {
            alert(`${t("subscriptionError")}: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    const options = {
        clientSecret: clientSecret,
        theme: 'stripe',
    };


    if (loading) return <div>{t("loading")}</div>;

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', color: '#1e40af', marginBottom: 24 }}>{t("title")}</h1>
           
            {/* Botón para crear el PaymentIntent y mostrar el formulario de Stripe */}
            {!formSubmitted && (
                <button
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-2 rounded-lg shadow transition-colors duration-200 disabled:bg-primary-300 disabled:text-white disabled:opacity-100 text-base"
                    onClick={handleSubmit}
                >
                    Pagar
                </button>
            )}
            {/* Mostrar el formulario de Stripe solo si ya tenemos clientSecret y formSubmitted */}
            {stripePromise && clientSecret && formSubmitted && (
                <div style={{ marginTop: 16 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, textAlign: 'center', color: '#2563eb' }}>{t("cardTitle")}</h2>
                    <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 24 }}>{t("cardSubtitle")}</p>
                    <Elements stripe={stripePromise} options={options}>
                        <UserCheckoutForm companyID={companyID} ammount={ammount} userID={userID} />
                    </Elements>
                </div>
            )}
        </div>
    );
}

