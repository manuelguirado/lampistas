import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput } from '@fullcalendar/core';

interface CalendarProps {
  events: EventInput[];
}

export default function Calendar({ events }: CalendarProps) {
  return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-4">
      <style>{`
        /* Estilos responsive para FullCalendar */
        .fc .fc-toolbar {
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .fc .fc-toolbar-chunk {
          display: flex;
          gap: 0.25rem;
        }
        
        .fc .fc-button {
          padding: 0.25rem 0.5rem !important;
          font-size: 0.75rem !important;
        }
        
        .fc .fc-toolbar-title {
          font-size: 1rem !important;
          margin: 0.5rem 0;
        }
        
        @media (min-width: 768px) {
          .fc .fc-button {
            padding: 0.4rem 0.8rem !important;
            font-size: 0.875rem !important;
          }
          
          .fc .fc-toolbar-title {
            font-size: 1.25rem !important;
          }
        }
        
        @media (min-width: 1024px) {
          .fc .fc-button {
            padding: 0.5rem 1rem !important;
            font-size: 1rem !important;
          }
          
          .fc .fc-toolbar-title {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        weekends={true}
        editable={false}
        selectable={true}
        height="auto"
        locale="es"
      />
    </div>
  );
}