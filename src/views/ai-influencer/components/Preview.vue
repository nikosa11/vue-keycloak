<template>
  <div class="preview-container">
    <div class="grid">
      <!-- AI Influencer Preview -->
      <div class="col-12 md:col-6">
        <div class="preview-card">
          <div class="preview-header">
            <h3 class="text-xl font-medium mb-2">Your AI Influencer</h3>
            <div class="flex align-items-center gap-2">
              <Tag :value="type" severity="info" />
              <i class="pi pi-spin pi-spinner" style="font-size: 1rem"></i>
              <span class="text-sm">Generating...</span>
            </div>
          </div>
          
          <div class="preview-content mt-4">
            <div class="placeholder-image flex align-items-center justify-content-center">
              <i class="pi pi-image text-6xl text-500"></i>
            </div>
            
            <div class="stats-grid mt-4">
              <div class="stat-item">
                <span class="stat-label">Engagement Rate</span>
                <span class="stat-value">~4.8%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Followers</span>
                <span class="stat-value">~10K</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Posts/Week</span>
                <span class="stat-value">3-4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Features Summary -->
      <div class="col-12 md:col-6">
        <div class="preview-card">
          <h3 class="text-xl font-medium mb-4">Selected Features</h3>
          
          <div class="features-list">
            <template v-for="(value, key) in features" :key="key">
              <div class="feature-item">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span class="feature-label">{{ formatFeatureLabel(key) }}</span>
                <span class="feature-value">{{ formatFeatureValue(value) }}</span>
              </div>
            </template>
          </div>
          
          <div class="mt-4 p-3 border-round surface-ground">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-info-circle text-primary"></i>
              <p class="text-sm m-0">
                Your AI influencer is being generated. This process typically takes 2-3 minutes.
                We'll notify you once it's ready!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  methods: {
    formatFeatureLabel(key) {
      return key.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
    formatFeatureValue(value) {
      // Handle array values (style, personality)
      if (Array.isArray(value)) {
        return value.map(item => item.name).join(', ')
      }
      
      // Handle object values (gender, ethnicity, species)
      if (value && typeof value === 'object' && value.name) {
        return value.name
      }
      
      // Handle number values (height)
      if (typeof value === 'number') {
        return `${value}cm`
      }
      
      // Handle boolean values
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No'
      }
      
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-container {
  .preview-card {
    background: var(--surface-card);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    height: 100%;
    
    .preview-header {
      margin-bottom: 1.5rem;
    }
    
    .placeholder-image {
      background: var(--surface-ground);
      border-radius: var(--border-radius);
      height: 200px;
      margin-bottom: 1.5rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      
      .stat-item {
        text-align: center;
        padding: 1rem;
        background: var(--surface-ground);
        border-radius: var(--border-radius);
        
        .stat-label {
          display: block;
          color: var(--text-color-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .stat-value {
          color: var(--text-color);
          font-size: 1.25rem;
          font-weight: 600;
        }
      }
    }
    
    .features-list {
      .feature-item {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: var(--surface-ground);
        border-radius: var(--border-radius);
        
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
  }
}
</style>
