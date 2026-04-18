// User data storage (in a real app, this would be server-side)
let users = JSON.parse(localStorage.getItem('rentacar_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('rentacar_currentUser')) || null;

// DOM Elements
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const reservationForm = document.getElementById('reservationForm');
const navLinks = document.getElementById('navLinks');

// Initialize the auth system
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    
    // Register form handler
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Reservation form handler (pre-fill user data if logged in)
    if (reservationForm && currentUser) {
        document.getElementById('reservationName').value = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('reservationPhone').value = currentUser.phone;
    }
});

// Handle user registration
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const egn = document.getElementById('egn').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
        alert('Потребителското име вече съществува!');
        return;
    }
    
    // Create new user
    const newUser = {
        username,
        password, // Note: In a real app, passwords should be hashed
        firstName,
        lastName,
        egn,
        phone,
        email
    };
    
    users.push(newUser);
    localStorage.setItem('rentacar_users', JSON.stringify(users));
    
    // Auto-login the new user
    currentUser = newUser;
    localStorage.setItem('rentacar_currentUser', JSON.stringify(currentUser));
    
    // Update UI and close modal
    updateAuthUI();
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    
    alert('Регистрацията е успешна! Вече сте влезли в системата.');
}

// Handle user login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('rentacar_currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    } else {
        alert('Грешно потребителско име или парола!');
    }
}

// Handle user logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('rentacar_currentUser');
    updateAuthUI();
    window.location.href = 'index.html';
}

// Update UI