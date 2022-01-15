const shipDates = [
    {size: 4, direction: "row", startX: 10, startY: 345},
    {size: 3, direction: "row", startX: 10, startY: 390},
    {size: 3, direction: "row", startX: 120, startY: 390},
    {size: 2, direction: "row", startX: 10, startY: 435},
    {size: 2, direction: "row", startX: 88, startY: 435},
    {size: 2, direction: "row", startX: 167, startY: 435},
    {size: 1, direction: "row", startX: 10, startY: 480},
    {size: 1, direction: "row", startX: 55, startY: 480},
    {size: 1, direction: "row", startX: 100, startY: 480},
    {size: 1, direction: "row", startX: 145, startY: 480},
]

class PreparationScene extends Scene {
    draggedShip = null;
    draggedOffsetX = 0;
    draggedOffsetY = 0;

    removeEventListeners = [];

    init() {
        this.manually();
    }

    start() {
        const { player, opponent } = this.app;

        opponent.clear();
        player.removeAllShots();
        player.ships.forEach((ship) => (ship.killed = false));

        this.removeEventListeners = [];

        document.querySelectorAll(".app-actions")
            .forEach((element) => element.classList.add("hidden"));

        document.querySelector(' [data-scene = "preparation"] ')
            .classList.remove("hidden");

        const manuallyButton = document.querySelector('[data-action= "manually"]');
        const randomizeButton = document.querySelector('[data-action= "randomize"]');
        const startButton = document.querySelector('[data-computer="start"]');



        this.removeEventListeners.push(
            addListener(manuallyButton,"click", ()=> this.manually()));
        this.removeEventListeners.push(
            addListener(randomizeButton, "click", ()=> this.randomize()));
        this.removeEventListeners.push(
            addListener(startButton, "click", () => this.startBattle()));

    }

    stop() {
        for (const removeEventListener of this.removeEventListeners) {
            removeEventListener();
        }

        this.removeEventListeners = [];
    }


    update() {
        const {mouse, player} = this.app;

        if (!this.draggedShip && mouse.left && !mouse.pLeft) {
            const ship = player.ships.find((ship) => ship.isUnder(mouse));

            if (ship) {
                const shipRect = ship.div.getBoundingClientRect();

                this.draggedShip = ship;
                this.draggedOffsetX = mouse.x - shipRect.left;
                this.draggedOffsetY = mouse.y - shipRect.top;

                ship.x = null;
                ship.y = null;

            }
        }

        //перетаскивание
        if (mouse.left && this.draggedShip) {
            const {left, top} = player.root.getBoundingClientRect();
            const x = mouse.x - left - this.draggedOffsetX;
            const y = mouse.y - top - this.draggedOffsetY;

            this.draggedShip.div.style.left = `${x}px`;
            this.draggedShip.div.style.top = `${y}px`;
        }

        //бросание
        if (!mouse.left && this.draggedShip) {
            const ship = this.draggedShip;
            this.draggedShip = null;

            const {left, top} = ship.div.getBoundingClientRect();
            const {width, height} = player.cells[0][0].getBoundingClientRect();

            const point = {
                x: left + width / 2,
                y: top + height / 2,
            };

            const cell = player.cells.flat()
                .find((cell) => isUnderPoint(point, cell));

            if (cell) {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y)

                player.removeShip(ship);
                player.addShip(ship, x, y);
            } else {
                player.removeShip(ship);
                player.addShip(ship);
            }

        }

        //вращание
        if (this.draggedShip && mouse.delta) {
            this.draggedShip.toggleDirection();
        }

        if (player.complete) {
            document.querySelector('[data-computer="start"]').disabled = false;
        } else {
            document.querySelector('[data-computer="start"]').disabled = true;
        }
    }

    randomize() {

        const {player} = this.app;

        player.randomize(ShipView);

        for (let i = 0; i < 10; i++) {
            const ship = player.ships[i];

            ship.startX = shipDates[i].startX;
            ship.startY = shipDates[i].startY;
        }
    }

    manually() {
        const {player} = this.app;

        player.removeAllShips();

        for (const {size, direction, startX, startY} of shipDates) {
            const ship = new ShipView(size, direction, startX, startY);
            player.addShip(ship);
        }
    }

    startBattle() {
        this.app.start("battle");
    }
}