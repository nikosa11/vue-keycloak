<template>
  <div class="plan-selection">
    <div class="grid">
      <div class="col-12 md:col-6">
        <div 
          :class="['plan-card', { 'selected': selectedPlan === 'custom' }]"
          @click="selectPlan('custom')"
        >
          <div class="plan-content p-5">
            <div class="flex align-items-center justify-content-between">
              <span class="plan-icon">
                <i class="pi pi-star text-4xl"></i>
              </span>
              <div class="selection-indicator" v-if="selectedPlan === 'custom'">
                <i class="pi pi-check-circle text-xl"></i>
              </div>
            </div>
            
            <h3 class="text-xl font-medium mt-4 mb-2">Custom Creation</h3>
            <div class="text-primary text-4xl font-bold mb-3">
              $99
              <span class="text-base font-normal text-700">/month</span>
            </div>
            
            <ul class="list-none p-0 m-0">
              <li class="mb-3">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>Full customization control</span>
              </li>
              <li class="mb-3">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>Unique personality traits</span>
              </li>
              <li class="mb-3">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>Advanced animation options</span>
              </li>
              <li class="mb-3">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>Priority support</span>
              </li>
              <li class="mb-3">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>Commercial usage rights</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="col-12 md:col-6">
        <div 
          :class="['plan-card', { 'selected': selectedPlan === 'template' }]"
          @click="selectPlan('template')"
        >
          <div class="plan-content p-5">
            <div class="flex align-items-center justify-content-between">
              <span class="plan-icon">
                <i class="pi pi-file text-4xl"></i>
              </span>
              <div class="selection-indicator" v-if="selectedPlan === 'template'">
                <i class="pi pi-check-circle text-xl"></i>
              </div>
            </div>
            
            <h3 class="text-xl font-medium mt-4 mb-2">Pre-made Template</h3>
            <div class="text-primary text-4xl font-bold mb-3">
              $49
              <span class="text-base font-normal text-700">/month</span>
            </div>
            
            <ul class="list-none p-0 m-0">
              <li class="mb-3">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>Quick setup</span>
              </li>
              <li class="mb-3">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>Proven designs</span>
              </li>
              <li class="mb-3">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>Basic customization</span>
              </li>
              <li class="mb-3">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>Standard support</span>
              </li>
              <li class="mb-3">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>Personal usage rights</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  computed: {
    selectedPlan: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    selectPlan(plan) {
      this.selectedPlan = plan;
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-card {
  background: var(--surface-card);
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  &.selected {
    border-color: var(--primary-color);
    background: linear-gradient(to bottom right, var(--primary-50), var(--surface-card));
    box-shadow: 0 8px 25px rgba(var(--primary-color-rgb), 0.15);
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 1rem;
      padding: 3px;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-400));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
    
    .plan-icon {
      background: var(--primary-color);
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(var(--primary-color-rgb), 0.3);
      
      i {
        color: var(--primary-color-text);
      }
    }
    
    .selection-indicator {
      opacity: 1;
      transform: scale(1);
      
      i {
        color: var(--primary-color);
        animation: pulse 2s infinite;
      }
    }

    h3 {
      color: var(--primary-800);
    }

    .text-primary {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-400));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
}

.plan-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--surface-ground);
  transition: all 0.3s ease;
  
  i {
    color: var(--text-color);
    transition: all 0.3s ease;
  }
}

.selection-indicator {
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s ease;
}

.plan-content {
  ul {
    li {
      display: flex;
      align-items: center;
      color: var(--text-color-secondary);
      
      i {
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
