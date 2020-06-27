const config={
	scale: {
        mode: Phaser.Scale.FIT,
		parent : 'gameContainer',
		autoCenter: Phaser.Scale.CENTER_BOTH,	
		width:400,
		height: 800
	},
	dom: {
        createContainer: true
    },
	pixelArt: true,
	type: Phaser.AUTO,
	scene: [mainScene],
	transparent: true,
	// audio: {
	// 	disableWebAudio: true,
    // }
}
var Game;
function initGame(){
	Game=new Phaser.Game(config);
}

initGame();