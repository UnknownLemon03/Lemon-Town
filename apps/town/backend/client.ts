'use client'
import React from 'react' 
import toast from "react-hot-toast";
export function getPlayerChar(){
    'use client'
    const x = localStorage.getItem("Player_id") ?? ""
    const id = parseInt(x); 
    if(!id || isNaN(id) || id< 0 || id>4) return 1;
    return id;
}
export function setPlayerChar(id:number){
    'use client'
    localStorage.setItem("Player_id",`${id}`)
}

export enum MeetType {
    "local",
    'private'
}
export type MeetDataType = {
    isAdmin:boolean,
    AdminSocketId:string,
    MeetToken:string,
    type:MeetType
} | null;