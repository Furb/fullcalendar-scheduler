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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<EventInput | null>(
    null
  );
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

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

  const handleBookingClick = (selected: EventClickArg) => {
    setSelectedBooking({
      id: selected.event.id,
      title: selected.event.title,
      start: selected.event.start
        ? selected.event.start.toISOString()
        : undefined,
      end: selected.event.end ? selected.event.end.toISOString() : undefined,
      roomId: selected.event.extendedProps?.roomId,
    });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedBooking(null);
  };
  const handleDeleteBooking = async () => {
    if (selectedBooking && selectedBooking.id) {
      await deleteBooking(selectedBooking.id);
      setBookings((prev) =>
        prev.filter((event) => event.id !== selectedBooking.id)
      );
      handleDeleteDialogClose();
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
        roomId: selectedRoom,
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
          events={bookings.map((booking) => ({
            ...booking,
            extendedProps: {
              roomId: booking.roomId,
            },

            textColor: "black",
            backgroundColor:
              booking.roomId === "room1"
                ? "#baf91a" // Small Room color
                : booking.roomId === "room2"
                ? "#f91adf" // Big Room color
                : booking.roomId === "room3"
                ? "#17ecde" // Cold Room color
                : undefined,
          }))}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meetingroom booking for ...</DialogTitle>

            <form
              onSubmit={handleAddBooking}
              className="flex flex-col w-full mx-auto relative text-gray-600"
            >
              <input
                type="text"
                placeholder="Who's booking?"
                value={newBookingTitle}
                onChange={(e) => setNewBookingTitle(e.target.value)}
                required
                className="placeholder:text-gray-500 text-sm font-semibold pt-3 pb-2 mb-12 mt-8 block w-full px-0 bg-transparent border-b-2 appearance-none focus:outline-none focus:ring-0 border-gray-200"
              />

              <fieldset className="flex space-y-2 gap-2 mb-12">
                <legend className="text-sm font-semibold w-full">
                  Select Room:
                </legend>
                <div className="flex justify-between w-full mb-8">
                  <label
                    htmlFor="room1"
                    className="text-md bg-small py-2 px-4 rounded font-semibold text-gray-500"
                  >
                    <input
                      type="radio"
                      id="room1"
                      name="roomId"
                      value="room1"
                      className="mr-1"
                      checked={selectedRoom === "room1"}
                      onChange={() => setSelectedRoom("room1")}
                      required
                    />
                    Small Room
                  </label>
                  <br />
                  <label
                    htmlFor="room2"
                    className="text-md bg-big py-2 px-4 rounded font-semibold text-gray-500"
                  >
                    <input
                      type="radio"
                      id="room2"
                      name="roomId"
                      value="room2"
                      className="mr-1"
                      checked={selectedRoom === "room2"}
                      onChange={() => setSelectedRoom("room2")}
                    />
                    Big Room
                  </label>
                  <br />
                  <label
                    htmlFor="room3"
                    className="text-md bg-cold py-2 px-4 rounded font-semibold text-gray-500"
                  >
                    <input
                      type="radio"
                      id="room3"
                      name="roomId"
                      value="room3"
                      className="mr-1"
                      checked={selectedRoom === "room3"}
                      onChange={() => setSelectedRoom("room3")}
                    />
                    Cold Room
                  </label>
                </div>
              </fieldset>
              <div className="mb-4">
                {selectedDate && (
                  <div className="mb-4 text-sm font-semibold text-gray-700">
                    <p>Selected Time:</p>
                    <p>
                      {new Intl.DateTimeFormat("en-US", {
                        weekday: "long", // Monday
                        month: "long", // April
                        day: "2-digit", // 14
                      }).format(new Date(selectedDate.start))}
                      , from{" "}
                      {new Date(selectedDate.start).toLocaleTimeString(
                        "en-GB",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }
                      )}{" "}
                      to{" "}
                      {selectedDate.end
                        ? new Date(selectedDate.end).toLocaleTimeString(
                            "en-GB",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )
                        : ""}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white bg-main rounded hover:bg-second cursor-pointer"
              >
                Confirm Booking
              </button>

              <span
                onClick={handleCloseDialog}
                className="inline-block mt-3 text-center text-sm text-gray-500 cursor-pointer hover:underline hover:text-third"
              >
                Cancel
              </span>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            {selectedBooking && (
              <p>
                Are you sure you want to delete {`"${selectedBooking.title}"`}?
              </p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleDeleteDialogClose}
                className="py-2 px-4 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBooking}
                className="py-2 px-4 bg-second text-white rounded"
              >
                Delete
              </button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;
