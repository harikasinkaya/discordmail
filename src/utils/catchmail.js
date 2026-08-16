const axios = require('axios');

class CatchMailAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.catchmail.io'; // Replace with actual API URL
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      }
    });
  }

  /**
   * Create a new temporary email address
   * @param {string} domain - Optional custom domain
   * @returns {Promise<object>} Email data including address and expiration
   */
  async createEmail(domain = null) {
    try {
      const response = await this.client.post('/email/create', {
        domain: domain || undefined
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create email: ${error.message}`);
    }
  }

  /**
   * Get inbox messages for an email address
   * @param {string} email - Email address to check
   * @returns {Promise<Array>} Array of messages
   */
  async getInbox(email) {
    try {
      const response = await this.client.get(`/email/${encodeURIComponent(email)}/inbox`);
      return response.data.messages || [];
    } catch (error) {
      throw new Error(`Failed to get inbox: ${error.message}`);
    }
  }

  /**
   * Delete a temporary email address
   * @param {string} email - Email address to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteEmail(email) {
    try {
      await this.client.delete(`/email/${encodeURIComponent(email)}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete email: ${error.message}`);
    }
  }

  /**
   * Get available domains
   * @returns {Promise<Array>} Array of available domains
   */
  async getDomains() {
    try {
      const response = await this.client.get('/domains');
      return response.data.domains || [];
    } catch (error) {
      throw new Error(`Failed to get domains: ${error.message}`);
    }
  }

  /**
   * Add a custom domain (Admin only)
   * @param {string} domain - Domain to add
   * @returns {Promise<boolean>} Success status
   */
  async addDomain(domain) {
    try {
      await this.client.post('/domains', { domain });
      return true;
    } catch (error) {
      throw new Error(`Failed to add domain: ${error.message}`);
    }
  }

  /**
   * Remove a custom domain (Admin only)
   * @param {string} domain - Domain to remove
   * @returns {Promise<boolean>} Success status
   */
  async removeDomain(domain) {
    try {
      await this.client.delete(`/domains/${encodeURIComponent(domain)}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to remove domain: ${error.message}`);
    }
  }

  /**
   * Get message details by ID
   * @param {string} email - Email address
   * @param {string} messageId - Message ID
   * @returns {Promise<object>} Message details
   */
  async getMessage(email, messageId) {
    try {
      const response = await this.client.get(`/email/${encodeURIComponent(email)}/message/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get message: ${error.message}`);
    }
  }
}

module.exports = CatchMailAPI;
