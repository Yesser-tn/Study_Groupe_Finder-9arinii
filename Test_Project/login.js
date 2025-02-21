document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const googleSignInBtn = document.getElementById('google-signin-btn');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Here you would typically send a request to your server to authenticate the user
        console.log('Login attempt:', email, password);
        // For demo purposes, we'll just log the attempt
        alert('Login attempt recorded. In a real app, we would validate these credentials.');
    });

    googleSignInBtn.addEventListener('click', function() {
        // In a real application, this is where you'd initiate the Google Sign-In flow
        console.log('Google Sign-In clicked');
        alert('Google Sign-In clicked. In a real app, this would open the Google authentication window.');
    });
});

// This function would be called when Google Sign-In is successful
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    // Here you would typically send the user info to your server to either log in or create an account
}