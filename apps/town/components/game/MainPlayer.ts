import Phaser from 'phaser';
import { Player } from './Player';
import { getSocket } from './Socket';
import { AllSidePlayers } from './SidePlayer';



export class MainPlayer extends Player {
    static NearPlayer: { [id: string]: boolean } = {}; // Using a record type for static player tracking
    static PlayerIconId:number =1;
    static RoomID:number
    static Name:string = "lemon"
    static Auth:string
    //@ts-expect-error
    cursorKeys: Phaser.Input.Keyboard.CursorKey;
    playerSpeed: number;
    oldx: number;
    oldy: number;
    movement: string;
    playerName:string;
    nameText: Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y,MainPlayer.PlayerIconId);
        this.playerName = MainPlayer.Name
        // Set camera bounds and start camera follow
        //@ts-expect-error
        const mapWidth: number = scene.map.widthInPixels;
        //@ts-expect-error
        const mapHeight: number = scene.map.heightInPixels;
        scene.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        scene.cameras.main.roundPixels = false;
        
        // Ensure the player can collide with the world bounds
        scene.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        
        // Player controls
        //@ts-expect-error
        this.cursorKeys = scene.input.keyboard.createCursorKeys();
        this.playerSpeed = 100;
        this.oldx = this.x;
        this.oldy = this.y;
        scene.cameras.main.startFollow(this); // Assuming the player is 'this'
        this.movement = "stop_down";  // Default state is stopped

        this.nameText = scene.add.text(x, y, this.playerName, {
            font: '1.2rem',
            resolution:64,
            //@ts-expect-error
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);
        this.nameText.setDepth(100)
        scene.events.on('update', this.update, this);

        this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.setSize(16, 16);  // Adjust to match the sprite size
        this.setOffset(0, 16);  // Optional: Set an offset to align body with sprite

    }

    static AddPlayer(id: string): void {
        MainPlayer.NearPlayer[id] = true;
    }

    static RemovePlayer(id: string): void {
        if (id in MainPlayer.NearPlayer) {
            delete MainPlayer.NearPlayer[id];
        }
    }

    UpdateLocationSocket(): void {
        const xn: number = Math.abs(this.oldx - this.x);
        const yn: number = Math.abs(this.oldy - this.y);

        if (xn > 20 || yn > 20) {
            const io = getSocket();
            if(Object.keys(AllSidePlayers.Players).length > 0)
                io.emit('UpdatePlayerLocation', { roomName: MainPlayer.RoomID, userData: { x: Math.floor(this.x), y: Math.floor(this.y) } });
            this.oldx = this.x;
            this.oldy = this.y;
            console.log("Updaing main player",AllSidePlayers.Players)
        }
    }

    updatePlayer(): void {
        // Handle diagonal and regular movement

        if (this.cursorKeys.shift.isDown) {
            this.playerSpeed = 200;  // Increase speed when Shift is pressed
        } else {
            this.playerSpeed = 100;  // Default speed when Shift is not pressed
        }
        if (this.cursorKeys.up.isDown && this.cursorKeys.left.isDown) {
            this.anims.play(`move_up_${this.PlayerIconId}`, true); // Diagonal animation for moving up-left
            this.setVelocity(-this.playerSpeed, -this.playerSpeed); // Diagonal movement
            this.movement = "move_up";
        } else if (this.cursorKeys.up.isDown && this.cursorKeys.right.isDown) {
            this.anims.play(`move_up_${this.PlayerIconId}`, true); // Diagonal animation for moving up-right
            this.setVelocity(this.playerSpeed, -this.playerSpeed); // Diagonal movement
            this.movement = "move_up";
        } else if (this.cursorKeys.down.isDown && this.cursorKeys.left.isDown) {
            this.anims.play(`move_down_${this.PlayerIconId}`, true); // Diagonal animation for moving down-left
            this.setVelocity(-this.playerSpeed, this.playerSpeed); // Diagonal movement
            this.movement = "move_down";
        } else if (this.cursorKeys.down.isDown && this.cursorKeys.right.isDown) {
            this.anims.play(`move_down_${this.PlayerIconId}`, true); // Diagonal animation for moving down-right
            this.setVelocity(this.playerSpeed, this.playerSpeed); // Diagonal movement
            this.movement = "move_down";
        }
        // Vertical movement (up and down)
        else if (this.cursorKeys.up.isDown) {
            this.anims.play(`move_up_${this.PlayerIconId}`, true);
            this.setVelocity(0, -this.playerSpeed); // Only vertical movement
            this.movement = "move_up";
        } else if (this.cursorKeys.down.isDown) {
            this.anims.play(`move_down_${this.PlayerIconId}`, true);
            this.setVelocity(0, this.playerSpeed); // Only vertical movement
            this.movement = "move_down";
        }
        // Horizontal movement (left and right)
        else if (this.cursorKeys.left.isDown) {
            this.anims.play(`move_left_${this.PlayerIconId}`, true);
            this.setVelocity(-this.playerSpeed, 0); // Only horizontal movement
            this.movement = "move_left";
        } else if (this.cursorKeys.right.isDown) {
            this.anims.play(`move_right_${this.PlayerIconId}`, true);
            this.setVelocity(this.playerSpeed, 0); // Only horizontal movement
            this.movement = "move_right";
        }
        // If no keys are pressed, stop and play the appropriate stop animation
        else {
            this.setVelocity(0, 0);
            switch (this.movement) {
                case "move_up":
                    this.anims.play(`stop_up_${this.PlayerIconId}`, true);
                    break;
                case "move_down":
                    this.anims.play(`stop_down_${this.PlayerIconId}`, true);
                    break;
                case "move_left":
                    this.anims.play(`stop_left_${this.PlayerIconId}`, true);
                    break;
                case "move_right":
                    this.anims.play(`stop_right_${this.PlayerIconId}`, true);
                    break;
            }
        }
    }

    update(): void {
        // Call the updatePlayer method to handle input and movement
        this.updatePlayer();
        this.UpdateLocationSocket();
        this.nameText.setPosition(this.x, this.y - 30);  // Keep the name text above the player
    }
}
