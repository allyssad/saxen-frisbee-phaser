import Phaser from 'phaser';

const formatScore = (score) => `treats: ${score}`;

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, score) {
    super(scene, x, y, formatScore(score));
    this.score = score;
  }

  add(points) {
    this.score += points;
    this.updateScoreText();
  }

  updateScoreText() {
    this.setText(formatScore(this.score));
  }
}
