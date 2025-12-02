import { useEffect, useState } from 'react';
import Header from '../worker/components/header';
import Calendar from './components/calendar';
import type { EventInput } from '@fullcalendar/core';
import type { Shift } from '../../types/shitfts';
export default function WorkerShifts() {
  const [shifts, setShifts] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('workerToken');

  useEffect(() => {
    if (!token) return;

    // Fetch guardias del trabajador
    fetch('http://localhost:3000/worker/myShifts', {
        method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
       
        
        // Transformar los datos del backend a formato FullCalendar
        const events: EventInput[] = data.shifts.map((shift: Shift) => ({
          id: shift.ShiftID,
          title: shift.shiftType || 'Guardia',
          start: shift.startDate,
          end: shift.endDate,
          backgroundColor: getShiftColor(shift.shiftType),
          borderColor: getShiftColor(shift.shiftType),
        }));
        setShifts(events);
      })
      .catch(err => console.error('Error fetching shifts:', err))
      .finally(() => setLoading(false));
  }, [token]);

  function getShiftColor(shiftType: string): string {
    const colors: Record<string, string> = {
      morning: '#fbbf24',    // amarillo
      afternoon: '#f97316',  // naranja
      night: '#1e40af',      // azul oscuro
      fullday: '#10b981'     // verde
    };
    return colors[shiftType] || '#6b7280'; // gris por defecto
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando guardias...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 pt-24">
        <h2 className="text-3xl font-bold mb-6">Mis Guardias</h2>
        
        {/* Leyenda */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm">Mañana</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm">Tarde</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-900 rounded"></div>
            <span className="text-sm">Noche</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Día completo</span>
          </div>
        </div>

        {/* Calendario */}
        <Calendar events={shifts} />
      </div>
    </div>
  );
}