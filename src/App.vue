<template>
  <div class="container">
    <h1>Image Upload</h1>
    <form @submit.prevent="handleSubmit">
      <input type="file" @change="handleImageChange" accept="image/*" required />
      <button type="submit">Upload Image</button>
    </form>
    <div v-if="uploadProgress !== null" class="progress">
      <div class="progress-bar" role="progressbar" :style="{ width: uploadProgress + '%' }"></div>
    </div>
    <div v-if="processedImageUrl" id="processed-image">
      <h2>Processed Image</h2>
      <img :src="processedImageUrl" alt="Processed Image" />
      <button @click="downloadImage">Download Image</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      image: null,
      processedImageUrl: '',
      uploadProgress: null,
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.image) {
        // Handle error: no image selected
        return;
      }

      const formData = new FormData();
      formData.append('image', this.image);

      try {
        this.uploadProgress = 0;
        const config = {
          onUploadProgress: progressEvent => {
            this.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        const response = await axios.post('https://your-api-endpoint.com/process', formData, config);
        this.processedImageUrl = response.data.processedImageUrl;
      } catch (error) {
        console.error('Error:', error);
        // Handle error: display error message to the user
        this.processedImageUrl = URL.createObjectURL(this.image); // Fallback to uploaded image
      } finally {
        this.uploadProgress = null;
      }
    },
    handleImageChange(event) {
      this.image = event.target.files[0];
    },
    downloadImage() {
      const link = document.createElement('a');
      link.href = this.processedImageUrl;
      link.download = 'processed_image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}

form {
  margin-bottom: 20px;
}

input[type="file"] {
  margin-bottom: 10px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

#result-message {
  margin-top: 10px;
}

img {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}
</style>
