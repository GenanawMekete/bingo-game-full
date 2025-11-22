class GameTimer {
    constructor() {
        this.gameInterval = 30; // 30 seconds between games
        this.currentTimer = this.gameInterval;
        this.timerInterval = null;
        this.isGameActive = false;
        this.nextGameTime = null;
        this.init();
    }

    init() {
        this.startTimer();
        this.setupEventListeners();
    }

    startTimer() {
        this.currentTimer = this.gameInterval;
        this.nextGameTime = Date.now() + (this.gameInterval * 1000);
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.currentTimer--;
            this.updateTimerDisplay();
            
            if (this.currentTimer <= 0) {
                this.onGameStart();
                this.currentTimer = this.gameInterval;
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('gameTimer');
        const joinTimerElement = document.getElementById('joinTimer');
        
        if (timerElement) {
            timerElement.textContent = this.formatTime(this.currentTimer);
        }
        
        if (joinTimerElement) {
            joinTimerElement.textContent = this.currentTimer;
        }
        
        // Update modal timer if game is active
        if (this.isGameActive) {
            const modalTimer = document.getElementById('modalTimer');
            if (modalTimer) {
                modalTimer.textContent = this.currentTimer;
            }
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    onGameStart() {
        if (!this.isGameActive) {
            // Auto-join if player has selected cards
            const selectedCards = window.cardPoolManager.getSelectedCards();
            if (selectedCards.length > 0) {
                this.startGame(selectedCards);
            }
        }
        
        // Update game counter
        this.updateGameCounter();
    }

    startGame(selectedCards) {
        this.isGameActive = true;
        
        // Show active game modal
        document.getElementById('activeGameModal').classList.add('active');
        
        // Render active cards
        window.cardPoolManager.renderActiveCards(selectedCards);
        
        // Start number calling simulation
        this.startNumberCalling();
        
        // Update player count (simulate random fluctuation)
        this.updatePlayerCount();
    }

    startNumberCalling() {
        // Simulate number calling every 2 seconds
        let calledNumbers = [];
        const callInterval = setInterval(() => {
            if (!this.isGameActive) {
                clearInterval(callInterval);
                return;
            }
            
            const newNumber = this.callRandomNumber(calledNumbers);
            calledNumbers.push(newNumber);
            
            // Update UI
            this.updateCurrentCall(newNumber, calledNumbers.length);
            
            // Auto-mark if enabled
            if (document.getElementById('autoMark').checked) {
                window.cardPoolManager.markNumberOnActiveCards(newNumber.value);
            }
            
            if (calledNumbers.length >= 75) {
                clearInterval(callInterval);
                this.endGame('All numbers called!');
            }
        }, 2000);
    }

    callRandomNumber(calledNumbers) {
        let number;
        do {
            number = Math.floor(Math.random() * 75) + 1;
        } while (calledNumbers.some(n => n.value === number));
        
        const letters = ['B', 'I', 'N', 'G', 'O'];
        const letterIndex = Math.floor((number - 1) / 15);
        
        return {
            value: number,
            letter: letters[letterIndex],
            display: `${letters[letterIndex]}-${number}`
        };
    }

    updateCurrentCall(number, callCount) {
        document.getElementById('currentLetter').textContent = number.letter;
        document.getElementById('currentValue').textContent = number.value;
        document.getElementById('callNumber').textContent = callCount + 645; // Starting from sample
        document.getElementById('calledCount').textContent = callCount;
    }

    updatePlayerCount() {
        // Simulate player count changes
        const basePlayers = 240;
        const fluctuation = Math.floor(Math.random() * 20) - 10; // ±10 players
        const currentPlayers = Math.max(2, basePlayers + fluctuation);
        
        document.getElementById('activePlayers').textContent = currentPlayers;
    }

    updateGameCounter() {
        const totalGamesElement = document.getElementById('totalGames');
        if (totalGamesElement) {
            const currentTotal = parseInt(totalGamesElement.textContent) || 1920;
            totalGamesElement.textContent = currentTotal + 1;
        }
    }

    endGame(reason) {
        this.isGameActive = false;
        console.log('Game ended:', reason);
        
        // In a real game, you'd determine winners here
        // For demo, we'll just close the modal after a delay
        setTimeout(() => {
            document.getElementById('activeGameModal').classList.remove('active');
        }, 3000);
    }

    setupEventListeners() {
        // Join next game button
        document.getElementById('joinNextGame').addEventListener('click', () => {
            const selectedCards = window.cardPoolManager.getSelectedCards();
            if (selectedCards.length > 0) {
                this.startGame(selectedCards);
            }
        });

        // Leave game button
        document.getElementById('leaveGame').addEventListener('click', () => {
            this.isGameActive = false;
            document.getElementById('activeGameModal').classList.remove('active');
        });

        // Call BINGO button
        document.getElementById('callBingo').addEventListener('click', () => {
            this.onBingoCalled();
        });
    }

    onBingoCalled() {
        // In a real game, this would validate the bingo with the server
        // For demo, we'll just show the win modal
        document.getElementById('activeGameModal').classList.remove('active');
        document.getElementById('bingoWinModal').classList.add('active');
        
        // Update wallet with winnings
        this.addWinnings();
    }

    addWinnings() {
        const betAmount = window.cardPoolManager.currentBet;
        const cardCount = window.cardPoolManager.selectedCards.size;
        const winnings = betAmount * cardCount * 10; // 10x payout for demo
        
        // Update wallet display
        const walletElement = document.getElementById('walletAmount');
        const currentBalance = parseInt(walletElement.textContent) || 190;
        walletElement.textContent = currentBalance + winnings;
        
        // Update win amount display
        document.getElementById('winAmount').textContent = winnings;
        
        // Update games won counter
        const gamesWonElement = document.getElementById('gamesWon');
        const gamesWon = parseInt(gamesWonElement.textContent) || 14;
        gamesWonElement.textContent = gamesWon + 1;
        
        // Update win rate
        const totalGames = parseInt(document.getElementById('totalGames').textContent) || 1920;
        const winRate = ((gamesWon + 1) / totalGames * 100).toFixed(1);
        document.getElementById('winRate').textContent = winRate + '%';
    }

    // Utility method to format large numbers
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
}

// Initialize game timer
window.gameTimer = new GameTimer();