<template>
    <Dialog 
        v-model:visible="visible" 
        modal 
        :closable="false" 
        :draggable="false"
        header=""
        class="inactivity-modal"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{ width: '25rem', maxHeight: '90vh', overflow: 'hidden' }"
        :modal-style="{ backdropFilter: 'blur(4px)' }"
    >
        <div class="flex flex-column align-items-center p-3">
            <div class="warning-icon mb-3">
                <i class="pi pi-exclamation-triangle text-yellow-500 text-4xl"></i>
                <div class="pulse-ring"></div>
            </div>
            
            <h2 class="text-xl font-bold mb-2 text-900">Ανιχνεύθηκε αδράνεια</h2>
            
            <p class="text-center text-700 line-height-3 mb-3 text-sm">
                Δεν έχει ανιχνευθεί δραστηριότητα τα τελευταία 2 λεπτά.
            </p>

            <div class="countdown-container mb-3">
                <div class="countdown-circle">
                    <span class="countdown-number text-3xl font-bold text-primary">{{ countdown }}</span>
                    <span class="countdown-text text-xs text-700">δευτερόλεπτα</span>
                </div>
            </div>

            <div class="mouse-hint flex align-items-center gap-2 p-2 border-round bg-primary-50">
                <i class="pi pi-mouse text-primary text-lg"></i>
                <p class="text-primary text-sm m-0">Μετακινήστε το ποντίκι για να συνεχίσετε</p>
            </div>
        </div>
    </Dialog>
</template>

<script>
export default {
    name: 'InactivityModal',
    data() {
        return {
            visible: false,
            countdown: 60,
            countdownTimer: null
        }
    },
    methods: {
        show() {
            this.visible = true;
            this.startCountdown();
        },
        hide() {
            this.visible = false;
            this.resetCountdown();
            this.$emit('continue-session');
        },
        startCountdown() {
            this.countdown = 60;
            this.countdownTimer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                    this.sessionTimeout();
                }
            }, 1000);
        },
        resetCountdown() {
            clearInterval(this.countdownTimer);
            this.countdown = 60;
        },
        sessionTimeout() {
            this.visible = false; // Close modal first
            clearInterval(this.countdownTimer);
            this.$emit('session-timeout');
            // Redirect to landing page
            this.$router.push('/landing');
        }
    },
    beforeUnmount() {
        clearInterval(this.countdownTimer);
    }
}
</script>

<style lang="scss" scoped>
.inactivity-modal {
    :deep(.p-dialog-header) {
        background: var(--primary-color);
        color: white;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        padding: 1rem;
        justify-content: center;

        .p-dialog-title {
            font-size: 1.25rem;
            font-weight: 600;
        }
    }

    :deep(.p-dialog-content) {
        padding: 0;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
    }

    :deep(.p-dialog) {
        border-radius: 1rem;
    }

    .warning-icon {
        position: relative;
        display: inline-block;

        .pulse-ring {
            content: '';
            width: 60px;
            height: 60px;
            background: rgba(255, 193, 7, 0.2);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse 2s infinite;
        }
    }

    .countdown-container {
        .countdown-circle {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: var(--primary-50);
            position: relative;
            
            &::before {
                content: '';
                position: absolute;
                top: -3px;
                left: -3px;
                right: -3px;
                bottom: -3px;
                border-radius: 50%;
                border: 2px solid var(--primary-200);
                animation: spin 60s linear infinite;
            }
        }

        .countdown-number {
            line-height: 1;
            margin-bottom: 0.25rem;
        }
    }

    .mouse-hint {
        transition: all 0.3s ease;
        animation: fadeInUp 0.5s ease-out;
        border-radius: 2rem;
    }
}

@keyframes pulse {
    0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0.8;
    }
    70% {
        transform: translate(-50%, -50%) scale(1.3);
        opacity: 0;
    }
    100% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0;
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>