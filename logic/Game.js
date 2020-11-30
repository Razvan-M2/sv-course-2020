class Game {
  constructor(options) {
    this.id = options.id
    this.players = options.players
    this.start();
  }

  gameLoop(id) {
    const objectsForDraw = [];
    games[id].players.forEach(function (player) {
      objectsForDraw.push(player.forDraw());
    })
    io.to(id).emit('game-loop', objectsForDraw);
  }

  start() {
    const that = this;
    setInterval(function () { this.gameLoop(that.id) }, 1000 / 60);
  }
}

module.exports = Game;

