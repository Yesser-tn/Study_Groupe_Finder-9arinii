document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const googleSignInBtn = document.getElementById('google-signin-btn');

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Here you would typically send a request to your server to create a new user
        console.log('Sign up attempt:', name, email, password);
        // For demo purposes, we'll just log the attempt
        alert('Sign up attempt recorded. In a real app, we would create an account with these details.');
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
    // Here you would typically send the user info to your server to create an account
}