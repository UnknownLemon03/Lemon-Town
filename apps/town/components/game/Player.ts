import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    lastDirection:string
    speed:number
    PlayerIconId:number
    constructor(scene:Phaser.Scene , x:number, y:number,PlayerIconId:number) {
        super(scene, x, y, `stop_${PlayerIconId}`, 1); // 'stop' is the texture, 1 is the frame
        if(!PlayerIconId)
            PlayerIconId = 1;    
        this.PlayerIconId = PlayerIconId;
        // Add the player to the scene
        scene.add.existing(this);
        // Enable physics for the player
        scene.physics.world.enable(this);
       

        this.setCollideWorldBounds(true);  
        this.setBounce(0.2);                       
        
        this.setScale(3);  // Scale the player sprite
        
        // Player movement properties
        this.speed = 100;  // Default movement speed
        this.lastDirection = `stop_down_${this.PlayerIconId}`;  // Keep track of the last movement direction for stop animation
        this.play(`stop_down_${this.PlayerIconId}`)   
    }
}





