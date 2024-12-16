'use client'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Game } from 'phaser'; // Correct import for Phaser modules
import { Town } from './Town'; // Assuming this is your custom scene
import { MainPlayer } from './MainPlayer';
export const dynamic = 'no-catch'
export default function PhasorTown({mapurl,player}:{mapurl:string,player?:number}) {
    const ref = useRef<HTMLDivElement>(null);
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
        const game = new Game({...config, parent: ref.current});
        setGame(game)
        return () => {
            game.destroy(true);
        };
    }, []); 

    return (
        <>
            <div ref={ref} className='flex justify-center items-center h-screen'></div>
        </>
    );
}
