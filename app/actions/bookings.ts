"use server";

import { revalidatePath } from "next/cache";

// Note to self. Temporary storage instead of localstorage

let bookings: any[] = [];

export async function getBookings() {
  return bookings;
}

export async function addBooking(newBooking: any) {
  bookings.push(newBooking);

  revalidatePath("/"); // Refresh cache
}

export async function deleteBooking(id: string) {
  bookings = bookings.filter((booking) => booking.id !== id);

  revalidatePath("/");
}
