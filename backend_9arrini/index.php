<?php
require_once 'config.php';

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    // Redirect to dashboard
    header("Location: dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>9arrini|قَرِّيني</title>
    <link rel="icon" href="logo.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #00BFA5;
            --secondary-color: #4A90E2;
            --background-color: #F5F7FA;
            --text-color: #2C3E50;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        body {
            background-color: var(--background-color);
            color: var(--text-color);
        }

        .navbar {
            background: white;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 100;
            transition: background-color 0.3s ease;
        }

        .navbar.scrolled {
            background-color: rgba(255, 255, 255, 0.9);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-color);
            text-decoration: none;
            display: flex;
            align-items: center;
        }

        .logo img {
            height: 40px;
            margin-right: 10px;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-color);
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: var(--primary-color);
        }

        .btn {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.3s ease, transform 0.3s ease;
            display: inline-block;
            text-decoration: none;
        }

        .btn-primary {
            background-color: var(--primary-color);
            color: white;
        }

        .btn-primary:hover {
            background-color: #009688;
            transform: translateY(-2px);
        }

        .main-content {
            margin-top: 80px;
            padding: 2rem 0;
        }

        .hero {
            text-align: center;
            padding: 4rem 0;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 1s ease forwards;
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .hero h1 {
            font-size: 2.5rem;
            color: var(--text-color);
            margin-bottom: 1rem;
        }

        .hero p {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 2rem;
        }

        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .tool-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .tool-card.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .tool-card h3 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }

        .feature-section {
            padding: 4rem 0;
            background: white;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }

        .feature-card {
            text-align: center;
            padding: 1.5rem;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .feature-card.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .feature-card img {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
        }

        .scroll-reveal {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .scroll-reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Footer Styling */
        footer {
            background-color: var(--text-color);
            color: white;
            text-align: center;
            padding: 1rem 0;
            margin-top: 4rem;
        }

        footer p {
            margin: 0;
            font-size: 0.9rem;
        }

        /* Feedback Button Styling */
        .feedback-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background-color: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease, transform 0.3s ease;
            z-index: 1000;
        }

        .feedback-btn:hover {
            background-color: #009688;
            transform: scale(1.1);
        }

        .feedback-btn span {
            font-size: 24px;
        }

        /* Hover Message */
        .feedback-btn::after {
            content: "Contact Site Developers";
            position: absolute;
            bottom: 60px; /* Position above the button */
            right: 0;
            background-color: var(--text-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .feedback-btn:hover::after {
            opacity: 1;
            visibility: visible;
        }

        /* tlk.io Chat Widget Styling */
        #tlkio {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 350px;
            height: 500px;
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            display: none; /* Hidden by default */
            z-index: 1000;
            background-color: white; /* Force white background */
        }

        /* Override tlk.io styles */
        #tlkio iframe {
            background-color: white !important;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container nav-content">
            <a href="#" class="logo">
                <img src="logo.png" alt="9arrini Logo">
                9arrini-قَرِّيني
            </a>
            <div class="nav-links">
                <a href="login.php" class="btn btn-primary">Login/Signup</a>
            </div>
        </div>
    </nav>
    <main class="main-content">
        <div class="container">
            <section class="hero">
                <h1>Find Your Perfect Study Partner</h1>
                <p>Connect with students who share your academic interests and goals</p>
                <a href="login.php" class="btn btn-primary">Get Started</a>
            </section>
            
            <section class="tools-grid">
                <div class="tool-card scroll-reveal">
                    <h3>Pomodoro Timer</h3>
                    <p>Stay focused with timed study sessions</p>
                </div>
                <div class="tool-card scroll-reveal">
                    <h3>Flashcards</h3>
                    <p>Create and study with digital flashcards</p>
                </div>
                <div class="tool-card scroll-reveal">
                    <h3>Quiz Creator</h3>
                    <p>Test your knowledge with custom quizzes</p>
                </div>
                <div class="tool-card scroll-reveal">
                    <h3>To-Do List</h3>
                    <p>Track your tasks and assignments</p>
                </div>
            </section>
            
            <section class="feature-section">
                <div class="feature-grid">
                    <div class="feature-card scroll-reveal">
                        <img src="match.png" alt="Match icon">
                        <h3>Smart Matching</h3>
                        <p>Find study partners based on your subjects and schedule</p>
                    </div>
                    <div class="feature-card scroll-reveal">
                        <img src="chat.png" alt="Chat icon">
                        <h3>Real-time Chat</h3>
                        <p>Communicate easily with your study partners</p>
                    </div>
                    <div class="feature-card scroll-reveal">
                        <img src="todo.png" alt="Tools icon">
                        <h3>Study Tools</h3>
                        <p>Access productivity tools to enhance your learning</p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Footer Section -->
    <footer>
        <div class="container">
            <p>&copy; 2025 9arrini-قَرِّيني. All rights reserved.</p>
        </div>
    </footer>

    <!-- Feedback Button -->
    <div class="feedback-btn" onclick="toggleChat()">
        <span>💬</span>
    </div>

    <!-- tlk.io Chat Widget -->
    <iframe id="tlkio" src="https://tlk.io/mate" style="display: none;"></iframe>

    <script>
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Scroll reveal animation
        const scrollReveal = () => {
            const elements = document.querySelectorAll('.scroll-reveal');
            elements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const elementVisible = 150;
                if (elementTop < window.innerHeight - elementVisible) {
                    el.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', scrollReveal);
        window.addEventListener('load', scrollReveal);

        // Toggle tlk.io chat widget
        function toggleChat() {
            const chatWidget = document.getElementById('tlkio');
            if (chatWidget.style.display === 'none' || chatWidget.style.display === '') {
                chatWidget.style.display = 'block';
            } else {
                chatWidget.style.display = 'none';
            }
        }
    </script>
</body>
</html>