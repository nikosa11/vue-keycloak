<template>
  <div class="customization-container">
    <div class="grid">
      <div class="col-12 md:col-8">
        <!-- Main Form -->
        <div class="form-card">
          <h3 class="title-text mb-4">{{ type === 'human' ? 'Human' : 'Animal' }} Features</h3>
          
          <div class="grid">
            <!-- First Column -->
            <template v-if="type === 'human'">
              <div class="col-12 md:col-6 field">
                <label class="block mb-2">Gender</label>
                <Dropdown
                  v-model="localFeatures.gender"
                  :options="genderOptions"
                  optionLabel="name"
                  placeholder="Select Gender"
                  class="w-full custom-dropdown"
                  @change="updateFeatures"
                />
              </div>
              
              <div class="col-12 md:col-6 field">
                <label class="block mb-2">Ethnicity</label>
                <Dropdown
                  v-model="localFeatures.ethnicity"
                  :options="ethnicityOptions"
                  optionLabel="name"
                  placeholder="Select Ethnicity"
                  class="w-full custom-dropdown"
                  @change="updateFeatures"
                />
              </div>
              
              <div class="col-12 md:col-6 field">
                <label class="block mb-2">Height (cm)</label>
                <div class="p-inputgroup">
                  <InputNumber 
                    v-model="localFeatures.height" 
                    placeholder="Enter height"
                    :min="140"
                    :max="200"
                    class="w-full custom-input"
                    @change="updateFeatures"
                  />
                  <span class="p-inputgroup-addon">cm</span>
                </div>
              </div>
            </template>
            
            <template v-else>
              <div class="col-12 md:col-6 field">
                <label class="block mb-2">Species</label>
                <Dropdown
                  v-model="localFeatures.species"
                  :options="speciesOptions"
                  optionLabel="name"
                  placeholder="Select Species"
                  class="w-full custom-dropdown"
                  @change="updateFeatures"
                />
              </div>
            </template>
            
            <!-- Common Fields -->
            <div class="col-12 field">
              <label class="block mb-2">Style Preferences</label>
              <MultiSelect
                v-model="localFeatures.style"
                :options="styleOptions"
                optionLabel="name"
                placeholder="Select Styles"
                display="chip"
                class="w-full custom-multiselect"
                @change="updateFeatures"
              />
            </div>
            
            <div class="col-12 field">
              <label class="block mb-2">Personality Traits</label>
              <MultiSelect
                v-model="localFeatures.personality"
                :options="personalityOptions"
                optionLabel="name"
                placeholder="Select Traits"
                display="chip"
                class="w-full custom-multiselect"
                @change="updateFeatures"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Preview Column -->
      <div class="col-12 md:col-4">
        <div class="preview-card">
          <h3 class="title-text mb-4">Preview</h3>
          <div class="preview-content">
            <div class="avatar-placeholder">
              <i class="pi pi-user"></i>
            </div>
            
            <div class="preview-info">
              <h4>{{ getPreviewTitle }}</h4>
              <p>{{ getPreviewDescription }}</p>
            </div>

            <div class="selected-features">
              <template v-if="type === 'human'">
                <div v-if="localFeatures.gender" class="feature-item">
                  <span class="feature-label">Gender:</span>
                  <span class="feature-value">{{ localFeatures.gender.name }}</span>
                </div>
                <div v-if="localFeatures.ethnicity" class="feature-item">
                  <span class="feature-label">Ethnicity:</span>
                  <span class="feature-value">{{ localFeatures.ethnicity.name }}</span>
                </div>
                <div v-if="localFeatures.height" class="feature-item">
                  <span class="feature-label">Height:</span>
                  <span class="feature-value">{{ localFeatures.height }}cm</span>
                </div>
              </template>
              
              <template v-else>
                <div v-if="localFeatures.species" class="feature-item">
                  <span class="feature-label">Species:</span>
                  <span class="feature-value">{{ localFeatures.species.name }}</span>
                </div>
              </template>

              <div v-if="localFeatures.style && localFeatures.style.length > 0" class="feature-item">
                <span class="feature-label">Style:</span>
                <span class="feature-value">{{ localFeatures.style.map(s => s.name).join(', ') }}</span>
              </div>

              <div v-if="localFeatures.personality && localFeatures.personality.length > 0" class="feature-item">
                <span class="feature-label">Personality:</span>
                <span class="feature-value">{{ localFeatures.personality.map(p => p.name).join(', ') }}</span>
              </div>
            </div>
            
            <div class="stats-container">
              <div class="stat-item">
                <span class="stat-label">Followers</span>
                <span class="stat-value">{{ randomFollowers }}K</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Engagement</span>
                <span class="stat-value">{{ randomEngagement }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import InputNumber from 'primevue/inputnumber'
import { ref, computed, watch } from 'vue'

export default {
  name: 'Customization',
  components: {
    Dropdown,
    MultiSelect,
    InputNumber
  },
  props: {
    type: {
      type: String,
      required: true
    },
    features: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const localFeatures = ref({ ...props.features })
    const randomFollowers = ref(Math.floor(Math.random() * 500 + 100))
    const randomEngagement = ref((Math.random() * 5 + 2).toFixed(1))

    const genderOptions = [
      { name: 'Female', id: 1 },
      { name: 'Male', id: 2 },
      { name: 'Non-binary', id: 3 }
    ]

    const ethnicityOptions = [
      { name: 'African', id: 1 },
      { name: 'Asian', id: 2 },
      { name: 'Caucasian', id: 3 },
      { name: 'Hispanic', id: 4 },
      { name: 'Middle Eastern', id: 5 }
    ]

    const speciesOptions = [
      { name: 'Dog', id: 1 },
      { name: 'Cat', id: 2 },
      { name: 'Bird', id: 3 },
      { name: 'Rabbit', id: 4 }
    ]

    const styleOptions = [
      { name: 'Casual', id: 1 },
      { name: 'Professional', id: 2 },
      { name: 'Artistic', id: 3 },
      { name: 'Athletic', id: 4 },
      { name: 'Luxury', id: 5 }
    ]

    const personalityOptions = [
      { name: 'Outgoing', id: 1 },
      { name: 'Creative', id: 2 },
      { name: 'Energetic', id: 3 },
      { name: 'Calm', id: 4 },
      { name: 'Adventurous', id: 5 }
    ]

    const getPreviewTitle = computed(() => {
      if (props.type === 'human') {
        return `${localFeatures.value.gender?.name || 'AI'} Influencer`
      }
      return `${localFeatures.value.species?.name || 'Pet'} Star`
    })

    const getPreviewDescription = computed(() => {
      const styles = localFeatures.value.style?.map(s => s.name).join(' & ') || 'Content'
      return `${styles} Creator`
    })

    // Watch for changes in localFeatures and emit updates
    watch(localFeatures, (newValue) => {
      emit('update:features', newValue)
    }, { deep: true })

    // Watch for changes in props.features and update localFeatures
    watch(() => props.features, (newValue) => {
      localFeatures.value = { ...newValue }
    }, { deep: true })

    const updateFeatures = () => {
      emit('update:features', localFeatures.value)
    }

    return {
      localFeatures,
      genderOptions,
      ethnicityOptions,
      speciesOptions,
      styleOptions,
      personalityOptions,
      randomFollowers,
      randomEngagement,
      getPreviewTitle,
      getPreviewDescription,
      updateFeatures
    }
  }
}
</script>

<style lang="scss" scoped>
.customization-container {
  :deep() {
    // Global input styles
    .p-dropdown,
    .p-multiselect,
    .p-inputnumber,
    .p-inputtext,
    .p-inputnumber-input,
    .p-dropdown-panel,
    .p-multiselect-panel,
    .p-chips-multiple-container {
      border-radius: 1.25rem !important;
      overflow: hidden;
    }

    // Override any square corners
    .p-inputtext,
    .p-dropdown-label,
    .p-multiselect-label,
    .p-inputnumber-input {
      border-radius: 1.25rem !important;
    }

    // Fix dropdown items
    .p-dropdown-items,
    .p-multiselect-items {
      border-radius: 1rem !important;
      padding: 0.5rem !important;
    }

    .p-dropdown-item,
    .p-multiselect-item {
      border-radius: 1rem !important;
      margin: 0.25rem !important;
      padding: 0.75rem 1rem !important;
    }

    // Fix input groups
    .p-inputgroup {
      .p-inputtext,
      .p-inputnumber,
      .p-inputnumber-input {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }

      .p-inputgroup-addon {
        border-top-right-radius: 1.25rem !important;
        border-bottom-right-radius: 1.25rem !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }

    // Fix chips
    .p-chips {
      .p-chips-multiple-container {
        .p-chips-token {
          border-radius: 1rem !important;
        }
      }
    }
  }

  .form-card, .preview-card {
    background: var(--surface-card);
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    height: 100%;
    border: 1px solid var(--surface-border);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    @media screen and (max-width: 768px) {
      padding: 1.5rem;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    }
  }
  
  .title-text {
    color: var(--primary-900);
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .field {
    margin-bottom: 1.5rem;
    
    label {
      color: var(--text-color);
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }
  }
  
  :deep(.custom-dropdown), :deep(.custom-multiselect), :deep(.custom-input) {
    .p-dropdown, .p-multiselect, .p-inputnumber, .p-inputtext, .p-inputnumber-input {
      border-radius: 1.25rem !important;
      border: 2px solid var(--surface-border);
      transition: all 0.2s ease;
      background: var(--surface-ground);
      padding: 1rem 1.25rem;
      font-size: 1rem;
      
      &:not(.p-disabled):hover {
        border-color: var(--primary-400);
        background: var(--surface-hover);
      }
      
      &.p-focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px var(--primary-100);
        background: var(--surface-card);
      }

      .p-dropdown-trigger, .p-multiselect-trigger {
        background: transparent;
        color: var(--primary-color);
        width: 3rem;
        border-top-right-radius: 1.25rem;
        border-bottom-right-radius: 1.25rem;
        
        &:hover {
          background: var(--primary-50);
        }
      }

      .p-dropdown-label, .p-multiselect-label {
        padding: 0.25rem 0;
        font-weight: 500;
      }

      &.p-dropdown-clearable .p-dropdown-label {
        padding-right: 3rem;
      }
    }
    
    .p-dropdown-panel, .p-multiselect-panel {
      border-radius: 1.25rem;
      border: none;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      margin-top: 0.5rem;
      background: var(--surface-card);
      
      .p-dropdown-header, .p-multiselect-header {
        border-top-left-radius: 1.25rem;
        border-top-right-radius: 1.25rem;
        background: var(--surface-section);
        padding: 1rem 1.25rem;
      }
      
      .p-dropdown-items-wrapper, .p-multiselect-items-wrapper {
        padding: 0.5rem;
        
        .p-dropdown-item, .p-multiselect-item {
          border-radius: 1rem;
          margin: 0.25rem;
          padding: 1rem 1.25rem;
          transition: all 0.2s;
          font-weight: 500;
          
          &:hover {
            background: var(--primary-50);
            color: var(--primary-700);
            transform: translateX(4px);
          }
          
          &.p-highlight {
            background: var(--primary-100);
            color: var(--primary-700);
            font-weight: 600;
          }
        }
      }

      .p-dropdown-filter-container {
        padding: 1rem 1.25rem;
        margin: 0;
        
        .p-dropdown-filter {
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          margin-right: 2.5rem;
        }
        
        .p-dropdown-filter-icon {
          right: 1.25rem;
          color: var(--primary-color);
        }
      }
    }

    .p-inputgroup {
      .p-inputtext, .p-inputnumber-input {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }
      
      .p-inputgroup-addon {
        border-radius: 0 1.25rem 1.25rem 0;
        background: var(--primary-100);
        color: var(--primary-700);
        border: 2px solid var(--surface-border);
        border-left: none;
        padding: 0.75rem 1.25rem;
        font-weight: 500;
      }
    }

    .p-chips {
      .p-chips-multiple-container {
        border-radius: 1.25rem;
        padding: 0.5rem;
        
        .p-chips-token {
          background: var(--primary-100);
          color: var(--primary-700);
          border-radius: 1rem;
          margin: 0.25rem;
          padding: 0.5rem 1rem;
          
          .p-chips-token-icon {
            color: var(--primary-700);
            margin-left: 0.5rem;
            
            &:hover {
              color: var(--primary-900);
            }
          }
        }
        
        .p-chips-input-token {
          padding: 0.5rem;
          
          input {
            font-family: inherit;
            font-size: 1rem;
            padding: 0.5rem;
            
            &:focus {
              outline: none;
            }
          }
        }
      }
    }
  }
  
  .selected-features {
    .feature-item {
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      background: var(--surface-ground);
      border-radius: 0.5rem;

      .feature-label {
        font-weight: 600;
        margin-right: 0.5rem;
        color: var(--text-color-secondary);
      }

      .feature-value {
        color: var(--text-color);
      }
    }
  }

  .preview-card {
    background: var(--surface-section);
    position: sticky;
    top: 2rem;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    min-height: 400px;
    
    @media screen and (max-width: 768px) {
      position: relative;
      top: 0;
      margin-top: 2rem;
      min-height: auto;
      padding: 1.5rem;
    }
    
    .avatar-placeholder {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: var(--primary-700);
      font-size: 2rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      border: 4px solid var(--surface-card);
      flex-shrink: 0;
    }
    
    .preview-info {
      text-align: center;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      
      h4 {
        color: var(--text-color);
        font-weight: 700;
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
      }
    }
    
    .stats-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-top: auto;
      padding: 0.5rem;
      
      .stat-item {
        background: var(--surface-card);
        padding: 0.75rem;
        border-radius: 1rem;
        text-align: center;
        border: 1px solid var(--surface-border);
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        
        .stat-label {
          display: block;
          color: var(--text-color-secondary);
          font-size: 0.75rem;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        
        .stat-value {
          color: var(--primary-color);
          font-weight: 700;
          font-size: 1.25rem;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }
      }
    }
  }
}

.customization-container {
  :deep() {
    // Enhance dropdown and multiselect styling
    .p-dropdown, .p-multiselect {
      &:not(.p-disabled):hover {
        border-color: var(--primary-400);
        box-shadow: 0 0 0 1px var(--primary-300);
      }
      
      &.p-focus {
        border-color: var(--primary-500);
        box-shadow: 0 0 0 2px var(--primary-300);
      }
    }

    // Style for selected items in multiselect
    .p-multiselect-token {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
      color: white;
      border-radius: 1rem;
      padding: 0.25rem 0.75rem;
      margin: 0.25rem;
      
      .p-multiselect-token-icon {
        color: white;
        margin-left: 0.5rem;
        
        &:hover {
          color: var(--primary-100);
        }
      }
    }

    // Style for chips/tags
    .p-chips-token {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
      color: white;
      border-radius: 1rem;
      padding: 0.25rem 0.75rem;
      
      .p-chips-token-icon {
        color: white;
        &:hover {
          color: var(--primary-100);
        }
      }
    }

    // Enhance dropdown items
    .p-dropdown-item, .p-multiselect-item {
      &.p-highlight {
        background: linear-gradient(135deg, var(--primary-500), var(--primary-700)) !important;
        color: white !important;
      }
      
      &:not(.p-highlight):hover {
        background: var(--primary-50) !important;
        color: var(--primary-700) !important;
      }
    }

    // Style for selected values
    .p-dropdown-label, .p-multiselect-label {
      color: var(--primary-700);
      font-weight: 500;
    }

    // Style for placeholder
    .p-dropdown-label.p-placeholder, 
    .p-multiselect-label.p-placeholder {
      color: var(--text-color-secondary);
    }

    // Add gradient background to trigger buttons
    .p-dropdown-trigger, .p-multiselect-trigger {
      background: linear-gradient(135deg, var(--primary-50), var(--surface-ground));
      border-left: 1px solid var(--surface-border);
      
      .p-dropdown-trigger-icon, 
      .p-multiselect-trigger-icon {
        color: var(--primary-600);
      }
    }
  }
}
</style>
