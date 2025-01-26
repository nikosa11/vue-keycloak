<template>
    <div class="packages" :class="planClass">
      <h1>{{ planName }}</h1>
      <h2 class="text2" v-if="discountedPrice" style="display: none;">{{ discountedPrice }}</h2>
      <h2 class="text2" :style="{ display: !discountedPrice ? 'block' : 'none' }">{{ price }}</h2>
      <ul class="list">
        <li class="first">{{ features[0] }}</li>
        <li v-for="(feature, index) in features.slice(1)" :key="index">{{ feature }}</li>
      </ul>
      <a v-if="showButton" @cursor="pointer" class="button" :class="buttonClass" @click.prevent="$emit('upgrade')">{{ buttonName }}</a>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      planName: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true
      },
      discountedPrice: {
        type: String,
        default: null
      },
      features: {
        type: Array,
        required: true
      },
      planClass: {
        type: String,
        required: true
      },
      buttonClass: {
        type: String,
        required: false,
        default: ''
      },
      buttonName: {
        type: String,
        required: false,
        default: ''
      },
      showButton: {
        type: Boolean,
        default: true
      }
    }
  };
  </script>
  
  <style scoped>
  .packages {
    padding: 20px 10px;
    margin: 20px;
    width: 300px;
    padding-bottom: 1.5em;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-radius: 20px;
    box-shadow: 0 19px 38px rgba(30, 35, 33, 1), 0 15px 12px rgba(30, 35, 33, 0.2);
    flex-wrap: wrap;
    color: #f4f4f4;
  }
  .professional {
    background-color: #aba6b1e3;
  }
  .master {
    background-color: #9dab00;
  }
  .basic {
    background-color: #7c5677bd;
  }
  h1, h2 {
    font-size: 2.2em;
  }
  .list li {
    font-size: 20px;
    list-style: none;
    border-bottom: 1px solid #f4f4f4;
    padding-inline-start: 0;
    border-width: 1px;
    padding: 10px;
  }
  .first {
    margin-top: 40px;
    border-top: 1px solid #f4f4f4;
  }
  .list {
    width: 80%;
  }
  ol, ul {
    padding: 0;
  }
  .button {
    padding: 10px 30px;
    text-decoration: none;
    font-size: 1.4em;
    margin: 15px 15px;
    border-radius: 50px;
    color: #f4f4f4;
    transition: all 0.3s ease 0s;
  }
  .button:hover {
    transform: scale(1.2);
  }
  .button2 {
    background-color: #27c751;
  }
  .button3 {
    background-color: #e76640;
  }
  </style>