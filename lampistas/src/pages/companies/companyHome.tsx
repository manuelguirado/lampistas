import Header from './components/header';
import Chartjs from 'chart.js/auto';
import api from '../../api/intercepttors';
import { useState, useEffect, useRef } from 'react';

export default function CompanyHome() {
    const [earnings, setEarnings] = useState<number[]>([]);
    const [incidents, setIncidents] = useState<number[]>([]);
    const earningsChartRef = useRef<Chartjs | null>(null);
    const incidentsChartRef = useRef<Chartjs | null>(null);
    const token = localStorage.getItem('companyToken');
   

    useEffect(() => {
        
        api.get('/company/companyEarnings', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            
            
            setEarnings(res.data.monthlyEarnings);
        }).catch((error) => {
            console.error('Error fetching earnings:', error);
        });
    }, []);

    useEffect(() => {
        if (earnings.length === 12) {
            const ctx = document.getElementById('earningsChart') as HTMLCanvasElement | null;
            if (ctx) {
                if (earningsChartRef.current) {
                    earningsChartRef.current.destroy();
                }
                earningsChartRef.current = new Chartjs(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                        datasets: [{
                            label: 'Mis ganancias',
                            data: earnings,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Ganancias Mensuales' }
                        }
                    }
                });
            }
        }
        return () => {
            if (earningsChartRef.current) {
                earningsChartRef.current.destroy();
                earningsChartRef.current = null;
            }
        };
    }, [earnings]);
    useEffect(() => {
        api.get('/company/closedIncidents', {
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
                        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                        datasets: [{
                            label: 'Incidentes cerrados',
                            data: incidents,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Incidentes Cerrados Mensuales' }
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

    return (
        <div className='w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8'>
            <Header />
            <h1 className='text-3xl font-bold text-amber-800 mb-6'>Welcome to your Company Dashboard</h1>
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6' id='earnings'>
                <h2 className='text-2xl font-semibold text-amber-800 mb-4'>Earnings Overview</h2>
                <p className='text-gray-700 text-lg'>Total Earnings: <span className='font-bold text-amber-600'>${earnings.reduce((a, b) => a + b, 0).toFixed(2)}</span></p>
                
            </div>
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-8'>
                <h2 className='text-2xl font-semibold text-amber-800 mb-4'>Monthly Earnings Chart</h2>
                <canvas id="earningsChart"></canvas>
            </div>
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-8'>
                <h2 className='text-2xl font-semibold text-amber-800 mb-4'>Closed Incidents Overview</h2>
                <p className='text-gray-700 text-lg'>Total Closed Incidents: <span className='font-bold text-amber-600'>{incidents.reduce((a, b) => a + b, 0)}</span></p>
            </div>
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-8'>
                <h2 className='text-2xl font-semibold text-amber-800 mb-4'>Monthly Closed Incidents Chart</h2>
                <canvas id="incidentsChart"></canvas>
            </div>  
        </div>
    );
}



