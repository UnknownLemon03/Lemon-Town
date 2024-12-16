import { Scene } from "phaser";
import { MainPlayer } from "./MainPlayer";
import { Player } from "./Player";
import { getSocket } from "./Socket";


export class SidePlayer extends Player {
    socketID:string;
    currX:number;
    currY:number;
    movementStack:{x:number,y:number}[] = [];
    playerName:string;
    nameText: Phaser.GameObjects.Text;
    constructor(scene:Scene, x:number, y:number,socketID:string) {
        super(scene, x, y);
        this.currX = x;  
        this.currY = y;   
        this.socketID = socketID
        this.playerName = "Apple"

        this.nameText = scene.add.text(x, y - 30, this.playerName, {
            font: '18px nunito',
            fontSize:"2px",
            //@ts-expect-error
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);
        this.nameText.setDepth(100)

        this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.setSize(16, 16);  // Adjust to match the sprite size
        this.setOffset(0, 16);  // Optional: Set an offset to align body with sprite
    }
    delete(){
        this.nameText.destroy(true);
        this.destroy(true);
    }
    update() {
        this.moveTo(this.currX, this.currY);
        console.log(this.movementStack)
        if (this.movementStack.length > 0) {
            this.currX = this.movementStack[0].x;
            this.currY = this.movementStack[0].y;
            console.log("true",this.currX,this.currY)
            console.log("true",this.x,this.y)
            console.log("ans",Math.sqrt(Math.pow(this.x - this.currX, 2) + Math.pow(this.y - this.currY, 2)))
            if(Math.sqrt(Math.pow(this.x - this.currX, 2) + Math.pow(this.y - this.currY, 2))<5){
                this.movementStack.shift();
            }
        }
        if (this.nameText) {
            this.nameText.setPosition(this.x, this.y - 30);  // Keep the name text above the player
        }
    }
    
    changePos(x:number, y:number) {
        this.movementStack.push({x,y})
    }
    moveTo(x:number, y:number) {
 
        const directionX = x - this.x;
        const directionY = y - this.y;
        if (Math.sqrt(Math.pow(this.x - this.currX, 2) + Math.pow(this.y - this.currY, 2))<3) {
            console.log('before error this ',this)
            this.setVelocity(0, 0);

            // Play stop animation based on the last direction of movement
            if (this.lastDirection === 'right') {
                this.anims.play("stop_right", true);
            } else if (this.lastDirection === 'left') {
                this.anims.play("stop_left", true);
            } else if (this.lastDirection === 'down') {
                this.anims.play("stop_down", true);
            } else if (this.lastDirection === 'up') {
                this.anims.play("stop_up", true);
            }
            return;
        } else {
            const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
            const normalizedDirectionX = directionX / magnitude;
            const normalizedDirectionY = directionY / magnitude;

            // Set the velocity to move the player towards the target coordinates
            this.setVelocity(normalizedDirectionX * this.speed,normalizedDirectionY * this.speed)
            
            
            
            // Choose the correct animation based on the direction
            if (Math.abs(normalizedDirectionX) > Math.abs(normalizedDirectionY)) {
                if (normalizedDirectionX > 0) {
                    this.anims.play("move_right", true);
                    this.lastDirection = 'right';
                } else {
                    this.anims.play("move_left", true);
                    this.lastDirection = 'left';
                }
            } else {
                if (normalizedDirectionY > 0) {
                    this.anims.play("move_down", true);
                    this.lastDirection = 'down';
                } else {
                    this.anims.play("move_up", true);
                    this.lastDirection = 'up';
                }
            }
           
        }
    }
}



export class AllSidePlayers {
    static Players:Partial<{[key:string]:SidePlayer}> = {}


    static AddPlayer(sence:any,id:string,loc:{x:number,y:number}){
        const player = new SidePlayer(sence,loc.x,loc.y,id);
        AllSidePlayers.Players[id] = player;
        sence.subPlayerGroup.add(AllSidePlayers.Players[id])
    }
    static UpdatePlayer(sence:Scene,socketId:string,data:{x:number,y:number}){
        try{
            const player = AllSidePlayers.Players[socketId]
            console.log(player)
            player!.changePos(data.x,data.y)
        }catch(e){
            console.log(e)
        }
    }
    static CreatePlayers(sence:Scene,data:{id:string,x:number,y:number}[]){
        console.log("add exiting player in new player")
        data.forEach((e)=>{
            AllSidePlayers.AddPlayer(sence,e.id,{x:e.x,y:e.y})
        })
        console.log("create player",AllSidePlayers.Players)
    }
    static RemovePlayer(scene:Scene,id:string){
        const player = AllSidePlayers.Players[id]!;
        player.delete();
        delete  AllSidePlayers.Players[id]
        console.log(AllSidePlayers.Players[id])
    }

}