'use client'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Game } from 'phaser'; // Correct import for Phaser modules
import { Town } from './Town'; // Assuming this is your custom scene
import { ConnectSoket, getSocket } from './Socket';
import { cookies } from 'next/headers';
import { MainPlayer } from './MainPlayer';
import { getPlayerChar } from '@/backend/client';
import { redirect } from 'next/navigation';
import { getAuthToken } from '@/backend/Auth';
import TownBar from '../meet/TownBar';
import { ConnectSoketSFU, getSocketSFU } from './SFU';
export const dynamic = 'no-catch'
export default function PhasorTown({mapurl,roomid,name,x,y}:{mapurl:string,roomid:number,name:string,x:number,y:number}) {
    const ref = useRef<HTMLDivElement>(null);
    const[loading,setLoading] = useState(true);
    let [game, setGame] = useState<Game | null>(null);
    useLayoutEffect(() => {
        if (!ref.current) return;
        const config:Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 1600,
            height: 780,
            zoom:1,
            parent: 'phasor-canvas-id',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                    fixedStep: false 
                },
            },
            backgroundColor:"",
            scene: [
                Town
            ],
            roundPixels: true,
            pixelArt: true,
            antialias: false,
        };

        

        Town.MapLink = mapurl
        MainPlayer.PlayerIconId = getPlayerChar();
        MainPlayer.RoomID = roomid
        
        MainPlayer.Name = name
        Town.startX = x;
        Town.startY = y;
        if(!loading){
            const game = new Game({...config, parent: ref.current});
            setGame(game)
            return () => {
                    game.destroy(true);
            };
        }else{
            getAuthToken().then(async e=>{    
                console.log("working once 1")
                if(!e) return redirect("/login")
                MainPlayer.Auth = e
                ConnectSoket(Town.startX*32,Town.startY*32,MainPlayer.RoomID,{PlayerIconId:MainPlayer.PlayerIconId,Auth:e,name:MainPlayer.Name}).then(()=>{
                    ConnectSoketSFU({room:roomid,Auth:e,name:MainPlayer.Name}).then(()=>{
                        setLoading(false)
                    })
                })
            })
        }
    }, [loading]); 

    return (
        <>
            <div ref={ref} className='flex flex-col-reverse  justify-center items-center h-screen'>
            <TownBar/>
            </div>
        </>
    );
}
