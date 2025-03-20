"use client";

import { useState } from "react";
import { DateSelectArg } from "@fullcalendar/core";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addBooking } from "../actions/bookings";
import { revalidatePath } from "next/cache";

interface BookingFormProps {
  selectedDate: DateSelectArg | null;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedDate, onClose }) => {
  const [newBookingTitle, setNewBookingTitle] = useState<string>("");

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
      revalidatePath("/"); // Revalidate the calendar data.
      onClose();
    }
  };

  return (
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
  );
};

export default BookingForm;
