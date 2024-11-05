<template>
    <div class="wizzard-modal">
      <!-- The Modal -->
      <div class="modal" @click.self="closeModal" v-if="showModal">
        <!-- Modal content -->
        <div class="modal-content">
          <form @submit.prevent="submitForm" id="regForm">
            <span class="prev-icon" v-if="currentTab > 0" @click="nextPrev(-1)">&#8592;</span>
            <h1>Wizzard:</h1>
            <!-- One "tab" for each step in the form: -->
            <div v-for="(question, index) in questions" :key="index" class="tab" v-show="currentTab === index">
              <h3>{{ question.title }}</h3>
              <p><input :placeholder="question.placeholder" v-model="question.answer" /></p>
              <!-- Error message -->
              <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
            </div>
            <!-- Review Tab -->
            <div class="tab" v-show="currentTab === questions.length">
              <h3>Review your answers:</h3>
              <ul>
                <li v-for="(question, index) in questions" :key="index">
                  <strong>{{ question.title }}:</strong> {{ question.answer }}
                </li>
              </ul>
            </div>
            <div style="overflow:auto;">
              <div style="text-align:center;">
                <button class="button wizzard" type="button" @click="nextPrev(1)">{{ currentTab === questions.length ? 'Submit' : 'Next' }}</button>
              </div>
            </div>
            <!-- Circles which indicates the steps of the form: -->
            <div class="step-container">
              <span v-for="(question, index) in questions" :key="index" class="step" :class="{ active: currentTab === index, finish: question.answer !== '' }"></span>
              <!-- Additional step for the review tab -->
              <span class="step" :class="{ active: currentTab === questions.length }"></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showModal: true,
        currentTab: 0,
        errorMessage: '', // Add errorMessage data property
        questions: [
          { title: 'Question 1', placeholder: 'Answer 1', answer: '' },
          { title: 'Question 2', placeholder: 'Answer 2', answer: '' },
          { title: 'Question 3', placeholder: 'Answer 3', answer: '' }
        ]
      };
    },
    methods: {
      openModal() {
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
        this.$emit('close', this.questions); // Emit event with updated questions
      },
      nextPrev(n) {
        if (n === 1 && !this.validateForm()) return;
        this.currentTab += n;
        if (this.currentTab > this.questions.length) {
          this.submitForm();
          this.currentTab = 0;
          this.showModal = false;
          this.$emit('close', this.questions); // Emit event with updated questions
        }
      },
      validateForm() {
        this.errorMessage = ''; // Reset error message
        if (this.currentTab < this.questions.length && this.questions[this.currentTab].answer === '') {
          this.errorMessage = 'Please provide an answer before proceeding.'; // Set error message
          return false;
        }
        return true;
      },
      submitForm() {
        alert('TO DO API CALL TO UPDATE USER DATA');
        this.closeModal();
      }
    }
  };
  </script>
  
  <style scoped>
  .wizzard-modal {
    padding-top: 20px;
  }
  
  /* Modal container */
  .modal {
    display: flex;
    position: fixed;
    z-index: 1001;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    align-items: center;
    justify-content: center;
  }
  
  /* Modal content */
  .modal-content {
    background-color: #ffffff;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    border-radius: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  /* Style the form */
  #regForm {
    background-color: #ffffff;
    padding: 40px;
    width: 100%;
    min-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    
    /* Περιορίζουμε το input styling μόνο στα inputs μέσα στο form */
    :deep(input) {
      padding: 10px;
      width: 100%;
      font-size: 17px;
      font-family: Arial, sans-serif;
      border: 1px solid #aaaaaa;
      border-radius: 25px;
      margin-bottom: 20px;
      text-align: center;
    }
  }
  
  /* Style the steps (circles) */
  .step {
    height: 15px;
    width: 15px;
    margin: 0 2px;
    background-color: #bbbbbb;
    border: none;
    border-radius: 50%;
    display: inline-block;
    opacity: 0.5;
  }
  
  .step.active {
    opacity: 1;
    background-color: #4CAF50;
  }
  
  .step-container {
    text-align: center;
    margin-top: 40px;
  }
  
  /* Buttons */
  :deep(.wizzard) {
    color: rgb(252, 230, 230);
    border: none;
    padding: 10px 20px;
    font-size: 17px;
    cursor: pointer;
    border-radius: 25px;
    margin-top: 10px;
    margin: 10px;
  }
  
  button:hover {
    opacity: 0.8;
  }
  
  /* Style the next button */
  #regForm button {
    background-color: #00aaff;
  }
  
  #regForm button:hover {
    background-color: #0088cc;
  }
  
  /* Previous button icon */
  .prev-icon {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 24px;
    cursor: pointer;
  }
  
  .prev-icon:hover {
    color: #0088cc;
  }
  
  /* Center the questions */
  .tab h3 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin: 10px 0;
  }
  
  /* Error message */
  .error {
    color: red;
    margin-top: -15px;
    margin-bottom: 15px;
    font-size: 14px;
  }
  </style>
  