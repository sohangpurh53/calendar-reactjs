import './cal.css'
import React, { useState, useEffect, useRef } from 'react';



function Calendar() {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const tableRef = useRef(null);

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarRows = [];

  let calendarCells = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(<td key={`empty-cell-${i}`}></td>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), day);

    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getDate() === currentDate.getDate();
    });

    calendarCells.push(
      <td key={`day-cell-${day}`} className={currentDate.getTime() === new Date().getTime() ? 'today' : ''}
        onClick={() => setSelectedDate(currentDate)}>
        <span>{day}</span>
        <ul>
          {dayEvents.map((event, index) => (
            <li key={`event-${index}`}>{event.title}</li>
          ))}
        </ul>
        {selectedDate && currentDate.getTime() === selectedDate.getTime() &&
          <input type="text" placeholder="Add event" onKeyDown={event => {
            if (event.key === 'Enter') {
              const newEvents = [...events, { title: event.target.value, date: selectedDate }];
              setEvents(newEvents);
              event.target.value = '';
              setSelectedDate(null);
            }
          }} />}
      </td>
    );

    // Start a new row after the last day of the week (Saturday)
    if (currentDate.getDay() === 6 || day === daysInMonth) {
      calendarRows.push(<tr key={`row-${day}`}>{calendarCells}</tr>);
      calendarCells = [];
    }
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedDate(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tableRef]);

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div className="calendar-container">
      <h2>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
      <table ref={tableRef}>
        <thead>
          <tr>{daysOfWeek.map(dayOfWeek => <th key={`header-${dayOfWeek}`}>{dayOfWeek}</th>)}</tr>
        </thead>
        <tbody>
          {calendarRows}
        </tbody>
      </table>
      
        {events.map((event, index) => (
          <li key={`event-${index}`}>
            <strong>{event.title.toLocaleString()}</strong> <strong>{event.date.toLocaleDateString()} </strong>
          </li>
        ))}
      
      <div className="button-container">
        <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1))}>
          Prev Month
        </button>
        <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1))}>
          Next Month
        </button>
        <button onClick={clearEvents}>
          Clear Events
        </button>
      </div>
    
    </div>
  );
}

export default Calendar;

