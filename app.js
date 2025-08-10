// Hydration Timer App
class HydrationTimer {
    constructor() {
        this.workoutDuration = 0;
        this.waterAmount = 500;
        this.creatineAmount = 5;
        this.timeRemaining = 0;
        this.workoutStartTime = null;
        this.isPaused = false;
        this.pauseStartTime = null;
        this.totalPausedTime = 0;
        this.drinkIntervals = [];
        this.currentDrinkIndex = 0;
        this.waterConsumed = 0;
        this.timerInterval = null;
        this.drinkInterval = null;
        this.audioContext = null;
        this.audioBuffer = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadSettings();
        this.checkNotificationPermission();
        this.setupAudio();
    }

    setupEventListeners() {
        // Setup form
        document.getElementById('start-workout').addEventListener('click', () => this.startWorkout());
        
        // Timer controls
        document.getElementById('drink-now').addEventListener('click', () => this.recordDrink());
        document.getElementById('pause-workout').addEventListener('click', () => this.togglePause());
        document.getElementById('end-workout').addEventListener('click', () => this.endWorkout());
        
        // Results
        document.getElementById('new-workout').addEventListener('click', () => this.resetToSetup());
        
        // Notification modal
        document.getElementById('enable-notifications').addEventListener('click', () => this.enableNotifications());
        document.getElementById('skip-notifications').addEventListener('click', () => this.hideNotificationModal());
        
        // Input validation
        document.getElementById('workout-duration').addEventListener('input', (e) => this.validateDuration(e));
        document.getElementById('water-amount').addEventListener('input', (e) => this.validateWater(e));
        document.getElementById('creatine-amount').addEventListener('input', (e) => this.validateCreatine(e));
    }

    loadSettings() {
        const savedDuration = localStorage.getItem('workoutDuration');
        const savedWater = localStorage.getItem('waterAmount');
        const savedCreatine = localStorage.getItem('creatineAmount');
        
        if (savedDuration) document.getElementById('workout-duration').value = savedDuration;
        if (savedWater) document.getElementById('water-amount').value = savedWater;
        if (savedCreatine) document.getElementById('creatine-amount').value = savedCreatine;
    }

    saveSettings() {
        localStorage.setItem('workoutDuration', this.workoutDuration);
        localStorage.setItem('waterAmount', this.waterAmount);
        localStorage.setItem('creatineAmount', this.creatineAmount);
    }

    validateDuration(e) {
        const value = parseInt(e.target.value);
        if (value < 15) e.target.value = 15;
        if (value > 180) e.target.value = 180;
    }

    validateWater(e) {
        const value = parseInt(e.target.value);
        if (value < 250) e.target.value = 250;
        if (value > 1000) e.target.value = 1000;
    }

    validateCreatine(e) {
        const value = parseFloat(e.target.value);
        if (value < 0) e.target.value = 0;
        if (value > 10) e.target.value = 10;
    }

    startWorkout() {
        // Get values from form
        this.workoutDuration = parseInt(document.getElementById('workout-duration').value);
        this.waterAmount = parseInt(document.getElementById('water-amount').value);
        this.creatineAmount = parseFloat(document.getElementById('creatine-amount').value);
        
        // Validate inputs
        if (!this.workoutDuration || this.workoutDuration < 15) {
            alert('Please enter a valid workout duration (minimum 15 minutes)');
            return;
        }
        
        // Save settings
        this.saveSettings();
        
        // Calculate drink intervals
        this.calculateDrinkIntervals();
        
        // Initialize workout
        this.timeRemaining = this.workoutDuration * 60; // Convert to seconds
        this.workoutStartTime = Date.now();
        this.totalPausedTime = 0;
        this.waterConsumed = 0;
        this.currentDrinkIndex = 0;
        
        // Show timer section
        this.showSection('timer-section');
        this.hideSection('setup-section');
        
        // Start timers
        this.startTimer();
        this.startDrinkReminders();
        
        // Update display
        this.updateDisplay();
        
        // Show first drink reminder
        this.showDrinkReminder();
    }

    calculateDrinkIntervals() {
        this.drinkIntervals = [];
        
        // Calculate optimal drink frequency based on workout duration
        let intervalMinutes;
        if (this.workoutDuration <= 30) {
            intervalMinutes = 10; // Every 10 minutes for short workouts
        } else if (this.workoutDuration <= 60) {
            intervalMinutes = 12; // Every 12 minutes for medium workouts
        } else {
            intervalMinutes = 15; // Every 15 minutes for long workouts
        }
        
        // Calculate drink times
        for (let i = intervalMinutes; i < this.workoutDuration; i += intervalMinutes) {
            this.drinkIntervals.push(i * 60); // Convert to seconds
        }
        
        // Always add final reminder near the end
        if (this.workoutDuration > intervalMinutes) {
            this.drinkIntervals.push((this.workoutDuration - 2) * 60);
        }
        
        console.log('Drink intervals:', this.drinkIntervals.map(s => Math.floor(s/60) + 'min'));
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.timeRemaining--;
                this.updateDisplay();
                
                if (this.timeRemaining <= 0) {
                    this.endWorkout();
                }
            }
        }, 1000);
    }

    startDrinkReminders() {
        this.drinkInterval = setInterval(() => {
            if (!this.isPaused && this.currentDrinkIndex < this.drinkIntervals.length) {
                const nextDrinkTime = this.drinkIntervals[this.currentDrinkIndex];
                const elapsedTime = this.workoutDuration * 60 - this.timeRemaining;
                
                if (elapsedTime >= nextDrinkTime) {
                    this.showDrinkReminder();
                    this.currentDrinkIndex++;
                }
            }
        }, 1000);
    }

    showDrinkReminder() {
        // Play sound
        this.playDrinkSound();
        
        // Show notification if enabled
        if (Notification.permission === 'granted') {
            new Notification('💧 Time to Drink!', {
                body: `Stay hydrated! You should have ${Math.floor(this.waterAmount / (this.drinkIntervals.length + 1))}ml now.`,
                icon: '/icon-192.png',
                tag: 'drink-reminder'
            });
        }
        
        // Vibrate if supported
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
        
        // Update next drink countdown
        this.updateNextDrinkCountdown();
    }

    updateNextDrinkCountdown() {
        const nextDrinkElement = document.getElementById('next-drink-countdown');
        
        if (this.currentDrinkIndex < this.drinkIntervals.length) {
            const nextDrinkTime = this.drinkIntervals[this.currentDrinkIndex];
            const elapsedTime = this.workoutDuration * 60 - this.timeRemaining;
            const timeUntilNext = nextDrinkTime - elapsedTime;
            
            if (timeUntilNext > 0) {
                const minutes = Math.floor(timeUntilNext / 60);
                const seconds = timeUntilNext % 60;
                nextDrinkElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            } else {
                nextDrinkElement.textContent = 'Now!';
            }
        } else {
            nextDrinkElement.textContent = 'Final stretch!';
        }
    }

    recordDrink() {
        const drinkAmount = Math.floor(this.waterAmount / (this.drinkIntervals.length + 1));
        this.waterConsumed += drinkAmount;
        
        // Update water level display
        this.updateWaterLevel();
        
        // Show feedback
        this.showDrinkFeedback();
        
        // Update next drink countdown
        this.updateNextDrinkCountdown();
    }

    updateWaterLevel() {
        const waterLevel = document.getElementById('water-level');
        const waterRemaining = document.getElementById('water-remaining');
        const remaining = this.waterAmount - this.waterConsumed;
        
        if (remaining <= 0) {
            waterLevel.style.height = '0%';
            waterRemaining.textContent = '0ml';
        } else {
            const percentage = (remaining / this.waterAmount) * 100;
            waterLevel.style.height = percentage + '%';
            waterRemaining.textContent = remaining + 'ml';
        }
    }

    showDrinkFeedback() {
        const drinkButton = document.getElementById('drink-now');
        const originalText = drinkButton.textContent;
        
        drinkButton.textContent = 'Great! 💧';
        drinkButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        setTimeout(() => {
            drinkButton.textContent = originalText;
            drinkButton.style.background = '';
        }, 1500);
    }

    togglePause() {
        if (this.isPaused) {
            this.resumeWorkout();
        } else {
            this.pauseWorkout();
        }
    }

    pauseWorkout() {
        this.isPaused = true;
        this.pauseStartTime = Date.now();
        
        const pauseButton = document.getElementById('pause-workout');
        pauseButton.textContent = 'Resume';
        pauseButton.classList.remove('btn-warning');
        pauseButton.classList.add('btn-success');
        
        // Pause timers
        clearInterval(this.timerInterval);
        clearInterval(this.drinkInterval);
    }

    resumeWorkout() {
        this.isPaused = false;
        
        if (this.pauseStartTime) {
            this.totalPausedTime += Date.now() - this.pauseStartTime;
            this.pauseStartTime = null;
        }
        
        const pauseButton = document.getElementById('pause-workout');
        pauseButton.textContent = 'Pause';
        pauseButton.classList.remove('btn-success');
        pauseButton.classList.add('btn-warning');
        
        // Resume timers
        this.startTimer();
        this.startDrinkReminders();
    }

    endWorkout() {
        // Clear timers
        clearInterval(this.timerInterval);
        clearInterval(this.drinkInterval);
        
        // Calculate final stats
        const actualDuration = Math.floor((Date.now() - this.workoutStartTime - this.totalPausedTime) / 1000 / 60);
        const finalWater = this.waterConsumed;
        const finalCreatine = (finalWater / this.waterAmount) * this.creatineAmount;
        
        // Update results
        document.getElementById('final-duration').textContent = `${actualDuration} minutes`;
        document.getElementById('final-water').textContent = `${finalWater}ml`;
        document.getElementById('final-creatine').textContent = `${finalCreatine.toFixed(1)}g`;
        
        // Show results
        this.showSection('results-section');
        this.hideSection('timer-section');
        
        // Play completion sound
        this.playCompletionSound();
        
        // Show completion notification
        if (Notification.permission === 'granted') {
            new Notification('🎉 Workout Complete!', {
                body: `Great job! You consumed ${finalWater}ml of water and ${finalCreatine.toFixed(1)}g of creatine.`,
                icon: '/icon-192.png',
                tag: 'workout-complete'
            });
        }
    }

    resetToSetup() {
        this.hideSection('results-section');
        this.showSection('setup-section');
        
        // Reset all variables
        this.workoutDuration = 0;
        this.waterAmount = 500;
        this.creatineAmount = 5;
        this.timeRemaining = 0;
        this.workoutStartTime = null;
        this.isPaused = false;
        this.pauseStartTime = null;
        this.totalPausedTime = 0;
        this.drinkIntervals = [];
        this.currentDrinkIndex = 0;
        this.waterConsumed = 0;
        this.timerInterval = null;
        this.drinkInterval = null;
    }

    updateDisplay() {
        // Update time remaining
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        document.getElementById('time-remaining').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update workout progress
        const progress = ((this.workoutDuration * 60 - this.timeRemaining) / (this.workoutDuration * 60)) * 100;
        document.getElementById('workout-progress-fill').style.width = progress + '%';
        document.querySelector('.progress-text').textContent = Math.round(progress) + '% Complete';
        
        // Update water level
        this.updateWaterLevel();
        
        // Update next drink countdown
        this.updateNextDrinkCountdown();
    }

    showSection(sectionId) {
        document.getElementById(sectionId).classList.remove('hidden');
    }

    hideSection(sectionId) {
        document.getElementById(sectionId).classList.add('hidden');
    }

    checkNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            setTimeout(() => {
                this.showNotificationModal();
            }, 2000);
        }
    }

    showNotificationModal() {
        document.getElementById('notification-modal').classList.remove('hidden');
    }

    hideNotificationModal() {
        document.getElementById('notification-modal').classList.add('hidden');
    }

    async enableNotifications() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.hideNotificationModal();
                // Show success message
                alert('Notifications enabled! You\'ll now get drink reminders even when the app is in the background.');
            } else {
                this.hideNotificationModal();
                alert('Notifications not enabled. You can still use the app, but reminders will only work when the app is open.');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            this.hideNotificationModal();
        }
    }

    setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createDrinkSound();
            this.createCompletionSound();
        } catch (error) {
            console.log('Audio not supported, using fallback');
        }
    }

    createDrinkSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        this.drinkSound = { oscillator, gainNode };
    }

    createCompletionSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime); // C
        oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.2); // E
        oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.4); // G
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
        
        this.completionSound = { oscillator, gainNode };
    }

    playDrinkSound() {
        if (this.drinkSound && this.audioContext) {
            try {
                this.drinkSound.oscillator.start();
                this.drinkSound.oscillator.stop(this.audioContext.currentTime + 0.3);
            } catch (error) {
                console.log('Audio playback error:', error);
            }
        }
    }

    playCompletionSound() {
        if (this.completionSound && this.audioContext) {
            try {
                this.completionSound.oscillator.start();
                this.completionSound.oscillator.stop(this.audioContext.currentTime + 0.6);
            } catch (error) {
                console.log('Audio playback error:', error);
            }
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HydrationTimer();
});

// Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
