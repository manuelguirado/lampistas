import Header from './components/header';
import Chartjs from 'chart.js/auto';
import api from '../../api/intercepttors';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";

export default function AdminHome() {
    const { t } = useTranslation("admin.homePage");
    const [companies, setCompanies] = useState<number[]>([]);
    const [clients, setClients] = useState<number[]>([]);
    const [incidents, setIncidents] = useState<number[]>([]);
    const [totalCompanies, setTotalCompanies] = useState<number>(0);
    const [totalClients, setTotalClients] = useState<number>(0);
    // Helper para convertir objeto {1: 2, 2: 3, ...} en array de 12 meses
    const objectToMonthlyArray = (obj: Record<string, number>) => {
        const arr = Array(12).fill(0);
        Object.entries(obj || {}).forEach(([key, value]) => {
            const idx = parseInt(key, 10) - 1;
            if (idx >= 0 && idx < 12) arr[idx] = value;
        });
        return arr;
    };
    const companiesChartRef = useRef<Chartjs | null>(null);
    const clientsChartRef = useRef<Chartjs | null>(null);
    const incidentsChartRef = useRef<Chartjs | null>(null);
    const token = localStorage.getItem('adminToken');
    const months = t("months", { returnObjects: true }) as string[];
   

    useEffect(() => {
        
        api.get('/admin/activeCompanies', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            setTotalCompanies(res.data.totalCompanies || 0);
            const monthlyArr = objectToMonthlyArray(res.data.monthlyCompanies);
            // Si monthlyCompanies está vacío pero hay totalCompanies, ponlo en el mes actual
            if (monthlyArr.every(v => v === 0) && res.data.totalCompanies > 0) {
                const now = new Date();
                monthlyArr[now.getMonth()] = res.data.totalCompanies;
            }
            setCompanies(monthlyArr);
        }).catch((error) => {
            console.error('Error fetching companies:', error);
        });
    }, []);

    useEffect(() => {
        if (companies.length === 12) {
            const ctx = document.getElementById('companiesChart') as HTMLCanvasElement | null;
            if (ctx) {
                if (companiesChartRef.current) {
                    companiesChartRef.current.destroy();
                }
                companiesChartRef.current = new Chartjs(ctx, {
                    type: 'bar',
                    data: {
                        labels: months,
                        datasets: [{
                            label: t("datasetCompanies"),
                            data: companies,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: t("companiesChart") }
                        }
                    }
                });
            }
        }
        return () => {
            if (companiesChartRef.current) {
                companiesChartRef.current.destroy();
                companiesChartRef.current = null;
            }
        };
    }, [companies]);
    useEffect(() => {
        api.get('/admin/activeIncidents', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            setIncidents(res.data.monthlyIncidents);
        }).catch((error) => {
            console.error('Error fetching incidents:', error);
        });
    }, []);
    useEffect(() => {
        if (incidents.length === 12) {
            const ctx = document.getElementById('incidentsChart') as HTMLCanvasElement | null;
            if (ctx) {
                if (incidentsChartRef.current) {
                    incidentsChartRef.current.destroy();
                }
                incidentsChartRef.current = new Chartjs(ctx, {
                    type: 'bar',
                    data: {
                        labels: months,
                        datasets: [{
                            label: t("datasetIncidents"),
                            data: incidents,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: t("incidentsChart") }
                        }
                    }
                });
            }
        }
        return () => {
            if (incidentsChartRef.current) {
                incidentsChartRef.current.destroy();
                incidentsChartRef.current = null;
            }
        };
    }, [incidents]);
    useEffect(() => {
        api.get('/admin/activeClients', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            setTotalClients(res.data.totalClients || 0);
            const monthlyArr = objectToMonthlyArray(res.data.monthlyClients || res.data.monthlyCompanies);
            if (monthlyArr.every(v => v === 0) && (res.data.totalClients || res.data.totalCompanies) > 0) {
                const now = new Date();
                monthlyArr[now.getMonth()] = res.data.totalClients || res.data.totalCompanies;
            }
            setClients(monthlyArr);
        }).catch((error) => {
            console.error('Error fetching clients:', error);
        });
    }, []);
    useEffect(() => {
        if (clients.length === 12) {
            const ctx = document.getElementById('clientsChart') as HTMLCanvasElement | null;
            if (ctx) {
                if (clientsChartRef.current) {
                    clientsChartRef.current.destroy();
                }
                clientsChartRef.current = new Chartjs(ctx, {
                    type: 'bar',
                    data: {
                        labels: months,
                        datasets: [{
                            label: t("datasetClients"),
                            data: clients,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: t("clientsChart") }
                        }
                    }
                });
            }
        }
        return () => {
            if (clientsChartRef.current) {
                clientsChartRef.current.destroy();
                clientsChartRef.current = null;
            }
        };
    }, [clients]);

    return (
        <><div className='w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8'>
            <Header />
            <h1 className='text-3xl font-bold text-amber-800 mb-6'>{t("title")}</h1>
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6' id='companies'>
                <h2 className='text-2xl font-semibold text-amber-800 mb-4'>{t("companiesOverview")}</h2>
                <p className='text-gray-700 text-lg'>{t("totalCompanies")}: <span className='font-bold text-amber-600'>{totalCompanies}</span></p>

            </div>
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-8'>
                <h2 className='text-2xl font-semibold text-amber-800 mb-4'>{t("companiesChart")}</h2>
                <canvas id="companiesChart"></canvas>
            </div>
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-8'>
                <h2 className='text-2xl font-semibold text-amber-800 mb-4'>{t("incidentsOverview")}</h2>
                <p className='text-gray-700 text-lg'>{t("totalIncidents")}: <span className='font-bold text-amber-600'>{incidents.reduce((a, b) => a + b, 0)}</span></p>
            </div>
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-8'>
                <h2 className='text-2xl font-semibold text-amber-800 mb-4'>{t("incidentsChart")}</h2>
                <canvas id="incidentsChart"></canvas>
            </div>
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-8'></div>
            <h2 className='text-2xl font-semibold text-amber-800 mb-4'>{t("clientsOverview")}</h2>
            <p className='text-gray-700 text-lg'>{t("totalClients")}: <span className='font-bold text-amber-600'>{totalClients}</span></p>
        </div><div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-8'>
                <h2 className='text-2xl font-semibold text-amber-800 mb-4'>{t("clientsChart")}</h2>
                <canvas id="clientsChart"></canvas>
            </div></>

    );
}


