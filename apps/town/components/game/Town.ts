'use client'
import { Physics, Scene } from 'phaser';
import { MainPlayer } from './MainPlayer';
import { start } from 'repl';
import { ConnectSoket, getSocket } from './Socket';
import { AllSidePlayers, SidePlayer } from './SidePlayer';

export class Town extends Scene
{
    map:any;
    groundLayer1:Phaser.Tilemaps.TilemapLayer|null;
    groundLayer2:Phaser.Tilemaps.TilemapLayer|null;
    groundLayer3:Phaser.Tilemaps.TilemapLayer|null;
    static MapLink:string
    mainPlayer:Physics.Arcade.Sprite | undefined 
    static PlayerIconId:number =1;
    static startX:number;
    static startY:number;
    subPlayerGroup:any;
    constructor ()
    {
        super({ key: 'Town' });
        this.groundLayer1 = null;
        this.groundLayer2 = null;
        this.groundLayer3 = null;
    }

    preload(){
        this.load.tilemapTiledJSON('map', Town.MapLink);
        this.load.image('Room_Builder', '/town/Room_Builder.png');
        this.load.image('Interiors', '/town/Interiors.png');


        
        this.load.spritesheet("player",`/town/player${Town.PlayerIconId}.png`,{
            frameWidth:16,
            frameHeight:32,
            margin: 0, 
            spacing: 0, 
        });
       
        this.load.spritesheet("movement", `/town/player${Town.PlayerIconId}.png`, {
            frameWidth: 16,
            frameHeight: 32,
            margin: 0,
            spacing: 0, 
            startFrame:48,
            endFrame:71
        });
        this.load.spritesheet("stop", `/town/player${Town.PlayerIconId}.png`, {
            frameWidth: 16,
            frameHeight: 32,
            margin: 0, 
            spacing: 0, 
            startFrame:24,
            endFrame:47
        });
    }

    create ()
    {   
       // animation for player 
       const moveSpeed = 10;
       this.anims.create({
           key: "move_right",
           frames: this.anims.generateFrameNumbers("movement", { start: 0, end: 5 }),  // Frames for 'move_up'
           frameRate: moveSpeed,
           repeat: -1,
       });

       this.anims.create({
           key: "move_up",
           frames: this.anims.generateFrameNumbers("movement", { start: 6, end: 11 }),  // Frames for 'move_down'
           frameRate: moveSpeed,
           repeat: -1,
       });

       this.anims.create({
           key: "move_left",
           frames: this.anims.generateFrameNumbers("movement", { start: 12, end: 17 }),  // Frames for 'move_left'
           frameRate: moveSpeed,
           repeat: -1,
       });

       this.anims.create({
           key: "move_down",
           frames: this.anims.generateFrameNumbers("movement", { start: 18, end: 23 }),  // Frames for 'move_right'
           frameRate: moveSpeed,
           repeat: -1,
       });

       //
       const stopSpeed = 9;
       this.anims.create({
           key: "stop_right",
           frames: this.anims.generateFrameNumbers("stop", { start: 0, end: 5 }),  // Frames for 'move_up'
           frameRate: stopSpeed,
           repeat: -1,
       });

       this.anims.create({
           key: "stop_up",
           frames: this.anims.generateFrameNumbers("stop", { start: 6, end: 11 }),  // Frames for 'move_down'
           frameRate: stopSpeed,
           repeat: -1,
       });

       this.anims.create({
           key: "stop_left",
           frames: this.anims.generateFrameNumbers("stop", { start: 12, end: 17 }),  // Frames for 'move_left'
           frameRate: stopSpeed,
           repeat: -1,
       });

       this.anims.create({
           key: "stop_down",
           frames: this.anims.generateFrameNumbers("stop", { start: 18, end: 23 }),  // Frames for 'move_right'
           frameRate: stopSpeed,
           repeat: -1,
       });

       this.map = this.make.tilemap({ key: 'map' , width:40, height:30 });
       const tileset1 = this.map.addTilesetImage('Room_Builder', "Room_Builder");
       const tileset2 = this.map.addTilesetImage('Interiors', 'Interiors');
       this.groundLayer1 = this.map.createLayer('base', [tileset1,tileset2], 0, 0);
       this.groundLayer2 = this.map.createLayer('upper', [tileset1,tileset2], 0, 0);  
       this.groundLayer3 = this.map.createLayer('overhead', [tileset1,tileset2], 0, 0);  
       this.groundLayer1?.setDepth(0)
       this.groundLayer2?.setDepth(0);  
       this.groundLayer3?.setDepth(10)
       this.groundLayer2?.setCollisionByProperty({ collide: true });

       let targx = 32*35;
       let targy = 32*27;
       this.mainPlayer = new MainPlayer(this,Math.ceil(Town.startX*32),Math.ceil(Town.startY*32))
       this.physics.add.collider(this.mainPlayer, this.groundLayer2!);

       // sub group for side players 
       this.subPlayerGroup = this.add.group();
       // socket connection 
       ConnectSoket(Town.startX*32,Town.startY*32,"room1");
        const io = getSocket();
        io.on('GetExistingPlayer', (data) => {
            const {userData:{ExistingPlayers},id} = data;
            AllSidePlayers.CreatePlayers(this,ExistingPlayers)
        });
        io.on('NewPlayer', (data) => {
            const {id,x,y} = data;
            // // @ts-expect-error
            AllSidePlayers.AddPlayer(this,id,{x,y});
        });
        io.on("UserNewLocation",(data)=>{
            AllSidePlayers.UpdatePlayer(this,data.id,{x:data.x,y:data.y})
        })
        io.on("RoomRemoveResponse",({id})=>{
            console.log('remove user fire')
            console.log(id)
            AllSidePlayers.RemovePlayer(this,id)
        })

    }
   
    update(time: number, delta: number): void {
        this.mainPlayer!.update();
        for(let i = 0 ; i < this.subPlayerGroup.getChildren().length;i++){
            const player:SidePlayer = this.subPlayerGroup.getChildren()[i]
            player.update();
            console.log("palyer curr",player)
            if(Math.abs(this.mainPlayer!.x - player.x) < 50 && Math.abs(this.mainPlayer!.y-player.y) < 50)
                MainPlayer.AddPlayer(player.socketID);
            else
                MainPlayer.RemovePlayer(player.socketID)
            
        }
    }    
   
    
    
}


