"use client";

import { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";

import timeGridPlugin from "@fullcalendar/timegrid";

import interactionPlugin from "@fullcalendar/interaction";

import { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { addBooking, deleteBooking, getBookings } from "../actions/bookings";

const Calendar = () => {
  const [bookings, setBookings] = useState<EventInput[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [newBookingTitle, setNewBookingTitle] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);

  // Fetch bookings from server on mount

  useEffect(() => {
    async function fetchBookings() {
      const data = await getBookings();

      setBookings(data);
    }

    fetchBookings();
  }, []);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);

    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);

    setNewBookingTitle("");
  };

  const handleBookingClick = async (selected: EventClickArg) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${selected.event.title}"?`
      )
    ) {
      await deleteBooking(selected.event.id);

      setBookings((prev) =>
        prev.filter((event) => event.id !== selected.event.id)
      );
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newBookingTitle && selectedDate) {
      const newBooking = {
        id: `${selectedDate.start.toISOString()}-${newBookingTitle}`,

        title: newBookingTitle,

        start: selectedDate.start.toISOString(),

        end: selectedDate.end?.toISOString(),
      };

      await addBooking(newBooking);

      setBookings((prev) => [...prev, newBooking]);

      handleCloseDialog();
    }
  };

  return (
    <>
      <div>
        <FullCalendar
          height="auto"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          slotLabelFormat={{
            hour: "2-digit",

            minute: "2-digit",

            hour12: false,
          }}
          eventTimeFormat={{
            hour: "2-digit",

            minute: "2-digit",

            hour12: false,
          }}
          slotMinTime="07:00:00"
          slotMaxTime="24:00:00"
          weekends={true}
          allDaySlot={false}
          select={handleDateClick}
          eventClick={handleBookingClick}
          headerToolbar={{
            left: "prev,next today",

            center: "title",

            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={bookings} // Use server bookings
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Booking</DialogTitle>

            <form onSubmit={handleAddBooking}>
              <input
                type="text"
                value={newBookingTitle}
                onChange={(e) => setNewBookingTitle(e.target.value)}
                required
              />

              <button type="submit">Add</button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;
