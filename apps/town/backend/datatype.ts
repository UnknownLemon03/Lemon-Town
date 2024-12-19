import { string, z} from 'zod'

export const RoomType = z.object({
    name:z.string(),
    mapid:z.number(),
}) 
export const RoomTypeDB = z.object({
    id:z.number(),
    name:z.string(),
    mapid:z.number(),
}) 
export const MapType = z.object({
    name:z.string(),
    start:z.number(),
    end:z.number(),
}) 
export const MapTypeDB = z.object({
    id:z.number(),
    name:z.string(),
    start:z.number(),
    end:z.number(),
}) 

export const UserTypeDB = z.object({
    id:z.number(),
    name:z.string(),
    email:z.string(),
    password : z.string(),
})

export type RoomType = z.infer<typeof RoomType>
export type RoomTypeDB = z.infer<typeof RoomTypeDB>
export type UserTypeDB = z.infer<typeof UserTypeDB>
export type MapTypeDB = z.infer<typeof MapTypeDB>
export type MapType = z.infer<typeof MapType>