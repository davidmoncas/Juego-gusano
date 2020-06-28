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

        this.isPlaying = false;
        this.load.spritesheet('worm', "./img/worm.png", {
            frameWidth: 32,
            frameHeight: 64
        });

        this.load.spritesheet('pig', "./img/cerdo.png", {
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
        this.load.audio("birthday", "./audio/Happy.mp3");
        this.load.audio("squish", "./audio/squish.wav");

        //load the images
        this.load.image("back_1", "./img/back_1.png");
        this.load.image("back_2", "./img/back_2.png");
        this.load.image("back_3", "./img/back_3.png");
        this.load.image("back_4", "./img/back_4.png");
        this.load.image("plataforma", "./img/plataforma.png");
        this.load.image("reintentar", "./img/reintentar.png");
        this.load.image("reset", "./img/reset.png");
        this.load.image("jugar", "./img/jugar.png");


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


        this.anims.create({
            key: "dance",
            repeat: -1,
            frameRate: 8,
            frames: this.anims.generateFrameNumbers('worm', {
                frames: [8, 9, 10, 11]
            })
        })

        //-------------- pig animation
        this.anims.create({
            key: "pig",
            repeat: -1,
            frameRate: 8,
            frames: this.anims.generateFrameNumbers('pig', {
                frames: [0, 1, 2, 3]
            })
        })

        //--------------Balloon animations
        this.anims.create({
            key: "idle",
            repeat: -1,
            frameRate: 2,
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


        this.background = this.add.image(0, 0, "back_1").setScale(2).setOrigin(0).setInteractive();



        this.bg1_a = this.add.image(0, 0, "back_2").setScale(2).setOrigin(0);
        this.bg1_b = this.add.image(600, 0, "back_2").setScale(2).setOrigin(0);

        this.bg2_a = this.add.image(0, 0, "back_3").setScale(2).setOrigin(0);
        this.bg2_b = this.add.image(600, 0, "back_3").setScale(2).setOrigin(0);

        this.bg3_a = this.add.image(0, 0, "back_4").setScale(2).setOrigin(0);
        this.bg3_b = this.add.image(600, 0, "back_4").setScale(2).setOrigin(0);

        this.plataforma1 = this.add.image(0, 0, "plataforma").setScale(2).setOrigin(0);
        this.plataforma2 = this.add.image(600, 0, "plataforma").setScale(2).setOrigin(0);

        this.background.on('pointerdown', () => {
            if (!this.isPlaying) return;

            this.playerVelocity = -9;
            this.worm.play("jump")

        })

        this.reintentar = this.add.image(200, 400, "reintentar").setScale(2).setInteractive().setVisible(false);
        this.reset= this.add.image(380, 780, "reset").setScale(0.2).setInteractive().setVisible(true).setOrigin(1);
        this.jugar = this.add.image(200, 400, "jugar").setScale(2).setInteractive().setVisible(true);


        this.jugar.on('pointerdown', () => {
            //start the game
            this.isPlaying=true;
            this.jugar.setVisible(false);
            this.worm.setVisible(true);
        })



        this.reintentar.on('pointerdown', () => {

            //reset the game
            this.cameras.main.zoom=1;
            this.isPlaying = true;
            this.worm.y = 130;
            this.worm.play("jump");
            this.playerVelocity = 0;
            this.noteCounter=0;
            this.puntaje.text="0/26";
            this.pig.setVisible(false);
            this.birthday.stop();
            this.balloonCounter=0;

            for (var i = this.obstacles.length - 1; i >= 0; i--) {
                this.obstacles[i].destroy();
            }

            this.obstacles = []

            this.listTempos.forEach((element, index) => {

                this.createRectangle(element * 150, this.listNotes[index]);

            });

            this.reintentar.setVisible(false);

        })


        this.reset.on('pointerdown', () => {

            //reset the game
            this.cameras.main.zoom=1;
            this.isPlaying = true;
            this.worm.y = 130;
            this.worm.play("jump");
            this.playerVelocity = 0;
            this.noteCounter=0;
            this.puntaje.text="0/26";
            this.pig.setVisible(false);
            this.birthday.stop();
            this.balloonCounter=0;

            for (var i = this.obstacles.length - 1; i >= 0; i--) {
                this.obstacles[i].destroy();
            }

            this.obstacles = []

            this.listTempos.forEach((element, index) => {

                this.createRectangle(element * 150, this.listNotes[index]);

            });

            this.reintentar.setVisible(false);

        })




        this.worm = this.add.sprite(130, 300, 'worm', 2).setScale(2).setVisible(false);
        this.worm.play("jump");

        this.pig = this.add.sprite(200, 550, 'pig', 2).setScale(2).setVisible(false);
        this.pig.play("pig");

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

        this.birthday = this.sound.add('birthday', {
            delay: 0
        }).setVolume(0.6);


        this.listNotes = [this.g4, this.g4, this.a5, this.g4, this.c5, this.b5,
            this.g4, this.g4, this.a5, this.g4, this.d5, this.c5,
            this.g4, this.g4, this.g5, this.e5, this.c5, this.b5, this.a5,
            this.f5, this.f5, this.e5, this.c5, this.d5, this.c5
        ];
        this.obstacles = [];

        this.listTempos = [8, 11, 12, 16, 20, 24, 32, 35, 36, 40, 44, 48, 56, 59, 60, 64, 68, 72, 76, 84, 87, 88, 92, 96, 100]

        this.listTempos.forEach((element, index) => {

            this.createRectangle(element * 150, this.listNotes[index]);

        });




        this.noteCounter = 0;

        this.puntaje=this.add.text(200,100,this.noteCounter+"/26" , {fontFamily: 'VT323',fontSize:90}).setOrigin(0.5).setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

        this.input.keyboard.on('keydown_SPACE', (event) => {
            if (!this.isPlaying) return;
            this.playerVelocity = -9;
            this.worm.play("jump");


        });


        this.balloonCounter = 0;
        this.playerVelocity = 0;

    },



    update: function () {


        if (!this.isPlaying) return;


        //paralax effect
        this.bg1_a.x -= 0.2
        this.bg1_b.x -= 0.2

        this.bg2_a.x -= 0.4
        this.bg2_b.x -= 0.4

        this.bg3_a.x -= 1
        this.bg3_b.x -= 1

        this.plataforma1.x -= speed;
        this.plataforma2.x -= speed;


        if (this.bg1_a.x < -600) this.bg1_a.x = 600
        if (this.bg1_b.x < -600) this.bg1_b.x = 600
        if (this.bg2_a.x < -600) this.bg2_a.x = 600
        if (this.bg2_b.x < -600) this.bg2_b.x = 600
        if (this.bg3_a.x < -600) this.bg3_a.x = 600
        if (this.bg3_b.x < -600) this.bg3_b.x = 600
        if (this.plataforma1.x < -600) this.plataforma1.x = 600;
        if (this.plataforma2.x < -600) this.plataforma2.x = 600;

        this.obstacles.forEach((item, index, object) => {
            item.x -= speed;
            if (item.x < -100) {
                this.balloonCounter++;
                item.destroy()
                object.splice(index, 1);
            }
            if (doOverlap(item, this.worm) && !item.exploded) {
                item.note.play();

                this.noteCounter++;
                this.puntaje.text=this.noteCounter+"/26"
                item.exploded = true;
                item.play("explode");
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

                if (this.balloonCounter >= 24) {
                    if (this.noteCounter >= 24) { // if all the ballons exploded
                        this.birthday.play();
                        this.pig.setVisible(true);
                        this.tweens.add({
                            targets: this.cameras.main,
                            zoom: {
                                from: 1,
                                to: 1.5
                            },
                            duration: 4000,
                            ease: 'Linear',
                            loop: 0,
                        });
                    }

                    this.isPlaying = false;
                    this.reintentar.setVisible(true);
                    this.worm.play("dance");
                }


            }
        }

    },


    createRectangle: function (x, note) {

        newObstacle = this.add.sprite(700 + x, 450 + Math.random() * 50, 'balloon', 2).setScale(2);
        newObstacle.play("idle")
        newObstacle.exploded = false;
        newObstacle.note = note;
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