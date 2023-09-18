import Phaser from 'phaser';
import FlyingFrisbee from './FlyingFrisbee';
import ScoreLabel from './ScoreLabel';
import EnemySpawner from './EnemySpawner';

const PLAYER_KEY = 'dog';
const PLATFORM_KEY = 'platform';
const FRISBEE_KEY = 'frisbee';
const ENEMY_KEY = 'cat';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.frisbees = undefined;
    this.enemies = undefined;
    this.health = 10;
    this.healthText = undefined;
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image(FRISBEE_KEY, 'assets/frisbee.png');
    this.load.image(ENEMY_KEY, 'assets/cat.png');
    this.load.image(PLATFORM_KEY, 'assets/platform.png');
    this.load.spritesheet(PLAYER_KEY, 'assets/dogs.png', {
      frameWidth: 1411,
      frameHeight: 992,
    });
  }

  create() {
    this.add.image(400, 300, 'sky');
    const platforms = this.createPlatforms();
    this.add.image(400, 545, 'ground').setScale(0.25);
    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    this.healthText = this.add.text(16, 38, `health: ${this.health}`);

    this.player = this.createPlayer();
    this.frisbees = this.createFrisbees();
    this.enemies = new EnemySpawner(this, ENEMY_KEY);

    const enemyGroup = this.enemies.group;

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.frisbees, platforms);
    this.physics.add.collider(enemyGroup, platforms);
    this.physics.add.collider(
      this.player,
      enemyGroup,
      this.catScratch,
      null,
      this
    );

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 675, PLATFORM_KEY).setScale(2.2).refreshBody();
    platforms.create(625, 425, PLATFORM_KEY).setScale(0.8).refreshBody();
    platforms.create(135, 315, PLATFORM_KEY).setScale(0.8).refreshBody();
    platforms.create(725, 235, PLATFORM_KEY).setScale(0.8).refreshBody();

    return platforms;
  }

  createFrisbees() {
    const x =
      this.player.x > 400
        ? Phaser.Math.RND.between(50, 400)
        : Phaser.Math.RND.between(400, 600);
    const y =
      this.player.y > 300
        ? Phaser.Math.RND.between(50, 300)
        : Phaser.Math.RND.between(300, 500);

    const frisbees = this.physics.add.group({
      key: FRISBEE_KEY,
      allowGravity: false,
    });

    frisbees.add(new FlyingFrisbee(this, x, y, 20, 20, -0.01), true);

    this.physics.add.overlap(
      this.player,
      frisbees,
      this.collectFrisbees,
      null,
      this
    );

    return frisbees;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, PLAYER_KEY);
    player.setScale(0.09);
    player.setBounce(0.3);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 1,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: PLAYER_KEY, frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'jump',
      frames: [{ key: PLAYER_KEY, frame: 3 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 1,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }

  createScoreLabel(x, y, score) {
    const label = new ScoreLabel(this, x, y, score);
    this.add.existing(label);
    return label;
  }

  collectFrisbees(player, frisbee) {
    frisbee.disableBody(true, true);
    this.scoreLabel.add(1);
    this.createFrisbees();
    this.enemies.spawn(player.x);
  }

  catScratch(player, enemy) {
    this.health = this.health - 1;
    this.healthText.setText('health: ' + this.health);
    enemy.setTint(0xff0000);
    enemy.disableBody(true, true);
  }

  update() {
    if (!this.health) {
      this.player.anims.play('turn');
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.flipX = false;
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.flipX = true;
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-355);
      this.player.anims.play('turn');
    }
  }
}
