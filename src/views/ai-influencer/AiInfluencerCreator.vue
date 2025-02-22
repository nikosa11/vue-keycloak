<template>
    <div class="grid">
        <div class="col-12">
            <div class="card creator-card">
                <div class="creator-header text-center mb-5">
                    <h2 class="text-4xl font-bold mb-2 text-900">AI Influencer Creator</h2>
                    <p class="text-xl text-600 mt-2">Design your perfect AI influencer in a few simple steps</p>
                </div>
                
                <div class="flex align-items-center justify-content-center">
                    <div class="surface-card creator-container p-5 shadow-2 border-round w-full">
                        <div class="steps-container mb-6">
                            <ul class="list-none p-0 m-0 flex align-items-center justify-content-center">
                                <li v-for="step in 4" :key="step" class="flex align-items-center">
                                    <div :class="['step-number', { active: currentStep + 1 === step, completed: currentStep + 1 > step }]">
                                        <i v-if="currentStep + 1 > step" class="pi pi-check"></i>
                                        <span v-else>{{ step }}</span>
                                    </div>
                                    <div v-if="step < 4" :class="['step-line', { active: currentStep + 1 > step }]"></div>
                                </li>
                            </ul>
                            <div class="flex align-items-center justify-content-center mt-3">
                                <span class="text-lg font-medium text-primary">{{ stepLabels[currentStep] }}</span>
                            </div>
                        </div>

                        <div class="step-content p-3">
                            <TypeSelection 
                                v-if="currentStep === 0"
                                v-model:selectedType="selectedType"
                                @select-type="handleTypeSelection"
                            />
                            
                            <Customization 
                                v-if="currentStep === 1"
                                v-model:features="features"
                                :type="selectedType"
                            />
                            
                            <PlanSelection 
                                v-if="currentStep === 2"
                                v-model="selectedPlan"
                            />
                            
                            <Preview 
                                v-if="currentStep === 3"
                                :type="selectedType"
                                :features="features"
                            />
                        </div>

                        <div class="flex align-items-center justify-content-center gap-4 mt-5">
                            <Button 
                                v-if="currentStep > 0"
                                class="p-button-rounded custom-nav-button p-button-outlined" 
                                @click="prevStep"
                            >
                                <i class="pi pi-angle-left mr-2"></i>
                                <span>Previous</span>
                            </Button>
                            <Button 
                                v-if="currentStep < 3"
                                class="p-button-rounded custom-nav-button p-button-primary" 
                                @click="nextStep"
                            >
                                <span>Next</span>
                                <i class="pi pi-angle-right ml-2"></i>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TypeSelection from './components/TypeSelection.vue';
import Customization from './components/Customization.vue';
import PlanSelection from './components/PlanSelection.vue';
import Preview from './components/Preview.vue';

export default {
    components: {
        TypeSelection,
        Customization,
        PlanSelection,
        Preview
    },
    data() {
        return {
            currentStep: 0,
            selectedType: null,
            features: {},
            selectedPlan: null,
            stepLabels: [
                'Select Type',
                'Customize',
                'Choose Plan',
                'Preview'
            ]
        };
    },
    methods: {
        handleTypeSelection(type) {
            this.selectedType = type;
            this.nextStep();
        },
        nextStep() {
            if (this.currentStep < 3) {
                this.currentStep++;
            }
        },
        prevStep() {
            if (this.currentStep > 0) {
                this.currentStep--;
            }
        },
        handleAction() {
            if (this.currentStep === 2) {
                this.nextStep();
                this.generateInfluencer();
            } else if (this.currentStep === 3) {
                this.generateInfluencer();
            } else {
                this.nextStep();
            }
        },
        generateInfluencer() {
            // Implementation for generating the influencer
            console.log('Generating influencer with:', {
                type: this.selectedType,
                features: this.features,
                plan: this.selectedPlan
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.creator-card {
    background: var(--surface-card);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.creator-header {
    h2 {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-400) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
}

.creator-container {
    border-radius: 1rem;
    background: var(--surface-ground);
    border: 1px solid var(--surface-border);
    position: relative;
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 1rem;
        padding: 2px;
        background: linear-gradient(135deg, var(--primary-200), var(--primary-400));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
    }
}

.steps-container {
    .step-number {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--surface-card);
        color: var(--text-color-secondary);
        border: 2px solid var(--surface-border);
        font-weight: 600;
        position: relative;
        transition: all 0.3s ease;
        
        &.active {
            background: var(--primary-color);
            color: var(--primary-color-text);
            border-color: var(--primary-color);
            transform: scale(1.1);
            box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.2);
        }

        &.completed {
            background: var(--primary-color);
            color: var(--primary-color-text);
            border-color: var(--primary-color);

            .pi {
                font-size: 1rem;
            }
        }
    }
    
    .step-line {
        width: 6rem;
        height: 2px;
        background: var(--surface-border);
        margin: 0 0.5rem;
        transition: all 0.3s ease;
        
        &.active {
            background: var(--primary-color);
        }
    }
}

.step-content {
    min-height: 300px;
    background: var(--surface-card);
    border-radius: 1rem;
    margin-bottom: 2rem;
    transition: all 0.3s ease;
}

.custom-nav-button {
    min-width: 140px;
    height: 48px !important;
    border-radius: 24px !important;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0 1.5rem;
    
    &.p-button-outlined {
        border-width: 2px;
        
        &:hover {
            background: var(--surface-ground);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
    }
    
    &.p-button-primary {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-700) 100%);
        border: none;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.4);
            background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
        }
    }

    .pi {
        font-size: 1.1rem;
        font-weight: bold;
    }

    span {
        font-weight: 600;
        letter-spacing: 0.5px;
    }
}

:deep(.p-button.p-button-rounded) {
    &:focus {
        box-shadow: 0 0 0 2px var(--surface-ground), 0 0 0 4px var(--primary-color);
    }
}
</style>