<template>
  <div class="ai-assistant" :class="{ 'expanded': isExpanded }">
    <div class="assistant-toggle" @click="toggleAssistant">
      <i class="pi" :class="isExpanded ? 'pi-times' : 'pi-comments'"></i>
    </div>
    <div class="assistant-content" v-if="isExpanded">
      <div class="assistant-header">
        <i class="pi pi-robot"></i>
        <span>AI Assistant</span>
      </div>
      <div class="assistant-messages" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="message"
          :class="{ 'with-typing': message.typing }"
        >
          {{ message.text }}
          <span v-if="message.typing" class="typing-indicator">...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const isExpanded = ref(false)
    const messages = ref([])
    const messagesContainer = ref(null)

    const toggleAssistant = () => {
      isExpanded.value = !isExpanded.value
    }

    const addMessage = (text, withTyping = true) => {
      if (withTyping) {
        messages.value.push({ text: '', typing: true })
        let currentText = ''
        const words = text.split(' ')
        
        const typeWord = (index) => {
          if (index < words.length) {
            currentText += (index > 0 ? ' ' : '') + words[index]
            messages.value[messages.value.length - 1] = { 
              text: currentText, 
              typing: index < words.length - 1 
            }
            
            setTimeout(() => typeWord(index + 1), 100)
          }
        }
        
        typeWord(0)
      } else {
        messages.value.push({ text, typing: false })
      }

      setTimeout(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      }, 100)
    }

    const suggest = (text) => {
      addMessage(text)
    }

    const guide = (step) => {
      const guides = {
        'Select Type': 'Choose between a human or animal AI influencer. Each type has unique features!',
        'Customize': 'Personalize your influencer with various attributes to make them stand out.',
        'Choose Plan': 'Select a plan that best fits your needs. Custom plans offer more flexibility.',
        'Preview': 'Review your creation before finalizing. Make sure everything looks perfect!'
      }

      addMessage(guides[step] || 'Let me help you with this step!')
    }

    onMounted(() => {
      addMessage('Hello! I\'m your AI assistant. I\'ll help you create the perfect AI influencer! 👋', false)
    })

    return {
      isExpanded,
      messages,
      messagesContainer,
      toggleAssistant,
      suggest,
      guide
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-assistant {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;

  .assistant-toggle {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    i {
      font-size: 1.5rem;
    }
  }

  .assistant-content {
    position: absolute;
    bottom: 4.5rem;
    right: 0;
    width: 300px;
    height: 400px;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .assistant-header {
      padding: 1rem;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        font-size: 1.2rem;
      }
    }

    .assistant-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;

      .message {
        background: var(--surface-100);
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
        animation: fadeIn 0.3s ease;

        &.with-typing {
          .typing-indicator {
            display: inline-block;
            animation: typing 1s infinite;
          }
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
</style>
