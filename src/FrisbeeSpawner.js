import Phaser from 'phaser';
import FlyingFrisbee from './FlyingFrisbee';

export default class FrisbeeSpawner {
  constructor(scene, frisbeeKey = 'frisbee') {
    this.scene = scene;
    this.key = frisbeeKey;
    this.group = this.scene.add.group();
  }

  getGroup() {
    return this.group;
  }

  spawn() {
    const x = Phaser.Math.RND.between(100, 600);
    const y = Phaser.Math.RND.between(100, 400);
    const frisbee = new FlyingFrisbee(this, x, y, 40, 50, -0.007);

    return frisbee;
  }
}
