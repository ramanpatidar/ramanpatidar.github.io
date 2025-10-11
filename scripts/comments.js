/**
 * Blog Comments System for GrowthVerse
 * Handles comment submission, storage, and display
 */

class CommentsSystem {
    constructor() {
        this.init();
    }

    init() {
        this.loadComments();
        this.setupCommentForm();
    }

    // Load comments from localStorage
    loadComments() {
        const comments = JSON.parse(localStorage.getItem('growthverse_comments') || '[]');
        this.displayComments(comments);
    }

    // Display comments on the page
    displayComments(comments) {
        const commentsContainer = document.querySelector('.comments-list');
        if (!commentsContainer) return;

        // Filter comments for current blog post
        const currentPost = this.getCurrentPostId();
        const postComments = comments.filter(comment => comment.postId === currentPost);

        if (postComments.length === 0) {
            commentsContainer.innerHTML = '<div class="no-comments"><p>No comments yet. Be the first to comment!</p></div>';
            return;
        }

        // Sort comments by timestamp (newest first)
        postComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        commentsContainer.innerHTML = postComments.map(comment => `
            <div class="comment-item">
                <div class="comment-author">
                    <div class="comment-avatar">${this.getInitials(comment.userName)}</div>
                    <div class="comment-info">
                        <h4>${comment.userName}</h4>
                        <span class="comment-date">${this.formatDate(comment.timestamp)}</span>
                    </div>
                </div>
                <div class="comment-text">
                    <p>${this.escapeHtml(comment.comment)}</p>
                </div>
            </div>
        `).join('');
    }

    // Setup comment form functionality
    setupCommentForm() {
        const commentForm = document.querySelector('.comment-form form');
        if (!commentForm) return;

        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCommentSubmission(commentForm);
        });
    }

    // Handle comment form submission
    handleCommentSubmission(form) {
        // Check if user is authenticated
        if (!window.authSystem || !window.authSystem.isAuthenticated()) {
            alert('Please login to leave a comment.');
            window.location.href = 'login.html';
            return;
        }

        const commentText = form.querySelector('textarea').value.trim();
        
        if (!commentText) {
            alert('Please enter a comment.');
            return;
        }

        const user = window.authSystem.getCurrentUser();
        const comment = {
            id: Date.now(),
            postId: this.getCurrentPostId(),
            postTitle: this.getCurrentPostTitle(),
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            comment: commentText,
            timestamp: new Date().toISOString()
        };

        // Save comment to localStorage
        const comments = JSON.parse(localStorage.getItem('growthverse_comments') || '[]');
        comments.push(comment);
        localStorage.setItem('growthverse_comments', JSON.stringify(comments));

        // Clear form and refresh comments
        form.reset();
        this.loadComments();

        // Show success message
        alert('Comment posted successfully!');
    }

    // Get current blog post ID (based on URL or page title)
    getCurrentPostId() {
        // For simplicity, use the page title as post ID
        const title = document.title;
        return title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }

    // Get current blog post title
    getCurrentPostTitle() {
        const titleElement = document.querySelector('h1');
        return titleElement ? titleElement.textContent : 'Blog Post';
    }

    // Get user initials
    getInitials(name) {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    // Format date for display
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Update comment form based on authentication status
    updateCommentForm() {
        const commentForm = document.querySelector('.comment-form');
        if (!commentForm) return;

        const form = commentForm.querySelector('form');
        const isAuthenticated = window.authSystem && window.authSystem.isAuthenticated();

        if (isAuthenticated) {
            // Show form for authenticated users
            form.style.display = 'block';
            const user = window.authSystem.getCurrentUser();
            
            // Update placeholder text
            const textarea = form.querySelector('textarea');
            if (textarea) {
                textarea.placeholder = `What are your thoughts, ${user.name}?`;
            }
        } else {
            // Show login prompt for unauthenticated users
            form.style.display = 'none';
            const loginPrompt = document.createElement('div');
            loginPrompt.className = 'login-prompt';
            loginPrompt.innerHTML = `
                <p>Please <a href="login.html">login</a> to leave a comment.</p>
                <p>Don't have an account? <a href="signup.html">Sign up here</a></p>
            `;
            
            // Remove existing login prompt if any
            const existingPrompt = commentForm.querySelector('.login-prompt');
            if (existingPrompt) {
                existingPrompt.remove();
            }
            
            commentForm.appendChild(loginPrompt);
        }
    }
}

// Initialize comments system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const commentsSystem = new CommentsSystem();
    
    // Update comment form based on auth status
    if (window.authSystem) {
        commentsSystem.updateCommentForm();
        
        // Update when auth status changes
        const originalUpdateNavigation = window.authSystem.updateNavigation;
        window.authSystem.updateNavigation = function() {
            originalUpdateNavigation.call(this);
            commentsSystem.updateCommentForm();
        };
    }
});

// Export for use in other files
window.commentsSystem = new CommentsSystem();
