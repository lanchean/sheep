import { Currency, Map, Lock } from "./classes/baseClasses";
import IResource from "./classes/IResource";
import Discovery from "./classes/discovery/Discovery";
import discoveriesData from "./data/discoveries";
import { producersData } from "./data/producers";
import locksData from "./data/locks";
import Producer from "./classes/producer/Producer";
import IGameObject from "./classes/IGameObject";

export default class GameState {
  lastTick: number;
  currentSelection: IGameObject;

  locks: Map<boolean>;

  discoveries: Discovery[];

  producers: Producer[];

  resources: Map<IResource> = {
    cash: { name: "Cash", amount: 100, gainPerSecond: 0, precision: 0 },
    wheat: { name: "Wheat", amount: 100, gainPerSecond: 0, precision: 0, limit: 100 }
  }

  constructor() {
    this.lastTick = Date.now();

    this.producers = producersData.map(v => new Producer(v, { quantity: 0 }));
    this.discoveries = discoveriesData.map(v => new Discovery(v, { done: false }));

    this.currentSelection = this.producers[0];

    this.locks = locksData;
  }
}
