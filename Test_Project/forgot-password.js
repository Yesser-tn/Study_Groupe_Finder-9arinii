document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        // Here you would typically send a request to your server to initiate the password reset process
        console.log('Password reset requested for:', email);
        // For demo purposes, we'll just log the attempt
        alert('Password reset requested. In a real app, we would send a reset link to this email.');
    });
});