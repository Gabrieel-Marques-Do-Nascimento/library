import {
  Game,
  GameClassesAssets,
  GameEnumsAssets,
  GameKeywordsAssets,
  GameSnippets,
} from './src/app/models';

const { join } = require('path');
const { readFileSync } = require('fs');
const { execSync } = require('child_process');

const gamesRaw = readFileSync('games.json');
const games: Game[] = JSON.parse(gamesRaw);

run('npm run generate:support-info src/assets/support-info.json');

// GENERATE DATA FILES
games.forEach((game) => {
  const assets = assetsDir(game);
  const gameJson = join('../', game, `${game}.json`);
  const enumsJson = join('../', game, `enums.json`);

  [
    `[ -d ${assets} ] || mkdir ${assets}`,
    `npm run generate:enums ${enumsJson} ${join(assets, 'enums.js')}`,
  ].forEach((x) => run(x));

  run(`cp *.json ../editor/src/assets/${game}`, join('..', game));

  let dest = assetsDirCargo(game);
  if (GameEnumsAssets[game]) {
    cargo(`cargo run enums ${enumsJson} > ${join(dest, 'enums.txt')}`);
  }
  if (GameClassesAssets[game]) {
    cargo(
      `cargo run classes ${gameJson} ${game} > ${join(dest, 'classes.db')}`
    );
  }
  if (GameKeywordsAssets[game]) {
    cargo(
      `cargo run keywords ${gameJson} ${game} > ${join(dest, 'keywords.txt')}`
    );
  }
  if (GameSnippets[game].includes(game)) {
    const srcDir = join('..', game, 'snippets');
    cargo(`cargo run snippets ${srcDir} > ${join(dest, 'snippets.json')}`);
  }
});

function assetsDir(game: string) {
  return join('src', 'assets', game);
}

function assetsDirCargo(game: string) {
  return join('..', 'editor', assetsDir(game));
}

function run(cmd: string, cwd = process.cwd()) {
  execSync(cmd, {
    cwd,
    stdio: [0, 1, 2],
  });
}

function cargo(cmd: string) {
  run(cmd, '../generator');
}