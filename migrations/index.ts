import * as migration_20261001_121223_initial from './20261001_121223_initial';

export const migrations = [
  {
    up: migration_20261001_121223_initial.up,
    down: migration_20261001_121223_initial.down,
    name: '20261001_121223_initial'
  },
];
