"use server";

import prisma from "@/lib/db";
import { EventInput } from "@fullcalendar/core";

export async function getBookings(): Promise<EventInput[]> {
  try {
    const bookings = await prisma.booking.findMany();
    return bookings.map((booking) => ({
      id: booking.id,
      title: booking.title,
      start: booking.startTime.toISOString(),
      end: booking.endTime.toISOString(),
      roomId: booking.roomId,
    }));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function addBooking(booking: {
  title: string;
  start: string;
  end: string;
  roomId?: string | null;
}) {
  try {
    await prisma.booking.create({
      data: {
        title: booking.title,
        startTime: new Date(booking.start),
        endTime: new Date(booking.end),
        roomId: booking.roomId,
      },
    });
  } catch (error) {
    console.error("Error adding booking:", error);
  }
}

export async function deleteBooking(id: string) {
  try {
    await prisma.booking.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
  }
}
