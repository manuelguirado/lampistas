
import { useState } from "react";
import { Elements } from '@stripe/react-stripe-js';
import api from "../../../api/intercepttors";
import { loadStripe } from '@stripe/stripe-js';
import  UserCheckoutForm from "./userChekcout";


type UserPaymentsProps = {
    userID: number;
    ammount: number;
    companyID: number;
};

export default function UserPayments({ userID, ammount , companyID }: UserPaymentsProps) {
    const [stripePromise, setStripePromise] = useState<any>(null);
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
            alert('Error creando la suscripción' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const options = {
        clientSecret: clientSecret,
        theme: 'stripe',
    };
    console.log("clientSecret in UserPayments:", clientSecret);

    if (loading) return <div>Cargando...</div>;

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', color: '#1e40af', marginBottom: 24 }}>Realiza el pago rellenando los datos de la tarjeta</h1>
           
            {/* Botón para crear el PaymentIntent y mostrar el formulario de Stripe */}
            {!formSubmitted && (
                <button
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginBottom: 24,
                    }}
                    onClick={handleSubmit}
                >
                    Pagar ahora
                </button>
            )}
            {/* Mostrar el formulario de Stripe solo si ya tenemos clientSecret y formSubmitted */}
            {stripePromise && clientSecret && formSubmitted && (
                <div style={{ marginTop: 16 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, textAlign: 'center', color: '#2563eb' }}>Introduce los datos de tu tarjeta</h2>
                    <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 24 }}>Completa el pago para activar tu suscripción.</p>
                    <Elements stripe={stripePromise} options={options}>
                        <UserCheckoutForm companyID={companyID} ammount={ammount} userID={userID} />
                    </Elements>
                </div>
            )}
        </div>
    );
}

