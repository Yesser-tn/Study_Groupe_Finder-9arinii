// This script fixes navigation issues between pages
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're navigating from profile page
  if (sessionStorage.getItem('navigatingFromProfile') === 'true') {
    // Clear the flag
    sessionStorage.removeItem('navigatingFromProfile');
    
    // Force reload the page to ensure all scripts run properly
    window.location.reload();
  }
});