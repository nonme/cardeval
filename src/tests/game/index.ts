import { Game, GameState } from 'src/game/Game.ts';
import { Hero } from 'src/game/entity/hero/Hero.ts';
import { HERO_STATS } from 'src/game/entity/hero/heroes.ts';
import { BotPlayer } from 'src/game/player/BotPlayer.ts';

const printState = (state: GameState) => {
  console.log(state.ticks, `${state.timeElapsed}s`, state.currentRound);
  const battles = state.currentBattles;
  battles?.forEach((battle, index) => {
    console.log(`Battle ${index} - ${battle.isFinished() ? 'Completed' : 'In Progress'}`);
    console.log('Hero A:');
    console.log(`HP: ${battle.getHeroA().getState().currentHealth}`);
    console.log(
      `Attack: ${battle.getHeroA().getStats().Attack} ${battle.getHeroA().getState().attackCharge}`,
    );
    console.log('Hero B');
    console.log(`HP: ${battle.getHeroB().getState().currentHealth}`);
    console.log(
      `Attack: ${battle.getHeroB().getStats().Attack} ${battle.getHeroB().getState().attackCharge}`,
    );
  });
};

const players = Array(8)
  .fill(null)
  .map((_, index) => new BotPlayer(index, new Hero(HERO_STATS.Ursa)));

const game = new Game(players);

const result = game.simulate();

console.log(result);

//game.simulateTicks(1000);

//const state3 = game.getState();
//printState(state3);
