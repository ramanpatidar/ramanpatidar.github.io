/**
 * Contact Form System for GrowthVerse
 * Handles contact form submission and data storage
 */

class ContactSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
    }

    // Setup contact form functionality
    setupContactForm() {
        const contactForm = document.querySelector('.contact-form-wrapper form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmission(contactForm);
        });
    }

    // Handle contact form submission
    handleContactSubmission(form) {
        const name = form.querySelector('input[type="text"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const message = form.querySelector('textarea').value.trim();

        // Basic validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Create contact message object
        const contactMessage = {
            id: Date.now(),
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString(),
            userId: window.authSystem && window.authSystem.isAuthenticated() ? window.authSystem.getCurrentUser().id : null,
            status: 'new'
        };

        // Save contact message to localStorage
        const messages = JSON.parse(localStorage.getItem('growthverse_messages') || '[]');
        messages.push(contactMessage);
        localStorage.setItem('growthverse_messages', JSON.stringify(messages));

        // Show success message
        this.showSuccessMessage();

        // Reset form
        form.reset();

        // Send notification email (simulated)
        this.sendNotificationEmail(contactMessage);
    }

    // Show success message with animation
    showSuccessMessage() {
        // Remove existing success message if any
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✅</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            </div>
        `;

        // Insert after contact form
        const contactFormWrapper = document.querySelector('.contact-form-wrapper');
        contactFormWrapper.parentNode.insertBefore(successMessage, contactFormWrapper.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 5000);

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Send notification email (simulated)
    sendNotificationEmail(contactMessage) {
        // In a real application, this would send an email to the business owner
        console.log('Contact form notification:', {
            to: 'admin@growthverse.com',
            subject: 'New Contact Form Submission',
            body: `
                New contact form submission from GrowthVerse website:
                
                Name: ${contactMessage.name}
                Email: ${contactMessage.email}
                Message: ${contactMessage.message}
                Time: ${new Date(contactMessage.timestamp).toLocaleString()}
                
                User ID: ${contactMessage.userId || 'Guest'}
            `
        });

        // Store in admin notifications
        const notifications = JSON.parse(localStorage.getItem('growthverse_notifications') || '[]');
        notifications.push({
            id: contactMessage.id,
            type: 'contact_form',
            title: 'New Contact Form Submission',
            message: `New message from ${contactMessage.name} (${contactMessage.email})`,
            timestamp: contactMessage.timestamp,
            read: false,
            data: contactMessage
        });
        localStorage.setItem('growthverse_notifications', JSON.stringify(notifications));
    }

    // Get contact messages (for admin dashboard)
    getContactMessages() {
        return JSON.parse(localStorage.getItem('growthverse_messages') || '[]');
    }

    // Get contact messages by user ID
    getContactMessagesByUser(userId) {
        const messages = this.getContactMessages();
        return messages.filter(message => message.userId === userId);
    }

    // Mark message as read
    markMessageAsRead(messageId) {
        const messages = this.getContactMessages();
        const message = messages.find(msg => msg.id === messageId);
        if (message) {
            message.status = 'read';
            localStorage.setItem('growthverse_messages', JSON.stringify(messages));
        }
    }
}

// Initialize contact system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactSystem = new ContactSystem();
    
    // Export for use in other files
    window.contactSystem = contactSystem;
});

// Export class for use in other files
window.ContactSystem = ContactSystem;
