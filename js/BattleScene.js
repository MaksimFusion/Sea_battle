class BattleScene extends Scene {
    playerTurn = true;
    status = null;
    removeEventListeners = [];
    shotHit = null;
    arr = [];

    init() {
        this.status = document.querySelector(".battlefield-status");
    }

    start() {
        const { opponent } = this.app;

        document
            .querySelectorAll(".app-actions")
            .forEach((element) => element.classList.add("hidden"));

        document
            .querySelector('[data-scene="battle"]')
            .classList.remove("hidden");

        opponent.clear();
        opponent.randomize(ShipView);


        this.removeEventListeners = [];

        const gaveupButton = document.querySelector('[data-action="gaveup"]');
        const againButton = document.querySelector('[data-action="again"]');

        gaveupButton.classList.remove("hidden");
        againButton.classList.add("hidden");

        this.removeEventListeners.push(
            addListener(gaveupButton, "click", () => {
                this.app.start("preparation");
            })
        );

        this.removeEventListeners.push(
            addListener(againButton, "click", () => {
                this.app.start("preparation");
            })
        );
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
        cells.forEach((cell) => cell.classList.remove("battlefield-item__active"));


        if (isEnd) {
            if (opponent.loser) {
                this.status.textContent = "Вы выиграли!";
            } else {
                this.status.textContent = "Вы проиграли ";
            }

            document.querySelector('[data-action="gaveup"]').classList.add("hidden");

            document
                .querySelector('[data-action="again"]')
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

        if (this.playerTurn) {
            this.status.textContent = "Ваш ход:";
        } else {
            this.status.textContent = "Ход комьютера:";
            setTimeout(() => this.makeShot(), 1000);

        }
    }

    makeShot() {
        if (!this.playerTurn) {
            if(this.shotHit){
                let {x, y} = this.shotHit;
                this.arr = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
                let b = Math.floor(Math.random() * this.arr.length);

                x = this.arr[b].shift();
                y = this.arr[b].pop();
                if (x < 0 || x > 9 || y < 0 || y > 9){
                    this.makeShot()
                } else {
                    this.setShot(x, y)
                }

            } else {
                let x = getRandomeBetween(0, 9);
                let y = getRandomeBetween(0, 9);
                this.setShot(x, y)
            }

        }

    }

    setShot(x, y) {
        const {player} = this.app;
        let shot = new ShotView(x, y);
        let result = player.addShot(shot);
        if (result) {
            this.playerTurn = shot.variant === "miss" ? true : false;
        }

        if(shot.variant ==="wounded"){
            this.shotHit = shot ;
        }
        if (shot.variant === "killed"){
            this.shotHit = null;
        }
    }
}
