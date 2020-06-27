let speed = 9;

// Dimensiones de los obstaculos
let RX = 25;
let RY = 15;

let controls = {
    joystickLocked: true,
    buttonsLocked: false
}

var mainScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function mainScene() {
        Phaser.Scene.call(this, {
            key: 'mainScene',
            active: true
        });
    },

    preload: function () {

        this.isPlaying = true;
        this.load.spritesheet('worm', "./img/worm.png", {
            frameWidth: 32,
            frameHeight: 64
        });

        this.load.spritesheet('balloon', "./img/balloon.png", {
            frameWidth: 32,
            frameHeight: 64
        });



        this.cameras.main.setBackgroundColor('#000000')
        //load the audios
        this.load.audio("a5", "./audio/a5.mp3");
        this.load.audio("b5", "./audio/b5.mp3");
        this.load.audio("c5", "./audio/c5.mp3");
        this.load.audio("d5", "./audio/d5.mp3");
        this.load.audio("e5", "./audio/e5.mp3");
        this.load.audio("f5", "./audio/f5.mp3");
        this.load.audio("g4", "./audio/g4.mp3");
        this.load.audio("g5", "./audio/g5.mp3");
        this.load.audio("pop", "./audio/pop.wav");
        this.load.audio("squish", "./audio/squish.wav");

        //load the images
        this.load.image("back_1", "./img/back_1.png");
        this.load.image("back_2", "./img/back_2.png")




    },

    create: function () {



        //-------------------Worm animations
        this.anims.create({
            key: "walking",
            repeat: -1,
            frameRate: 8,
            frames: this.anims.generateFrameNumbers('worm', {
                frames: [0, 1, 2]
            })
        });


        this.anims.create({
            key: "jump",
            repeat: -1,
            frameRate: 8,
            frames: this.anims.generateFrameNumbers('worm', {
                frames: [6, 3, 4, 5, 3, 4, 5, 3, 4, 5]
            })
        })

        this.anims.create({
            key: "die",
            repeat: 0,
            frameRate: 8,
            frames: this.anims.generateFrameNumbers('worm', {
                frames: [7]
            })
        })


        //--------------Balloon animations
        this.anims.create({
            key: "idle",
            repeat: -1,
            frameRate: 8,
            frames: this.anims.generateFrameNumbers('balloon', {
                frames: [0, 1, 2, 3]
            })
        });

        this.anims.create({
            key: "explode",
            repeat: 0,
            frameRate: 8,
            frames: this.anims.generateFrameNumbers('balloon', {
                frames: [4, 5, 6, 7, 8]
            })
        });


        this.add.image(0, 0, "back_2").setScale(2).setOrigin(0);
        this.background=this.add.image(0, 0, "back_1").setScale(2).setOrigin(0).setInteractive();

        this.background.on('pointerdown', () => {
            if (!this.isPlaying) return;
            this.listNotes[this.noteCounter].play();
            this.noteCounter++;
            this.playerVelocity = -9;
            this.worm.play("jump")

        })


        this.worm = this.add.sprite(130, 300, 'worm', 2).setScale(2);
        this.worm.play("jump");

        this.a5 = this.sound.add('a5', {
            delay: 0
        });

        this.b5 = this.sound.add('b5', {
            delay: 0
        });

        this.c5 = this.sound.add('c5', {
            delay: 0
        });

        this.d5 = this.sound.add('d5', {
            delay: 0
        });

        this.e5 = this.sound.add('e5', {
            delay: 0
        });

        this.f5 = this.sound.add('f5', {
            delay: 0
        });

        this.g4 = this.sound.add('g4', {
            delay: 0
        });

        this.g5 = this.sound.add('g5', {
            delay: 0
        });

        this.pop = this.sound.add('pop', {
            delay: 0
        });
        this.squish = this.sound.add('squish', {
            delay: 0
        }).setVolume(0.6);



        this.obstacles = [];

        this.listTempos = [8, 11, 12, 16, 20, 24, 32, 35, 36, 40, 44, 48, 56, 59, 60, 64, 68, 72, 76, 84, 87, 88, 92, 96, 100]

        this.listTempos.forEach(element => {
            this.timedEvent = this.time.delayedCall(1000 + element * 250, () => {
                this.createRectangle();
            });
        });



        this.listNotes = [this.g4, this.g4, this.a5, this.g4, this.c5, this.b5,
            this.g4, this.g4, this.a5, this.g4, this.d5, this.c5,
            this.g4, this.g4, this.g5, this.e5, this.c5, this.b5, this.a5,
            this.f5, this.f5, this.e5, this.c5, this.d5, this.c5
        ];

        this.noteCounter = 0;


        this.input.keyboard.on('keydown_SPACE', (event) => {
            if (!this.isPlaying) return;
            this.listNotes[this.noteCounter].play();
            this.noteCounter++;
            this.playerVelocity = -9;
            this.worm.play("jump")
        });



        this.playerVelocity = 0;

    },



    update: function () {

        if (!this.isPlaying) return;

        this.obstacles.forEach((item, index, object) => {
            item.x -= speed;
            if (item.x < -100) {
                object.splice(index, 1);
            }
            if (doOverlap(item, this.worm)) {
                this.worm.play("die")
                this.pop.play();
                item.play("explode");
                this.isPlaying = false;
            }

        })
        this.worm.y += this.playerVelocity;
        if (this.worm.y <= 565) {
            this.playerVelocity += 0.4;
        } else {
            this.worm.y = 565;
            this.playerVelocity = 0;
            if (this.worm.anims.isPlaying && this.worm.anims.currentAnim.key == 'jump') {
                this.worm.play("walking");
                this.squish.play();
            }
        }

    },


    createRectangle: function () {
        //newObstacle = this.add.rectangle(700, 550 + Math.random() * 10, RX * 2, RY * 2).setFillStyle(0xff0000, 0.6);
        newObstacle = this.add.sprite(700, 550 + Math.random() * 10, 'balloon', 2).setScale(2);
        newObstacle.play("idle")
        this.obstacles.push(newObstacle);
    }
})

function doOverlap(rect, player) {
    // If one rectangle is on left side of other 
    if (rect.x - RX >= player.x + 20 || player.x - 20 >= rect.x + RX)
        return false;

    // If one rectangle is above other 
    if (rect.y + RY <= player.y - 60 / 2 || player.y + 60 / 2 <= rect.y - RY)
        return false;

    return true;
}