class TelegramIntegration {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.init();
    }

    init() {
        // Expand the app to full height
        this.tg.expand();

        // Set theme params
        this.applyTheme();

        // Get user data
        this.user = this.tg.initDataUnsafe?.user || {
            id: Math.random().toString(36).substr(2, 9),
            first_name: 'Telegram User',
            username: 'telegram_user'
        };

        // Back button handling
        this.tg.BackButton.onClick(this.handleBackButton.bind(this));
        
        // Theme change handling
        this.tg.onEvent('themeChanged', this.applyTheme.bind(this));
        
        // Viewport changes
        this.tg.onEvent('viewportChanged', this.handleViewportChange.bind(this));

        console.log('Telegram Web App initialized:', {
            platform: this.tg.platform,
            version: this.tg.version,
            user: this.user
        });
    }

    applyTheme() {
        const theme = this.tg.colorScheme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Apply Telegram theme colors
        document.documentElement.style.setProperty('--tg-theme-bg-color', this.tg.themeParams.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', this.tg.themeParams.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-hint-color', this.tg.themeParams.hint_color || '#999999');
        document.documentElement.style.setProperty('--tg-theme-link-color', this.tg.themeParams.link_color || '#2481cc');
        document.documentElement.style.setProperty('--tg-theme-button-color', this.tg.themeParams.button_color || '#2481cc');
        document.documentElement.style.setProperty('--tg-theme-button-text-color', this.tg.themeParams.button_text_color || '#ffffff');
    }

    handleBackButton() {
        // Navigate back in app history or close if at root
        if (window.appHistory && window.appHistory.length > 1) {
            window.appHistory.pop();
            const previousState = window.appHistory[window.appHistory.length - 1];
            this.navigateTo(previousState);
        } else {
            this.tg.close();
        }
    }

    handleViewportChange() {
        // Adjust UI for viewport changes
        const viewportHeight = this.tg.viewportHeight;
        document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
    }

    navigateTo(state) {
        // Update UI based on navigation state
        this.updateNavigation(state);
    }

    updateNavigation(state) {
        // Update active tabs, show/hide back button, etc.
        const { tab, modal } = state || {};
        
        // Update tabs
        if (tab) {
            document.querySelectorAll('.nav-tab, .nav-button').forEach(element => {
                element.classList.remove('active');
            });
            document.querySelectorAll(`[data-tab="${tab}"]`).forEach(element => {
                element.classList.add('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');
        }

        // Show/hide back button
        if (window.appHistory.length > 1) {
            this.tg.BackButton.show();
        } else {
            this.tg.BackButton.hide();
        }
    }

    showAlert(message) {
        this.tg.showAlert(message);
    }

    showConfirm(message, callback) {
        this.tg.showConfirm(message, callback);
    }

    // Haptic feedback
    vibrate(type = 'light') {
        const hapticTypes = {
            light: 'impact',
            medium: 'impact',
            heavy: 'impact',
            success: 'notification',
            error: 'notification',
            warning: 'notification'
        };
        
        if (this.tg.HapticFeedback && hapticTypes[type]) {
            this.tg.HapticFeedback[hapticTypes[type]](type);
        }
    }

    // Share functionality
    shareScore(score) {
        const shareText = `I just scored ${score} points in Telegram Bingo! 🎯 Can you beat me?`;
        
        if (this.tg.shareScore) {
            this.tg.shareScore(shareText);
        } else {
            // Fallback: copy to clipboard or show share dialog
            navigator.clipboard.writeText(shareText).then(() => {
                this.showAlert('Score copied to clipboard!');
            });
        }
    }

    // Payment integration (for premium features)
    initiatePayment(product) {
        const paymentData = {
            title: product.name,
            description: product.description,
            prices: [{ label: product.name, amount: product.price * 100 }], // in cents
            currency: 'USD'
        };

        this.tg.openInvoice(paymentData, (status) => {
            if (status === 'paid') {
                this.onPaymentSuccess(product);
            } else {
                this.onPaymentFailed();
            }
        });
    }

    onPaymentSuccess(product) {
        console.log('Payment successful for:', product);
        this.vibrate('success');
        this.showAlert(`Thank you for purchasing ${product.name}!`);
    }

    onPaymentFailed() {
        console.log('Payment failed or was cancelled');
        this.showAlert('Payment was cancelled or failed. Please try again.');
    }

    // Get user info for UI
    getUserInfo() {
        return {
            id: this.user.id,
            name: this.user.first_name || this.user.username || 'Player',
            avatar: this.user.photo_url || '',
            username: this.user.username || ''
        };
    }

    // Close the app
    closeApp() {
        this.tg.close();
    }
}

// Initialize Telegram integration
window.telegramApp = new TelegramIntegration();