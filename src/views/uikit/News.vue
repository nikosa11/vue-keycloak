<template>
    <div class="news-dashboard">
      <div class="sidebar">
        <div
          v-for="(news, index) in paginatedNews"
          :key="index"
          class="menu-item"
          :class="{ active: selectedNews === index + (currentPage - 1) * pageSize }"
          @click="showNews(index + (currentPage - 1) * pageSize)"
        >
          {{ news.title }}
        </div>
        <div class="paginator">
          <button @click="prevPage" :disabled="!canPrevPage" class="paginator-button">
            <i class="pi pi-arrow-left"></i>
          </button>
          <button @click="nextPage" :disabled="!canNextPage" class="paginator-button">
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
      </div>
      <div class="main-content">
        <div v-for="(news, index) in newsItems" :key="index" v-show="selectedNews === index" class="news-content">
          <div class="news-title">{{ news.title }}</div>
          <div class="news-subtitle">{{ news.subtitle }}</div>
          <img :src="news.image" :alt="news.title" class="news-image" />
          <div class="news-meta">
            <div class="news-author">By: {{ news.author }}</div>
            <div class="news-date">Date: {{ news.date }}</div>
            <div class="news-category">Category: {{ news.category }}</div>
          </div>
          <div class="news-description">{{ news.description }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newsItems: [
          {
            title: "Breaking News: Market Hits Record High",
            subtitle: "The stock market reached an all-time high today with unprecedented growth in the tech sector...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "The stock market reached an all-time high today with unprecedented growth in the tech sector. Investors are optimistic about future growth as tech companies continue to innovate...",
            author: "John Doe",
            date: "2024-07-01",
            category: "Finance"
          },
          {
            title: "Sports Update: Local Team Wins Championship",
            subtitle: "In an exciting final match, the local team secured the championship title with a last-minute goal...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "In an exciting final match, the local team secured the championship title with a last-minute goal. Fans are celebrating the victory across the city...",
            author: "Jane Smith",
            date: "2024-06-30",
            category: "Sports"
          },
          {
            title: "Health News: New Breakthrough in Cancer Research",
            subtitle: "Scientists have announced a significant breakthrough in cancer research that could lead to more effective treatments...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "Scientists have announced a significant breakthrough in cancer research that could lead to more effective treatments. The discovery could revolutionize the way cancer is treated in the future...",
            author: "Emily Brown",
            date: "2024-06-29",
            category: "Health"
          },
          {
            title: "Technology: New Smartphone Released",
            subtitle: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features. Tech enthusiasts are excited about the new possibilities...",
            author: "Michael Green",
            date: "2024-06-28",
            category: "Technology"
          },
          {
            title: "Technology: New Smartphone Released",
            subtitle: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features. Tech enthusiasts are excited about the new possibilities...",
            author: "Michael Green",
            date: "2024-06-28",
            category: "Technology"
          },
          {
            title: "Technology: New Smartphone Released",
            subtitle: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features. Tech enthusiasts are excited about the new possibilities...",
            author: "Michael Green",
            date: "2024-06-28",
            category: "Technology"
          },
          {
            title: "Technology: New Smartphone Released",
            subtitle: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features. Tech enthusiasts are excited about the new possibilities...",
            author: "Michael Green",
            date: "2024-06-28",
            category: "Technology"
          },
          {
            title: "Technology: New Smartphone Released",
            subtitle: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features. Tech enthusiasts are excited about the new possibilities...",
            author: "Michael Green",
            date: "2024-06-28",
            category: "Technology"
          },
          {
            title: "Technology: New Smartphone Released",
            subtitle: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features. Tech enthusiasts are excited about the new possibilities...",
            author: "Michael Green",
            date: "2024-06-28",
            category: "Technology"
          },
          {
            title: "Technology: New Smartphone Released",
            subtitle: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features. Tech enthusiasts are excited about the new possibilities...",
            author: "Michael Green",
            date: "2024-06-28",
            category: "Technology"
          },
          {
            title: "Technology: New Smartphone Released",
            subtitle: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "The latest smartphone model has been released, featuring cutting-edge technology and innovative new features. Tech enthusiasts are excited about the new possibilities...",
            author: "Michael Green",
            date: "2024-06-28",
            category: "Technology"
          },
          {
            title: "Entertainment: Award Show Highlights",
            subtitle: "Last night's award show was filled with memorable moments and stunning performances. Here are the highlights...",
            image: 'https://en.protothema.gr/wp-content/uploads/2024/07/Screenshot-2024-07-02-at-4.30.45-PM.png',
            description: "Last night's award show was filled with memorable moments and stunning performances. Celebrities gathered to celebrate the best in the industry...",
            author: "Sarah White",
            date: "2024-06-27",
            category: "Entertainment"
          }
          // Add more news items here if needed
        ],
        selectedNews: 0,
        currentPage: 1,
        pageSize: 10
      };
    },
    computed: {
      paginatedNews() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = this.currentPage * this.pageSize;
        return this.newsItems.slice(start, end);
      },
      canPrevPage() {
        return this.currentPage > 1;
      },
      canNextPage() {
        return this.currentPage * this.pageSize < this.newsItems.length;
      }
    },
    methods: {
      showNews(index) {
        this.selectedNews = index;
      },
      nextPage() {
        if (this.canNextPage) {
          this.currentPage++;
        }
      },
      prevPage() {
        if (this.canPrevPage) {
          this.currentPage--;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .news-dashboard {
    display: flex;
  }
  
  .sidebar {
    width: 250px;
    background-color: #f4f4f4;
    color: #333;
    height: 100vh;
    overflow-y: auto;
    padding: 20px;
    border-right: 1px solid #ccc;
  }
  
  .sidebar .menu-item {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
  }
  
  .sidebar .menu-item:hover, .sidebar .menu-item.active {
    background-color: #e0e0e0;
    font-weight: bold;
  }
  
  .main-content {
    flex-grow: 1;
    padding: 40px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  .news-title {
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
  }
  
  .news-subtitle {
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
    color: #555;
  }
  
  .news-image {
    width: 100%;
    max-width: 1200px;
    height: auto;
    margin-bottom: 20px;
    border-radius: 10px;
  }
  
  .news-meta {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin-bottom: 20px;
    font-size: 16px;
    color: #777;
  }
  
  .news-description {
    font-size: 18px;
    line-height: 1.6;
    max-width: 1200px;
    text-align: justify;
    margin-top: 20px;
  }
  
  /* Responsive Styles */
  @media (max-width: 1200px) {
    .news-image,
    .news-description,
    .news-meta {
      max-width: 1000px;
    }
  }
  
  @media (max-width: 992px) {
    .news-image,
    .news-description,
    .news-meta {
      max-width: 800px;
    }
  }
  
  @media (max-width: 768px) {
    .news-dashboard {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid #ccc;
    }
    
    .main-content {
      padding: 20px;
    }
    
    .news-image,
    .news-description,
    .news-meta {
      max-width: 100%;
    }
    
    .news-title {
      font-size: 28px;
    }
    
    .news-subtitle {
      font-size: 18px;
    }
    
    .news-description {
      font-size: 16px;
    }
  }
  
  .paginator {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
  }
  
  .paginator-button {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .paginator-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .paginator-button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  </style>
  