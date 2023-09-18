import Phaser from 'phaser';

export default class EnemySpawner {
  constructor(scene, enemyKey = 'cat') {
    this.scene = scene;
    this.key = enemyKey;

    this._group = this.scene.physics.add.group();
  }

  get group() {
    return this._group;
  }

  spawn(playerX = 0) {
    const x =
      playerX < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    const enemy = this.group.create(x, 16, this.key);
    enemy.setBounce(0.7);
    enemy.setScale(0.07);
    // enemy.setCollideWorldBounds(true);
    enemy.setVelocity(Phaser.Math.Between(-100, 100), 20);

    return enemy;
  }
}
