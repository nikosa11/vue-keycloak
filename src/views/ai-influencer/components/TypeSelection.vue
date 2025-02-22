<template>
  <div class="type-selection">
    <div class="grid">
      <div class="col-12 md:col-6">
        <div 
          :class="['selection-card', { 'selected': selectedType === 'human' }]"
          @click="$emit('select-type', 'human')"
        >
          <div class="selection-content text-center p-5">
            <span class="selection-icon">
              <i class="pi pi-user text-4xl"></i>
            </span>
            <h3 class="text-xl font-medium mt-3 mb-2">Human Influencer</h3>
            <p class="text-600 line-height-3 mb-4">Create a realistic human AI influencer with customizable features</p>
            
            <div class="selection-indicator">
              <i class="pi pi-check-circle text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-12 md:col-6">
        <div 
          :class="['selection-card', { 'selected': selectedType === 'animal' }]"
          @click="$emit('select-type', 'animal')"
        >
          <div class="selection-content text-center p-5">
            <span class="selection-icon">
              <i class="pi pi-heart text-4xl"></i>
            </span>
            <h3 class="text-xl font-medium mt-3 mb-2">Animal Influencer</h3>
            <p class="text-600 line-height-3 mb-4">Create a charming animal AI influencer with unique characteristics</p>
            
            <div class="selection-indicator">
              <i class="pi pi-check-circle text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RadioButton from 'primevue/radiobutton'

export default {
  components: {
    RadioButton
  },
  props: {
    selectedType: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.selection-card {
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
    
    .selection-icon {
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
  }
}

.selection-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--surface-ground);
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  i {
    color: var(--text-color);
    transition: all 0.3s ease;
  }
}

.selection-indicator {
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s ease;
  position: absolute;
  top: 1rem;
  right: 1rem;
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
