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
import ImageProcessor from './services/ImageProcessorService'; // Import the ImageProcessor class

export default {
  data() {
    return {
      image: null,
      processedImageUrl: '',
      uploadProgress: null,
      uploading: false, // Indicates if uploading is in progress
      imageProcessor: new ImageProcessor('https://your-cloud-function-url'), // Initialize ImageProcessor with cloud function URL
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.image) {
        // Handle error: no image selected
        return;
      }

      this.uploading = true; // Start uploading
      this.uploadProgress = 0; // Initialize upload progress

      try {
        // Call the processImage method of the ImageProcessor
        this.processedImageUrl = await this.imageProcessor.processImage(this.image);

        // Set uploadProgress to 100% when processing is complete
        this.uploadProgress = 100;

      } catch (error) {
        console.error('Error:', error);
        // Handle error: display error message to the user
        this.processedImageUrl = URL.createObjectURL(this.image); // Fallback to uploaded image
        // Set uploadProgress to null in case of fallback
        this.uploadProgress = null;
      } finally {
        this.uploading = false; // Stop uploading
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
