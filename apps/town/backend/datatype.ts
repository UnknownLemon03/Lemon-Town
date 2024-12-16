import { z} from 'zod'

export const RoomType = z.object({
    name:z.string(),
    start:z.number(),
    end:z.number(),
    url:z.string()
}) 
export const RoomTypeDB = z.object({
    id:z.number(),
    name:z.string(),
    start:z.number(),
    end:z.number(),
    url:z.string()
}) 

