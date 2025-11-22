class NumberGenerator {
    constructor() {
        this.availableNumbers = Array.from({length: 75}, (_, i) => i + 1);
        this.calledNumbers = [];
        this.reset();
    }

    reset() {
        this.availableNumbers = Array.from({length: 75}, (_, i) => i + 1);
        this.calledNumbers = [];
        this.shuffleArray(this.availableNumbers);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getNextNumber() {
        if (this.availableNumbers.length === 0) {
            return null;
        }

        const number = this.availableNumbers.pop();
        this.calledNumbers.push(number);
        return number;
    }

    getCalledNumbers() {
        return [...this.calledNumbers];
    }

    getAvailableNumbers() {
        return [...this.availableNumbers];
    }

    getNumberStats() {
        return {
            called: this.calledNumbers.length,
            remaining: this.availableNumbers.length,
            total: 75
        };
    }
}