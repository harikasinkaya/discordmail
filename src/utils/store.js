// In-memory storage for user email sessions
// In production, replace with a database (MongoDB, PostgreSQL, etc.)

class EmailStore {
  constructor() {
    // Map<userId, {email: string, createdAt: Date, expiresAt: Date}>
    this.userEmails = new Map();
    
    // Map<email, userId>
    this.emailToUser = new Map();
    
    // Statistics
    this.stats = {
      totalUsers: 0,
      activeEmails: 0,
      totalMessages: 0
    };
  }

  /**
   * Store a user's temporary email
   * @param {string} userId - Discord user ID
   * @param {string} email - Temporary email address
   * @param {number} expiresIn - Expiration time in seconds
   */
  setEmail(userId, email, expiresIn = 3600) {
    const now = Date.now();
    const expiresAt = now + (expiresIn * 1000);
    
    // Remove old email if exists
    if (this.userEmails.has(userId)) {
      const oldEmail = this.userEmails.get(userId).email;
      this.emailToUser.delete(oldEmail);
      this.stats.activeEmails--;
    }
    
    this.userEmails.set(userId, {
      email,
      createdAt: new Date(now),
      expiresAt: new Date(expiresAt)
    });
    
    this.emailToUser.set(email, userId);
    this.stats.activeEmails++;
    this.stats.totalUsers++;
  }

  /**
   * Get user's temporary email
   * @param {string} userId - Discord user ID
   * @returns {object|null} Email data or null
   */
  getEmail(userId) {
    const data = this.userEmails.get(userId);
    if (!data) return null;
    
    // Check if expired
    if (Date.now() > data.expiresAt.getTime()) {
      this.deleteEmail(userId);
      return null;
    }
    
    return data;
  }

  /**
   * Delete user's temporary email
   * @param {string} userId - Discord user ID
   * @returns {boolean} Success status
   */
  deleteEmail(userId) {
    const data = this.userEmails.get(userId);
    if (!data) return false;
    
    this.emailToUser.delete(data.email);
    this.userEmails.delete(userId);
    this.stats.activeEmails--;
    return true;
  }

  /**
   * Get user ID by email
   * @param {string} email - Email address
   * @returns {string|null} User ID or null
   */
  getUserIdByEmail(email) {
    return this.emailToUser.get(email) || null;
  }

  /**
   * Increment message count
   * @param {number} count - Number of messages to add
   */
  addMessages(count = 1) {
    this.stats.totalMessages += count;
  }

  /**
   * Get bot statistics
   * @returns {object} Stats object
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Clean up expired emails
   */
  cleanup() {
    const now = Date.now();
    for (const [userId, data] of this.userEmails.entries()) {
      if (now > data.expiresAt.getTime()) {
        this.emailToUser.delete(data.email);
        this.userEmails.delete(userId);
        this.stats.activeEmails--;
      }
    }
  }

  /**
   * Start periodic cleanup
   * @param {number} intervalMs - Cleanup interval in milliseconds
   */
  startCleanup(intervalMs = 60000) {
    setInterval(() => this.cleanup(), intervalMs);
  }
}

module.exports = EmailStore;
