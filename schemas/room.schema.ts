import { z } from 'zod';

export const roomSchema = z.object({
  roomid:      z.number(),
  roomName:    z.string(),
  type:        z.string(),
  accessible:  z.boolean(),
  image:       z.string().optional(),
  description: z.string(),
  features:    z.array(z.string()),
  roomPrice:   z.union([z.number(), z.string()]),
});

export const roomListSchema = z.object({
  rooms: z.array(roomSchema),
});

export type Room     = z.infer<typeof roomSchema>;
export type RoomList = z.infer<typeof roomListSchema>;