class Mouse {
    element = null;

    under = false;
    pUnder = false;

    x = null;
    y = null;

    pX = null;
    pY = null;

    left = false;
    pLeft = false;

    delta = false;
    pDelta = false;

    constructor(element) {
        this.element = element;

        const update = (e) => {
            this.x = e.clientX;
            this.y = e.clientY;
            this.delta = false;
            this.under = true;
        }

        element.addEventListener("mousemove", (e) => {
            this.tick();
            update(e);
        });

        element.addEventListener("mouseenter", (e) => {
            this.tick();
            update(e);
        });

        element.addEventListener("mouseleave", (e) => {
            this.tick();
            update(e);

            this.under = false;
        });

        element.addEventListener("mousedown", (e) => {
            this.tick();
            update(e);

            if (e.button === 0) {
                this.left = true;
            }
            if (e.altKey){
                this.x = e.clientX;
                this.y = e.clientY;
                this.delta = true;
            }
        });

        element.addEventListener("mouseup", (e) => {
            this.tick();
            update(e);

            if (e.button === 0) {
                this.left = false;
            }
        });


    }

    tick() {
        this.pX = this.x;
        this.pY = this.y;
        this.pUnder = this.under;
        this.pLeft = this.left;
        this.pDelta = this.delta;
        this.delta = false;
    }
}