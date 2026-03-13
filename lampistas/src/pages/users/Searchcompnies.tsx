import { useEffect, useState } from 'react';
import Header from './components/header';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import type { Company } from '../../types/companiesType';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../../config/baseUrl';
export default function Searchcompnies() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation('users.searchCompaniesPage');

    const token = localStorage.getItem('userToken');
    async function hireCompany(companyEmail: string) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/user/hireCompany`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ companyEmail }),
                },
            );

            if (!response.ok) {
                throw new Error(t('hireError'));
            }

            toast.success(t('hireSuccess'));
            navigate('/user/userDashboard');
        } catch (err) {
            toast.error((err as Error).message || t('hireUnexpectedError'));
        }
    }

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${API_BASE_URL}/user/searchCompanies`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error(t('loadError'));
                }

                const data = await response.json();
                setCompanies(data.companies || []);
            } catch (err) {
                setError((err as Error).message || t('unexpectedError'));
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [token, t]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24 md:px-6">
                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                        {t('title')}
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 md:text-base">
                        {t('subtitle')}
                    </p>
                </section>

                {loading && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <p className="text-slate-600">{t('loading')}</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
                        <p className="font-medium text-red-700">{error}</p>
                    </div>
                )}

                {!loading && !error && companies.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <p className="text-slate-600">{t('empty')}</p>
                    </div>
                )}

                {!loading && !error && companies.length > 0 && (
                    <ul className="grid gap-4 md:grid-cols-2">
                        {companies.map((company: Company) => (
                            <li
                                key={company.companyID}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-slate-800 md:text-xl">
                                        {company.name}
                                    </h2>
                                </div>

                                <div className="space-y-1 text-sm text-slate-600">
                                    <p>
                                        <span className="font-medium text-slate-700">{t('email')}</span>{' '}
                                        {company.email}
                                    </p>
                                    <p>
                                        <span className="font-medium text-slate-700">{t('phone')}</span>{' '}
                                        {company.phone}
                                    </p>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {company.directions.map((direction, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700"
                                        >
                                            <p>{direction.address}</p>
                                            <p>
                                                {direction.city}, {direction.state}
                                            </p>
                                            <p>
                                                {t('zipCode')} {direction.zipCode}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className="mt-5 w-full rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-white transition hover:bg-amber-600"
                                    onClick={() => hireCompany(company.email)}
                                >
                                    {t('hireButton')}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}