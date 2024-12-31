'use client'
import { Physics, Scene } from 'phaser';
import { MainPlayer } from './MainPlayer';
import { start } from 'repl';
import { ConnectSoket, getSocket } from './Socket';
import { AllSidePlayers, SidePlayer } from './SidePlayer';

export class Town extends Scene
{
    static TownPlayerCharatersCount = 4;
    map:any;
    groundLayer1:Phaser.Tilemaps.TilemapLayer|null;
    groundLayer2:Phaser.Tilemaps.TilemapLayer|null;
    groundLayer3:Phaser.Tilemaps.TilemapLayer|null;
    groundLayer4:Phaser.Tilemaps.TilemapLayer|null;
    groundLayer5:Phaser.Tilemaps.TilemapLayer|null;
    static MapLink:string
    mainPlayer:Physics.Arcade.Sprite | undefined 
    static startX:number;
    static startY:number;
    subPlayerGroup:any;
    constructor ()
    {
        super({ key: 'Town' });
        this.groundLayer1 = null;
        this.groundLayer2 = null;
        this.groundLayer3 = null;
        this.groundLayer4 = null;
        this.groundLayer5 = null;
    }

    preload(){
        this.load.tilemapTiledJSON('map', Town.MapLink);
        // this.load.image('Room_Builder', '/town/Room_Builder.png');
        // this.load.image('Interiors', '/town/Interiors.png');
        this.load.image('assets', '/town/assets.png');
        this.load.image('assets2', '/town/assets2.png');
        this.load.image('base', '/town/base.png');


        for(let i = 1; i <= Town.TownPlayerCharatersCount; i++){
            this.load.spritesheet(`player_${i}`,`/town/player${i}.png`,{
                frameWidth:16,
                frameHeight:32,
                margin: 0, 
                spacing: 0, 
            });
            
            this.load.spritesheet(`movement_${i}`, `/town/player${i}.png`, {
                frameWidth: 16,
                frameHeight: 32,
                margin: 0,
                spacing: 0, 
                startFrame:48,
                endFrame:71
            });
            this.load.spritesheet(`stop_${i}`, `/town/player${i}.png`, {
                frameWidth: 16,
                frameHeight: 32,
                margin: 0, 
                spacing: 0, 
                startFrame:24,
                endFrame:47
            });
        }
    }

    create ()
    {   
       // animation for player 
       const moveSpeed = 10;
       for(let i = 1; i <= Town.TownPlayerCharatersCount ; i++){
            this.anims.create({
                key: `move_right_${i}`,
                frames: this.anims.generateFrameNumbers(`movement_${i}`, { start: 0, end: 5 }),  // Frames for 'move_up'
                frameRate: moveSpeed,
                repeat: -1,
            });

            this.anims.create({
                key: `move_up_${i}`,
                frames: this.anims.generateFrameNumbers(`movement_${i}`, { start: 6, end: 11 }),  // Frames for 'move_down'
                frameRate: moveSpeed,
                repeat: -1,
            });

            this.anims.create({
                key: `move_left_${i}`,
                frames: this.anims.generateFrameNumbers(`movement_${i}`, { start: 12, end: 17 }),  // Frames for 'move_left'
                frameRate: moveSpeed,
                repeat: -1,
            });

            this.anims.create({
                key: `move_down_${i}`,
                frames: this.anims.generateFrameNumbers(`movement_${i}`, { start: 18, end: 23 }),  // Frames for 'move_right'
                frameRate: moveSpeed,
                repeat: -1,
            });

            //
            const stopSpeed = 9;
            this.anims.create({
                key: `stop_right_${i}`,
                frames: this.anims.generateFrameNumbers(`stop_${i}`, { start: 0, end: 5 }),  // Frames for 'move_up'
                frameRate: stopSpeed,
                repeat: -1,
            });

            this.anims.create({
                key: `stop_up_${i}`,
                frames: this.anims.generateFrameNumbers(`stop_${i}`, { start: 6, end: 11 }),  // Frames for 'move_down'
                frameRate: stopSpeed,
                repeat: -1,
            });

            this.anims.create({
                key: `stop_left_${i}`,
                frames: this.anims.generateFrameNumbers(`stop_${i}`, { start: 12, end: 17 }),  // Frames for 'move_left'
                frameRate: stopSpeed,
                repeat: -1,
            });

            this.anims.create({
                key: `stop_down_${i}`,
                frames: this.anims.generateFrameNumbers(`stop_${i}`, { start: 18, end: 23 }),  // Frames for 'move_right'
                frameRate: stopSpeed,
                repeat: -1,
            });
        }
       this.map = this.make.tilemap({ key: 'map' , width:40, height:30 });
    //    const tileset1 = this.map.addTilesetImage('Room_Builder', "Room_Builder");
    //    const tileset2 = this.map.addTilesetImage('Interiors', 'Interiors');
       const assets = this.map.addTilesetImage('assets', "assets");
       const assets2 = this.map.addTilesetImage('assets2', 'assets2');
       const base = this.map.addTilesetImage('base', "base");
       this.groundLayer1 = this.map.createLayer('base', [assets,assets2,base], 0, 0);
       this.groundLayer2 = this.map.createLayer('upper', [assets,assets2,base], 0, 0);  
       this.groundLayer3 = this.map.createLayer('upper2', [assets,assets2,base], 0, 0);  
       this.groundLayer4 = this.map.createLayer('overhead', [assets,assets2,base], 0, 0);  
       this.groundLayer5 = this.map.createLayer('overhead2', [assets,assets2,base], 0, 0);  
       this.groundLayer1?.setDepth(0)
       this.groundLayer2?.setDepth(0);  
       this.groundLayer3?.setDepth(0);  
       this.groundLayer4?.setDepth(10)
       this.groundLayer5?.setDepth(12)
       this.groundLayer2?.setCollisionByProperty({ collide: true });
       this.groundLayer3?.setCollisionByProperty({ collide: true });


       this.mainPlayer = new MainPlayer(this,Math.ceil(Town.startX*32),Math.ceil(Town.startY*32))
       this.physics.add.collider(this.mainPlayer, this.groundLayer2!);
       this.physics.add.collider(this.mainPlayer, this.groundLayer3!);

       // sub group for side players 
       this.subPlayerGroup = this.add.group();
       // socket connection 
        const io = getSocket();
        io.on('GetExistingPlayer', (data) => {
            const {userData:{ExistingPlayers},id} = data;
            AllSidePlayers.CreatePlayers(this,ExistingPlayers)
        });
        io.on('NewPlayer', (data) => {
            const {id,x,y,PlayerIconId,name,DBid} = data;
            AllSidePlayers.AddPlayer(this,id,{x,y,PlayerIconId,name,DBid});
        });
        io.on("UserNewLocation",(data)=>{
            AllSidePlayers.UpdatePlayer(this,data.id,{x:data.x,y:data.y})
        })
        io.on("RoomRemoveResponse",({id})=>{
            AllSidePlayers.RemovePlayer(this,id)
        })
        io.emit('joinRoom', { 
            roomName:MainPlayer.RoomID, 
            userData:{ x:this.mainPlayer.x , 
            y:this.mainPlayer.y , 
            Auth:MainPlayer.Auth,
            PlayerIconId:MainPlayer.PlayerIconId,
            name:MainPlayer.Name
        } });
    }
   
    update(time: number, delta: number): void {
        this.mainPlayer!.update();
        const nearDistance = 70;
        for(let i = 0 ; i < this.subPlayerGroup.getChildren().length;i++){
            const player:SidePlayer = this.subPlayerGroup.getChildren()[i]
            player.update(player.PlayerIconId);
            const isNear = Math.abs(this.mainPlayer!.x - player.x) < nearDistance && Math.abs(this.mainPlayer!.y-player.y) < nearDistance
            if(isNear && !MainPlayer.NearPlayer[player.DBid])
                MainPlayer.AddPlayer(player.DBid,player.playerName);
            else if(!isNear && MainPlayer.NearPlayer[player.DBid]) {
                MainPlayer.RemovePlayer(player.DBid)
            }
            
        }

    }    
   
    
    
}


