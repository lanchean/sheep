import GameState from "../gameState";
import GameEngine from "./gameEngine";
import LockEngine from "./lockEngine";
import IBuyable from "../classes/IBuyable";
import { CurrencyValue, Currency, BuyAction } from "../classes/baseClasses";
import IProducer from "../classes/IProducer";
import TypeGuards from "../classes/typeGuards";

const engine = {
    tryBuyItem(state: GameState, itemId: string): IBuyable | undefined {
        const item = selectBuyableItem(state, itemId);

        if (!this.canBeBought(state, item)) {
            return undefined;
        }

        payForItem(state, item);

        takeAction(state, item);
        return item;
    },
    canBeBought(state: GameState, item: IBuyable): boolean {
        const realCost = this.getRealCost(item);
        return realCost.reduce((acc, cost) => acc && state.resources[cost.currency].amount >= cost.amount, true);
    },
    getRealCost(item: IBuyable): CurrencyValue[] {
        if (typeof item.quantity === 'undefined') {
            return item.rawCost;
        } else {
            return item.rawCost.map(v => ({ currency: v.currency, amount: v.amount * Math.pow(1.15, <number>item.quantity) }));
        }
    }
}

export default engine;

function selectBuyableItem(state: GameState, itemId: string): IBuyable {
    let candidates = GameEngine.getAllGameObjects(state).filter(p => p.id === itemId);
    const item = candidates.pop();
    if (candidates.length > 0 || typeof item === 'undefined') {
        throw new Error("Duplicate item ID or no item with given id: " + itemId);
    }
    return item;
}

function payForItem(state: GameState, item: IBuyable): void {
    const realCost = engine.getRealCost(item);
    realCost.forEach(singleCost => {
        state.resources[singleCost.currency].amount -= singleCost.amount;
    });
}

function takeAction(state: GameState, item: IBuyable) {
    switch (item.onBuyAction) {
        case 'addOne':
            if (TypeGuards.isProducer(item)) {
                item.quantity++;
            }
            break;
        case 'discover':
            if (TypeGuards.isDiscovery(item)) {
                item.done = true;
                LockEngine.removeLock(state, item.unlocks);
            }
            break;
    }
}
