// huggingfaceService.js

// This module provides an integration service for Hugging Face APIs.

const axios = require('axios');

class HuggingFaceService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.huggingface.co/';
    }

    async callModel(model, data) {
        try {
            const response = await axios.post(`${this.baseUrl}models/${model}`, data, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error calling Hugging Face model:', error);
            throw new Error('Failed to call model');
        }
    }
}

module.exports = HuggingFaceService;