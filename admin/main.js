// Toggle sidebar
document.getElementById('toggleSidebar')?.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
});

// Sample user data
const userData = [
    { id: '#1234', username: 'Foulen ben Foulen', email: 'foulen@example.com', emailStatus: 'Email verified', deviceType: 'Desktop', createdAt: '2024-03-10' },
    { id: '#1235', username: 'Flena ben foulena', email: 'flena@example.com', emailStatus: 'Email not verified', deviceType: 'Mobile', createdAt: '2024-03-09' },
    { id: '#1236', username: 'John Doe', email: 'john@example.com', emailStatus: 'Email verified', deviceType: 'Desktop', createdAt: '2024-03-08' },
    { id: '#1237', username: 'Jane Smith', email: 'jane@example.com', emailStatus: 'Email verified', deviceType: 'Mobile', createdAt: '2024-03-07' }
];

// Function to update table content
function updateTable(data) {
    const tbody = document.querySelector('.orders-table tbody');
    tbody.innerHTML = data.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td><span class="status ${user.emailStatus.includes('not') ? 'pending' : 'completed'}">${user.emailStatus}</span></td>
            <td>${user.deviceType}</td>
            <td>${user.createdAt}</td>
        </tr>
    `).join('');
}

// Active navigation item and content switching
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.nav-item.active')?.classList.remove('active');
        item.classList.add('active');

        const isUsersData = item.querySelector('span').textContent === 'Users Data';
        const tableContainer = document.querySelector('.table-container');
        const statsGrid = document.querySelector('.stats-grid');
        const tableTitle = document.querySelector('.table-container h2');

        if (isUsersData) {
            tableTitle.textContent = 'Users Information';
            updateTable(userData);
            
            // Update table headers for Users Data view
            const headers = document.querySelector('.orders-table thead tr');
            headers.innerHTML = `
                <th>User ID</th>
                <th>Username</th>
                <th>Email Status</th>
                <th>Device Type</th>
                <th>Creation Date</th>
            `;
        } else {
            tableTitle.textContent = 'Recent Logins';
            updateTable(userData.slice(0, 2)); // Show only recent logins
        }
    });
});
// Notification button effect
document.querySelector('.notification-btn').addEventListener('click', (e) => {
    e.preventDefault();
    // Add notification functionality here
});
// JavaScript for the profile dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const profileToggle = document.getElementById('profileDropdownToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    
    // Toggle dropdown when clicking on profile
    profileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!profileToggle.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });
});