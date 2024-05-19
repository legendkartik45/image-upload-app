import axios from 'axios';

export default class ImageProcessor {
    constructor(cloudFunctionUrl) {
        this.cloudFunctionUrl = cloudFunctionUrl;
    }

    async processImage(imageFile) {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axios.post(this.cloudFunctionUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.processedImageUrl;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Failed to process the image');
        }
    }
}