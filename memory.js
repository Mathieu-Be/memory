

class Memory {
    constructor(element_id, cardsRow = 4, cardsCol = 4) {
        this.element = document.querySelector(element_id);
        this.cardsRow = cardsRow;
        this.cardsCol = cardsCol;

        this.moves = 0;
        this.won = false;

        this.timeBadResponse = false;

        this.oldCardSelected = [];
        this.nbItemsDisplay = 0;

        this.board = this.generateTable();
        this.solutionBoard = this.generateTable(true);

        this.element.addEventListener('click', (event) => this.handle_click(event));
        this.render();
    }

    handle_click(event) {
        if (event.target.dataset.column !== undefined) {
            if (!this.timeBadResponse) {
                let cardSelected = event.target.dataset;

                this.board[cardSelected.row][cardSelected.column] = this.solutionBoard[cardSelected.row][cardSelected.column];
                this.nbItemsDisplay++;

                if (this.nbItemsDisplay > 1) {
                    this.timeBadResponse = true;
                    setTimeout(() => {
                        if (this.solutionBoard[this.oldCardSelected[0]][this.oldCardSelected[1]] != this.board[cardSelected.row][cardSelected.column]) {
                            this.board[this.oldCardSelected[0]][this.oldCardSelected[1]] = null;
                            this.board[cardSelected.row][cardSelected.column] = null;
                        }
                        this.render();
                        this.nbItemsDisplay = 0;
                        this.oldCardSelected = [cardSelected.row, cardSelected.column];
                        this.timeBadResponse = false;
                    }, 1000);
                } else {
                    this.oldCardSelected = [cardSelected.row, cardSelected.column];
                }
                this.render();
            }
        }


    }

    render() {
        this.element.innerHTML = "";

        for (let i = 0; i < this.cardsRow; i++) {
            let div = document.createElement('div');
            div.classList.add('row-memory');
            for (let j = 0; j < this.cardsCol; j++) {
                if (this.board[i][j] == null) {
                    let hide = document.createElement('div');
                    hide.classList.add('btn', 'btn-warning');
                    this.setAttributes(hide, { 'data-row': i, 'data-column': j });
                    div.appendChild(hide);
                } else {
                    let image = document.createElement('img');
                    this.setAttributes(image, {
                        'src': this.getImage(this.board[i][j]),
                        'data-row': i,
                        'data-column': j
                    });
                    div.appendChild(image);
                }
            }
            this.element.appendChild(div);
        }
    }

    setAttributes(element, attributes) {
        for (const index in attributes) {
            element.setAttribute(index, attributes[index]);
        }
    }

    generateTable(random = false) {
        let board = [];
        let randomImage = 0;
        let numberOfPairs = (this.cardsCol * this.cardsRow) / 2
        let boardCompleted = Array(numberOfPairs).fill(0);
        let randomImageFound = false;
        let row;

        for (let i = 0; i < this.cardsRow; i++) {
            if (random) {
                row = [];
                for (let j = 0; j < this.cardsCol; j++) {
                    randomImageFound = false;
                    while (!randomImageFound) {
                        randomImage = Math.floor(Math.random() * numberOfPairs);
                        if (boardCompleted[randomImage] < 2) {
                            boardCompleted[randomImage]++;
                            row.push(randomImage);
                            randomImageFound = true;
                        }
                    }
                }
                board.push(row);
            } else {
                board[i] = Array(this.cardsCol).fill(null);
            }
        }
        return board;
    }

    getImage(positionCardClicked) {
        return './img/img' + positionCardClicked.toString() + '.jpg';
    }
}

let memory = new Memory('#memory');
