class BattleScene extends Scene {
    playerTurn = true;
    status = null;

    removeEventListeners = [];

    init() {
        this.status = document.querySelector('.battlefield-status')
    }

    start() {
        const {opponent} = this.app;

        document.querySelectorAll(".app-actions")
            .forEach((element) => element.classList.add("hidden"));

        document.querySelector('[data-scene="battle"]')
            .classList.remove("hidden");

        opponent.clear();
        opponent.randomize(ShipView);

        this.removeEventListeners = [];

        const giveupButton = document.querySelector('[data-action="giveup"]')
        const againButton = document.querySelector('[data-action="again"]')

        giveupButton.classList.remove("hidden");
        againButton.classList.add("hidden");
        this.removeEventListeners.push(addEventListener(giveupButton, 'click', () => {
            this.app.start('preparation');
        }));
        this.removeEventListeners.push(addEventListener(againButton, 'click', () => {
            this.app.start('preparation');
        }));
    }

    stop() {
        for (const removeEventListener of this.removeEventListeners) {
            removeEventListener();
        }

        this.removeEventListeners = [];
    }

    update() {
        const {mouse, opponent, player} = this.app;
        const isEnd = opponent.loser || player.loser;

        const cells = opponent.cells.flat();
        cells.forEach((cell) => cell.classList.remove("battlefield-item__active"))

        if (isEnd) {
            if (opponent.loser) {
                this.status.textContent = "Ты выиграл!"
            } else {
                this.status.textContent = "Ты проиграл!"
            }
            document.querySelector('[data-action="giveup"]')
                .classList.add("hidden");
            document.querySelector('[data-action="again"]')
                .classList.remove("hidden");
            return;
        }


        if (isUnderPoint(mouse, opponent.table)) {
            const cell = cells.find((cell) => isUnderPoint(mouse, cell));

            if (cell) {
                cell.classList.add("battlefield-item__active");

                if (this.playerTurn && mouse.left && !mouse.pLeft) {

                    const x = parseInt(cell.dataset.x);
                    const y = parseInt(cell.dataset.y);

                    const shot = new ShotView(x, y);
                    const result = opponent.addShot(shot);

                    if (result) {
                        this.playerTurn = shot.variant === "miss" ? false : true;
                    }
                }
            }
        }
        if (!this.playerTurn) {
            const x = getRandomeBetween(0, 9);
            const y = getRandomeBetween(0, 9);

            const shot = new ShotView(x, y);
            const result = player.addShot(shot);

            if (result) {
                this.playerTurn = shot.variant === "miss" ? true : false;
            }
        }
        if (this.playerTurn) {
            this.status.texContent = 'Твой ход'
        } else {
            this.status.textContent = 'Ход компьютера'
        }
    }
}