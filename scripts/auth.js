/**
 * Authentication System for GrowthVerse
 * Handles user registration, login, logout, and session management
 */

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        this.loadUserFromStorage();
        this.updateNavigation();
    }

    // Load user data from localStorage
    loadUserFromStorage() {
        const userData = localStorage.getItem('growthverse_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    // Save user data to localStorage
    saveUserToStorage() {
        if (this.currentUser) {
            localStorage.setItem('growthverse_user', JSON.stringify(this.currentUser));
        }
    }

    // Register new user
    register(name, email, password) {
        // Check if user already exists
        const existingUsers = this.getUsers();
        const userExists = existingUsers.find(user => user.email === email);
        
        if (userExists) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString()
        };

        // Add to users list
        existingUsers.push(newUser);
        localStorage.setItem('growthverse_users', JSON.stringify(existingUsers));

        return { success: true, message: 'Registration successful' };
    }

    // Login user
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(user => user.email === email);
        
        if (!user || user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Set current user (remove password from session)
        const { password: _, ...userSession } = user;
        this.currentUser = userSession;
        this.saveUserToStorage();
        this.updateNavigation();

        return { success: true, message: 'Login successful' };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('growthverse_user');
        this.updateNavigation();
        return { success: true, message: 'Logged out successfully' };
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get all users from localStorage
    getUsers() {
        const users = localStorage.getItem('growthverse_users');
        return users ? JSON.parse(users) : [];
    }

    // Simple password hashing (for demo purposes)
    hashPassword(password) {
        // In a real application, use proper hashing like bcrypt
        return btoa(password + 'growthverse_salt');
    }

    // Update navigation based on authentication status
    updateNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;

        // Remove existing auth links
        const existingAuthLinks = navMenu.querySelectorAll('.auth-link, .user-menu');
        existingAuthLinks.forEach(link => link.remove());

        if (this.isAuthenticated()) {
            // Show user menu and logout
            const userMenu = this.createUserMenu();
            navMenu.appendChild(userMenu);
        } else {
            // Show login/signup links
            const loginLink = this.createAuthLink('Login', 'login.html');
            const signupLink = this.createAuthLink('Sign Up', 'signup.html');
            
            navMenu.appendChild(loginLink);
            navMenu.appendChild(signupLink);
        }
    }

    // Create authentication link
    createAuthLink(text, href) {
        const li = document.createElement('li');
        li.className = 'auth-link';
        
        const link = document.createElement('a');
        link.href = href;
        link.className = 'nav-link';
        link.textContent = text;
        
        li.appendChild(link);
        return li;
    }

    // Create user menu dropdown
    createUserMenu() {
        const li = document.createElement('li');
        li.className = 'user-menu';
        
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        
        const userButton = document.createElement('button');
        userButton.className = 'user-button';
        userButton.innerHTML = `👤 ${this.currentUser.name} ▼`;
        
        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';
        
        const dashboardLink = document.createElement('a');
        dashboardLink.href = 'dashboard.html';
        dashboardLink.textContent = 'Dashboard';
        
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.onclick = () => this.handleLogout();
        
        dropdownContent.appendChild(dashboardLink);
        dropdownContent.appendChild(logoutButton);
        
        dropdown.appendChild(userButton);
        dropdown.appendChild(dropdownContent);
        li.appendChild(dropdown);
        
        return li;
    }

    // Handle logout
    handleLogout() {
        const result = this.logout();
        if (result.success) {
            alert('Logged out successfully!');
            window.location.href = 'index.html';
        }
    }
}

// Initialize authentication system
const auth = new AuthSystem();

// Export for use in other files
window.authSystem = auth;
