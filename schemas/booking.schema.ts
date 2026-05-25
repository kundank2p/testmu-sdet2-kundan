import { z } from 'zod';

export const bookingSchema = z.object({
  bookingid: z.number(),
  roomid: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string(),
    checkout: z.string(),
  }),
  additionalneeds: z.string().optional(),
});

export const bookingListSchema = z.object({
  bookings: z.array(bookingSchema),
});

export type Booking = z.infer<typeof bookingSchema>;
export type BookingList = z.infer<typeof bookingListSchema>;