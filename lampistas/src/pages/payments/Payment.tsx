

import { useState } from "react";
import { Elements } from '@stripe/react-stripe-js';
import api from "../../api/intercepttors";
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from "./checkoutForm";


export default function Payments() {
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({companyemail : "", price: 30});
    const [formSubmitted, setFormSubmitted] = useState(false);
    console.log("Form data:", form);
    console.log("Client Secret:", clientSecret);
    // Obtener publishable key solo una vez
    useState(() => {
        api.get('/payments/config').then(config => {
            const { publishedKey } = config.data;
            if (typeof publishedKey === 'string' && publishedKey.startsWith('pk_')) {
                setStripePromise(loadStripe(publishedKey));
            }
        });
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        console.log(form);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Form data in submit :', form);
            const subscription = await api.post('/payments/create-subscription', form).then(res => res.data);
            console.log("subcriptsion response:", subscription);
            console.log("Received clientSecret:", subscription.clientSecret);
            console.log("data", subscription); 
            
            setClientSecret(subscription.clientSecret);
            console.log('Received clientSecret:', subscription.clientSecret);
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
    

    if (loading) return <div>Cargando...</div>;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <div style={{ width: 400, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: 32, marginTop: 32 }}>
                {!formSubmitted && (
                    <>
                        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>Datos de la empresa</h2>
                        <form onSubmit={handleSubmit}>
                            
                           
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Email:</label>
                                <input
                                    type="email"
                                    name="companyemail"
                                    value={form.companyemail}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                                    placeholder="Ej:compania@gmail.com"
                                />
                            </div>
                            
                            
                            <button type="submit" style={{ width: '100%', background: '#2563eb', color: '#fff', fontWeight: 600, padding: 12, borderRadius: 8, border: 'none', fontSize: 18, cursor: 'pointer' }}>
                                Pagar
                            </button>
                        </form>
                    </>
                )}
                {stripePromise && clientSecret && formSubmitted && (
                    <div style={{ marginTop: 16 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, textAlign: 'center', color: '#2563eb' }}>Introduce los datos de tu tarjeta</h2>
                        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 24 }}>Completa el pago para activar tu suscripción.</p>
                        <Elements stripe={stripePromise } options={options}>
                            <CheckoutForm  />
                        </Elements>
                    </div>
                )}
            </div>
        </div>
    );
}

