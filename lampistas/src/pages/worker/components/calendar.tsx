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
    <div className="w-full max-w-6xl mx-auto p-4">
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