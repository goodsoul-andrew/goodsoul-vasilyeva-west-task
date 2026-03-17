import Card from "./Card.js";
import Game from "./Game.js";
import TaskQueue from "./TaskQueue.js";
import SpeedRate from "./SpeedRate.js";
import TaskQueue from "./TaskQueue.js";

// Отвечает является ли карта уткой.
function isDuck(card) {
    return card && card.quacks && card.swims;
}

// Отвечает является ли карта собакой.
function isDog(card) {
    return card instanceof Dog;
}

// Дает описание существа по схожести с утками и собаками
function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return "Утка-Собака";
    }
    if (isDuck(card)) {
        return "Утка";
    }
    if (isDog(card)) {
        return "Собака";
    }
    return "Существо";
}

class Creature extends Card {
    constructor(name, damage) {
        super(name, damage);
    }

    getDescriptions() {
        return [getCreatureDescription(this), super.getDescriptions()];
    }
}

// Основа для утки.
class Duck extends Creature {
    constructor() {
        super("Мирная Утка", 2);
    }

    quacks() {
        console.log("quack");
    }

    swims() {
        console.log("float: both;");
    }
}

// Основа для собаки.
class Dog extends Creature {
    constructor() {
        super("Пёс-Бандит", 3);
    }
}

class Trasher extends Dog {
    constructor() {
        super();
        this.name = "Громила";
        this.maxPower = 5;
        this.currentPowerPower = 5;
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        if (value > 0) {
            this.view.signalAbility(() => continuation(value - 1));
            return;
        }

        continuation(value);
    }

    getDescriptions() {
        return ["Получает урона на 1 меньше", ...super.getDescriptions()];
    }
}

class Gatling extends Creature {
    constructor() {
        super ('Гатлинг', 6);
    }
    attack (gameContext, continuation){
        const taskQueue = new TaskQueue();
        const { oppositePlayer } = gameContext;
        taskQueue.push (onDone => this.view.showAttack(onDone));
        for (const card of oppositePlayer.table) {
            taskQueue.push (onDone => {
                if (!card) {
                    onDone ();
                    return;
                }

                this.dealDamageToCreature(2, card, gameContext, onDone);
            })
        }

        taskQueue.continueWith(continuation);
    }
}

class Lad extends Dog {
    constructor () {
        this.name = "Браток";
        this.maxPower = 2;
        this.currentPowerPower = 2;
    }

    static getInGameCount (){
        return this.getInGameCount || 0;
    }

    static setInGameCount (value){
        this.inGameCount = value;


    }
}
// Колода Шерифа, нижнего игрока.
const seriffStartDeck = [new Duck(), new Duck(), new Duck()];

// Колода Бандита, верхнего игрока.
const banditStartDeck = [new Trasher()];

// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert("Победил " + winner.name);
});
