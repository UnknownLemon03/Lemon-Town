'use client'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Game } from 'phaser'; // Correct import for Phaser modules
import { Town } from './Town'; // Assuming this is your custom scene
import { ConnectSoket, getSocket } from './Socket';
import { cookies } from 'next/headers';
export const dynamic = 'no-catch'
export default function PhasorTown({mapurl,player}:{mapurl:string,player?:number}) {
    const ref = useRef<HTMLDivElement>(null);
    const[loading,setLoading] = useState(true);
    let [game, setGame] = useState<Game | null>(null);
    useLayoutEffect(() => {
        if (!ref.current) return;
        const config:Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 1024,
            height: 768,
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
        Town.PlayerIconId = Math.ceil(Math.random() * 4)
        Town.startX = 35;
        Town.startY = 27;
        if(!loading){
            const game = new Game({...config, parent: ref.current});
            setGame(game)
            return () => {
                    game.destroy(true);
            };
        }else{
            ConnectSoket(Town.startX*32,Town.startY*32,"room1","tset").then(e=>{
                setLoading(false);
            })
        }
    }, [loading]); 

    return (
        <>
            <div ref={ref} className='flex justify-center items-center h-screen'></div>
        </>
    );
}
