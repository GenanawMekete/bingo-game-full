class BingoCard {
    constructor() {
        this.card = [];
        this.marked = Array(5).fill().map(() => Array(5).fill(false));
        this.gridElement = document.getElementById('bingoGrid');
        this.generateCard();
    }

    generateCard() {
        this.card = [];
        this.marked = Array(5).fill().map(() => Array(5).fill(false));
        
        // Generate numbers for each column
        for (let col = 0; col < 5; col++) {
            const columnNumbers = this.generateColumnNumbers(col);
            this.card.push(columnNumbers);
        }

        // Mark center as FREE
        this.marked[2][2] = true;
        
        this.renderCard();
    }

    generateColumnNumbers(columnIndex) {
        const numbers = new Set();
        const min = columnIndex * 15 + 1;
        const max = min + 14;

        while (numbers.size < 5) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.add(num);
        }

        return Array.from(numbers).sort((a, b) => a - b);
    }

    renderCard() {
        this.gridElement.innerHTML = '';
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'bingo-cell';
                
                if (row === 2 && col === 2) {
                    cell.textContent = 'FREE';
                    cell.classList.add('free');
                } else {
                    cell.textContent = this.card[col][row];
                    cell.dataset.number = this.card[col][row];
                }
                
                if (this.marked[row][col]) {
                    cell.classList.add('marked');
                }

                cell.addEventListener('click', () => this.toggleMark(row, col));
                this.gridElement.appendChild(cell);
            }
        }
    }

    toggleMark(row, col) {
        // Don't allow marking FREE space
        if (row === 2 && col === 2) return;

        this.marked[row][col] = !this.marked[row][col];
        this.renderCard();
    }

    markNumber(number) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.card[col][row] === number) {
                    this.marked[row][col] = true;
                }
            }
        }
        this.renderCard();
    }

    checkBingo() {
        // Check rows
        for (let row = 0; row < 5; row++) {
            if (this.marked[row].every(cell => cell)) {
                return true;
            }
        }

        // Check columns
        for (let col = 0; col < 5; col++) {
            if (this.marked.every(row => row[col])) {
                return true;
            }
        }

        // Check diagonals
        const diag1 = [0,1,2,3,4].every(i => this.marked[i][i]);
        const diag2 = [0,1,2,3,4].every(i => this.marked[i][4-i]);

        return diag1 || diag2;
    }

    getCardState() {
        return {
            card: this.card,
            marked: this.marked
        };
    }
}