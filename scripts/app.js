class BingoMiniApp {
    constructor() {
        this.currentTab = 'lobby';
        this.gameState = 'idle'; // idle, waiting, playing, ended
        this.userData = null;
        this.gameData = null;
        this.socket = null;
        
        this.init();
    }

    async init() {
        // Initialize app
        await this.loadUserData();
        this.setupEventListeners();
        this.updateUI();
        
        // Hide loading overlay
        this.hideLoading();
        
        console.log('Bingo Mini App initialized');
    }

    async loadUserData() {
        // Load user data from Telegram
        const tgUser = window.telegramApp.getUserInfo();
        
        // Try to load from localStorage
        const savedData = localStorage.getItem(`bingo_user_${tgUser.id}`);
        
        if (savedData) {
            this.userData = JSON.parse(savedData);
        } else {
            // Create new user
            this.userData = {
                id: tgUser.id,
                name: tgUser.name,
                avatar: tgUser.avatar,
                level: 1,
                xp: 0,
                coins: 100,
                gamesPlayed: 0,
                gamesWon: 0,
                achievements: []
            };
            this.saveUserData();
        }
        
        this.updateUserUI();
    }

    saveUserData() {
        localStorage.setItem(`bingo_user_${this.userData.id}`, JSON.stringify(this.userData));
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab, .nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Game mode buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleAction(action);
            });
        });

        // Modal handling
        document.querySelectorAll('.modal-close, [data-action="cancel-room"]').forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal('roomModal');
            });
        });

        // Form submissions
        document.querySelector('[data-action="create-room-confirm"]').addEventListener('click', () => {
            this.createPrivateRoom();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscape();
            }
        });
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update navigation state
        if (!window.appHistory) window.appHistory = [];
        window.appHistory.push({ tab });
        window.telegramApp.updateNavigation({ tab });

        // Update UI
        this.updateUI();

        // Tab-specific initialization
        switch (tab) {
            case 'game':
                this.initializeGameTab();
                break;
            case 'leaderboard':
                this.loadLeaderboard();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    handleAction(action) {
        switch (action) {
            case 'quick-play':
                this.quickPlay();
                break;
            case 'create-room':
                this.showRoomModal();
                break;
            case 'join-tournament':
                this.joinTournament();
                break;
            case 'start-game':
                this.startGame();
                break;
            case 'call-bingo':
                this.callBingo();
                break;
            case 'leave-game':
                this.leaveGame();
                break;
            case 'play-again':
                this.playAgain();
                break;
            case 'back-to-lobby':
                this.backToLobby();
                break;
        }
    }

    async quickPlay() {
        this.showLoading('Finding a game...');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const game = {
                id: 'quick_' + Date.now(),
                type: 'quick',
                players: [this.userData],
                maxPlayers: 8,
                status: 'waiting'
            };
            
            this.joinGame(game);
        } catch (error) {
            console.error('Quick play error:', error);
            window.telegramApp.showAlert('Failed to find a game. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    showRoomModal() {
        this.showModal('roomModal');
    }

    async createPrivateRoom() {
        const roomName = document.getElementById('roomName').value || `Room ${Date.now()}`;
        const maxPlayers = document.getElementById('maxPlayersSelect').value;
        const gameSpeed = document.getElementById('gameSpeed').value;

        const room = {
            id: 'room_' + Date.now(),
            name: roomName,
            type: 'private',
            maxPlayers: parseInt(maxPlayers),
            speed: gameSpeed,
            host: this.userData.id,
            players: [this.userData],
            status: 'waiting'
        };

        this.closeModal('roomModal');
        this.joinGame(room);
    }

    joinGame(game) {
        this.gameData = game;
        this.gameState = 'waiting';
        this.switchTab('game');
        this.updateGameUI();
        
        // Connect to game via WebSocket (simulated)
        this.connectToGame(game.id);
    }

    connectToGame(gameId) {
        // Simulate WebSocket connection
        console.log('Connecting to game:', gameId);
        
        // Simulate other players joining
        setTimeout(() => {
            this.simulatePlayerJoin();
        }, 2000);
        
        setTimeout(() => {
            this.simulatePlayerJoin();
        }, 3500);
    }

    simulatePlayerJoin() {
        if (!this.gameData) return;
        
        const botPlayer = {
            id: 'bot_' + Date.now(),
            name: 'Player' + Math.floor(Math.random() * 1000),
            avatar: '',
            isBot: true
        };
        
        this.gameData.players.push(botPlayer);
        this.updateGameUI();
        
        // Show notification
        window.telegramApp.showAlert(`${botPlayer.name} joined the game`);
    }

    startGame() {
        if (this.gameData.host !== this.userData.id) {
            window.telegramApp.showAlert('Only the host can start the game');
            return;
        }

        this.gameState = 'playing';
        this.gameData.status = 'playing';
        this.updateGameUI();
        
        // Generate bingo card for user
        this.generateBingoCard();
        
        // Start number calling (simulated)
        this.startNumberCalling();
    }

    generateBingoCard() {
        const bingoCard = [];
        const usedNumbers = new Set();
        
        // Generate numbers for each column B-I-N-G-O
        for (let col = 0; col < 5; col++) {
            const columnNumbers = [];
            const min = col * 15 + 1;
            const max = min + 14;
            
            while (columnNumbers.length < 5) {
                const num = Math.floor(Math.random() * (max - min + 1)) + min;
                if (!usedNumbers.has(num)) {
                    usedNumbers.add(num);
                    columnNumbers.push(num);
                }
            }
            
            columnNumbers.sort((a, b) => a - b);
            bingoCard.push(columnNumbers);
        }
        
        // Mark center as FREE
        this.userData.bingoCard = bingoCard;
        this.renderBingoCard();
    }

    renderBingoCard() {
        const grid = document.getElementById('bingoGridMini');
        grid.innerHTML = '';
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'bingo-cell-mini';
                
                if (row === 2 && col === 2) {
                    cell.textContent = 'FREE';
                    cell.classList.add('free');
                } else {
                    cell.textContent = this.userData.bingoCard[col][row];
                    cell.dataset.number = this.userData.bingoCard[col][row];
                    
                    cell.addEventListener('click', () => {
                        this.markNumber(this.userData.bingoCard[col][row]);
                    });
                }
                
                grid.appendChild(cell);
            }
        }
    }

    startNumberCalling() {
        // Enable bingo button
        document.getElementById('callBingo').disabled = false;
        
        // Simulate number calling
        let calledNumbers = [];
        const callInterval = setInterval(() => {
            if (this.gameState !== 'playing') {
                clearInterval(callInterval);
                return;
            }
            
            let newNumber;
            do {
                newNumber = Math.floor(Math.random() * 75) + 1;
            } while (calledNumbers.includes(newNumber));
            
            calledNumbers.push(newNumber);
            this.onNumberCalled(newNumber);
            
            // Auto-mark if number is on card
            this.markNumber(newNumber);
            
            if (calledNumbers.length >= 75) {
                clearInterval(callInterval);
                this.endGame('All numbers called!');
            }
        }, 3000);
    }

    onNumberCalled(number) {
        // Update current number display
        document.getElementById('currentNumberMini').textContent = number;
        
        // Add to called numbers list
        const calledNumbersEl = document.getElementById('calledNumbersMini');
        const numberEl = document.createElement('div');
        numberEl.className = 'called-number-mini';
        numberEl.textContent = number;
        calledNumbersEl.appendChild(numberEl);
        
        // Scroll to bottom
        calledNumbersEl.scrollTop = calledNumbersEl.scrollHeight;
        
        // Haptic feedback
        window.telegramApp.vibrate('light');
    }

    markNumber(number) {
        // Mark number on bingo card
        document.querySelectorAll('.bingo-cell-mini').forEach(cell => {
            if (cell.dataset.number == number) {
                cell.classList.add('marked');
                
                // Check for bingo
                if (this.checkBingo()) {
                    this.callBingo();
                }
            }
        });
    }

    checkBingo() {
        // Simplified bingo check - in real app, implement proper pattern checking
        const markedCount = document.querySelectorAll('.bingo-cell-mini.marked').length;
        return markedCount >= 5; // Simple check for demo
    }

    callBingo() {
        this.gameState = 'ended';
        this.showWinModal();
        
        // Update user stats
        this.userData.gamesPlayed++;
        this.userData.gamesWon++;
        this.userData.coins += 50;
        this.userData.xp += 25;
        
        this.saveUserData();
        this.updateUserUI();
        
        // Haptic feedback
        window.telegramApp.vibrate('success');
    }

    showWinModal() {
        this.showModal('winModal');
    }

    leaveGame() {
        this.gameState = 'idle';
        this.gameData = null;
        this.switchTab('lobby');
    }

    playAgain() {
        this.closeModal('winModal');
        this.quickPlay();
    }

    backToLobby() {
        this.closeModal('winModal');
        this.leaveGame();
    }

    // UI Management
    updateUI() {
        // Update based on current tab and game state
        this.updateGameUI();
    }

    updateUserUI() {
        if (!this.userData) return;
        
        // Update user info in various places
        const elements = {
            userName: this.userData.name,
            userLevel: `Level ${this.userData.level} • ${this.userData.coins} coins`,
            gamesPlayed: this.userData.gamesPlayed,
            wins: this.userData.gamesWon,
            winRate: this.userData.gamesPlayed > 0 
                ? Math.round((this.userData.gamesWon / this.userData.gamesPlayed) * 100) + '%'
                : '0%'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    updateGameUI() {
        if (!this.gameData) return;
        
        // Update game info
        document.getElementById('gameRoom').textContent = this.gameData.name || `Room ${this.gameData.id}`;
        document.getElementById('playersCount').textContent = this.gameData.players.length;
        document.getElementById('maxPlayers').textContent = this.gameData.maxPlayers;
        
        // Update game status
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = this.gameData.status === 'waiting' 
            ? `Waiting for players... (${this.gameData.players.length}/${this.gameData.maxPlayers})`
            : 'Game in progress!';
        
        // Update start button
        const startButton = document.getElementById('startGame');
        startButton.disabled = this.gameData.host !== this.userData.id || this.gameData.players.length < 2;
        
        // Update players list
        this.updatePlayersList();
    }

    updatePlayersList() {
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';
        
        this.gameData.players.forEach(player => {
            const playerEl = document.createElement('div');
            playerEl.className = 'player-item';
            
            playerEl.innerHTML = `
                <img src="${player.avatar}" alt="${player.name}" class="player-avatar" 
                     onerror="this.style.display='none'">
                <div class="player-info">
                    <p class="player-name">${player.name} ${player.id === this.userData.id ? '(You)' : ''}</p>
                    <p class="player-status">${player.isBot ? 'Bot' : 'Ready'}</p>
                </div>
                ${player.id === this.gameData.host ? '<span class="host-badge">👑</span>' : ''}
            `;
            
            playersList.appendChild(playerEl);
        });
    }

    // Utility methods
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'flex';
        overlay.querySelector('p').textContent = message;
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    toggleTheme() {
        // This would toggle between light/dark in a real app
        window.telegramApp.showAlert('Theme toggle would change here');
    }

    handleEscape() {
        if (document.querySelector('.modal.active')) {
            document.querySelector('.modal.active').classList.remove('active');
        } else {
            window.telegramApp.handleBackButton();
        }
    }

    // Tournament and other features
    async joinTournament() {
        window.telegramApp.showAlert('Tournament feature coming soon!');
    }

    async loadLeaderboard() {
        // Simulate leaderboard data
        const leaderboard = [
            { rank: 1, name: 'Bingo Master', score: 1250, isUser: false },
            { rank: 2, name: 'Lucky Player', score: 980, isUser: false },
            { rank: 3, name: this.userData.name, score: 875, isUser: true },
            { rank: 4, name: 'Telegram User', score: 760, isUser: false },
            { rank: 5, name: 'Bingo Pro', score: 650, isUser: false }
        ];
        
        this.renderLeaderboard(leaderboard);
    }

    renderLeaderboard(leaderboard) {
        const list = document.getElementById('leaderboardList');
        list.innerHTML = '';
        
        leaderboard.forEach(entry => {
            const entryEl = document.createElement('div');
            entryEl.className = `leaderboard-entry ${entry.isUser ? 'user-entry' : ''}`;
            
            entryEl.innerHTML = `
                <div class="entry-rank">#${entry.rank}</div>
                <div class="entry-name">${entry.name}</div>
                <div class="entry-score">${entry.score} pts</div>
            `;
            
            list.appendChild(entryEl);
        });
    }

    loadProfile() {
        // Update profile tab with current user data
        document.getElementById('profileName').textContent = this.userData.name;
        document.getElementById('profileLevel').textContent = this.userData.level;
        document.getElementById('profileGames').textContent = this.userData.gamesPlayed;
        document.getElementById('profileWins').textContent = this.userData.gamesWon;
        document.getElementById('profileWinRate').textContent = 
            this.userData.gamesPlayed > 0 
                ? Math.round((this.userData.gamesWon / this.userData.gamesPlayed) * 100) + '%'
                : '0%';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bingoApp = new BingoMiniApp();
});