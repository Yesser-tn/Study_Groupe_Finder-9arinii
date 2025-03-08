document.addEventListener("DOMContentLoaded", () => {
  // Sidebar Toggle
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
      sidebar.classList.toggle("mobile-open")
    })
  }

  // Quiz functionality
  const quizContainer = document.querySelector(".quiz-container")
  const quizSection = document.getElementById("quiz")
  if (!quizSection) return

  // Quiz tabs functionality
  const quizTabs = document.querySelectorAll(".quiz-tab")
  const quizLists = document.querySelectorAll(".quiz-list")

  // Quiz content containers
  const quizContent = document.createElement("div")
  quizContent.id = "quiz-content"
  quizContent.className = "quiz-content"
  quizContent.style.display = "none"
  quizSection.appendChild(quizContent)

  const quizResults = document.createElement("div")
  quizResults.id = "quiz-results"
  quizResults.className = "quiz-results"
  quizResults.style.display = "none"
  quizSection.appendChild(quizResults)

  // Add custom styles for quiz modal
  addQuizModalStyles()

  // Quiz modal for creating new quizzes
  let quizModal = document.getElementById("quiz-modal")
  if (!quizModal) {
    quizModal = document.createElement("div")
    quizModal.id = "quiz-modal"
    quizModal.className = "modal"
    quizModal.innerHTML = `
      <div class="modal-content quiz-modal-content">
        <h2>Create New Quiz</h2>
        <form id="quiz-creation-form">
          <div class="quiz-form-grid">
            <div class="form-group">
              <label for="quiz-title">Quiz Title</label>
              <input type="text" id="quiz-title" name="quiz-title" required>
            </div>
            <div class="form-group">
              <label for="quiz-description">Description</label>
              <textarea id="quiz-description" name="quiz-description" required></textarea>
            </div>
            <div class="form-group">
              <label for="quiz-subject">Subject</label>
              <input type="text" id="quiz-subject" name="quiz-subject" required>
            </div>
            <div class="form-group">
              <label for="quiz-time">Time Limit (minutes)</label>
              <input type="number" id="quiz-time" name="quiz-time" min="1" value="15" required>
            </div>
          </div>
          
          <h3>Questions</h3>
          <div id="questions-container" class="questions-container"></div>
          <button type="button" id="add-question-btn" class="add-question-btn">Add Question</button>
          
          <div class="form-actions">
            <button type="button" id="close-modal-btn" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Create Quiz</button>
          </div>
        </form>
      </div>
    `
    document.body.appendChild(quizModal)
  }

  // Initialize tabs
  if (quizTabs.length > 0) {
    quizTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Hide quiz content and results if visible
        quizContent.style.display = "none"
        quizResults.style.display = "none"

        // Show quiz lists
        quizLists.forEach((list) => {
          list.style.display = "none"
        })

        // Update active tab
        quizTabs.forEach((t) => {
          t.classList.remove("active")
        })
        tab.classList.add("active")

        // Show corresponding quiz list
        const tabType = tab.getAttribute("data-tab")
        const targetList = document.getElementById(`${tabType}-quizzes`)
        if (targetList) {
          targetList.style.display = "grid"
        }
      })
    })
  }

  // Load quizzes from localStorage or use defaults
  loadQuizzes()

  function loadQuizzes() {
    const savedQuizzes = localStorage.getItem("quizzes")
    let quizzes

    if (savedQuizzes) {
      quizzes = JSON.parse(savedQuizzes)
    } else {
      // Default quizzes
      quizzes = [
        {
          id: 1,
          title: "Calculus Fundamentals",
          description: "Test your knowledge of basic calculus concepts.",
          subject: "Mathematics",
          timeLimit: 15,
          questions: [
            {
              question: "What is the derivative of x²?",
              options: ["x", "2x", "x²", "2"],
              answer: 1,
            },
            {
              question: "What is the integral of 2x?",
              options: ["x²", "x² + C", "2x² + C", "x²/2 + C"],
              answer: 2,
            },
            {
              question: "What is the limit of (sin x)/x as x approaches 0?",
              options: ["0", "1", "∞", "undefined"],
              answer: 1,
            },
          ],
          completed: false,
          score: null,
          dateCompleted: null,
          created: false,
        },
        {
          id: 2,
          title: "Physics: Forces and Motion",
          description: "Test your knowledge of physics forces and motion.",
          subject: "Science",
          timeLimit: 20,
          questions: [
            {
              question: "What is Newton's First Law of Motion?",
              options: [
                "Force equals mass times acceleration",
                "An object at rest stays at rest unless acted upon by an external force",
                "For every action there is an equal and opposite reaction",
                "Energy cannot be created or destroyed",
              ],
              answer: 1,
            },
            {
              question: "What is the unit of force in the SI system?",
              options: ["Watt", "Joule", "Newton", "Pascal"],
              answer: 2,
            },
            {
              question: "What is the acceleration due to gravity on Earth?",
              options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "32 ft/s²"],
              answer: 0,
            },
          ],
          completed: false,
          score: null,
          dateCompleted: null,
          created: false,
        },
        {
          id: 3,
          title: "JavaScript Basics",
          description: "Test your knowledge of JavaScript fundamentals.",
          subject: "Computer Science",
          timeLimit: 18,
          questions: [
            {
              question: "Which of the following is not a JavaScript data type?",
              options: ["String", "Boolean", "Float", "Object"],
              answer: 2,
            },
            {
              question: "What will console.log(typeof []) output?",
              options: ["array", "object", "undefined", "null"],
              answer: 1,
            },
            {
              question: "Which method adds an element to the end of an array?",
              options: ["push()", "pop()", "shift()", "unshift()"],
              answer: 0,
            },
          ],
          completed: false,
          score: null,
          dateCompleted: null,
          created: false,
        },
        {
          id: 4,
          title: "Algebra Review",
          description: "Review of basic algebra concepts.",
          subject: "Mathematics",
          timeLimit: 15,
          questions: [
            {
              question: "Solve for x: 2x + 5 = 15",
              options: ["x = 5", "x = 10", "x = 7.5", "x = 5.5"],
              answer: 0,
            },
            {
              question: "Factor x² - 9",
              options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-4.5)(x+2)", "Cannot be factored"],
              answer: 0,
            },
          ],
          completed: true,
          score: 85,
          dateCompleted: "March 1, 2024",
          created: false,
        },
        {
          id: 5,
          title: "Shakespeare's Works",
          description: "Test your knowledge of Shakespeare's plays and sonnets.",
          subject: "Literature",
          timeLimit: 20,
          questions: [
            {
              question: "Which play features the character Hamlet?",
              options: ["Macbeth", "Hamlet", "Romeo and Juliet", "Othello"],
              answer: 1,
            },
            {
              question: "How many sonnets did Shakespeare write?",
              options: ["100", "154", "126", "200"],
              answer: 1,
            },
          ],
          completed: true,
          score: 92,
          dateCompleted: "February 25, 2024",
          created: false,
        },
        {
          id: 6,
          title: "World War II",
          description: "Test your knowledge of World War II history.",
          subject: "History",
          timeLimit: 25,
          questions: [
            {
              question: "In what year did World War II begin?",
              options: ["1939", "1941", "1938", "1940"],
              answer: 0,
            },
            {
              question: "Who was the leader of Nazi Germany during World War II?",
              options: ["Mussolini", "Stalin", "Hitler", "Churchill"],
              answer: 2,
            },
          ],
          completed: false,
          score: null,
          dateCompleted: null,
          created: true,
          participants: 8,
          avgScore: 78,
        },
      ]

      localStorage.setItem("quizzes", JSON.stringify(quizzes))
    }

    renderQuizzes(quizzes)
  }

  function renderQuizzes(quizzes) {
    // Clear existing quiz lists
    const availableList = document.getElementById("available-quizzes")
    const completedList = document.getElementById("completed-quizzes")
    const createdList = document.getElementById("created-quizzes")

    if (availableList) availableList.innerHTML = ""
    if (completedList) completedList.innerHTML = ""
    if (createdList) createdList.innerHTML = ""

    // Render quizzes in appropriate lists
    quizzes.forEach((quiz) => {
      if (quiz.created) {
        renderCreatedQuiz(quiz, createdList)
      } else if (quiz.completed) {
        renderCompletedQuiz(quiz, completedList)
      } else {
        renderAvailableQuiz(quiz, availableList)
      }
    })

    // Add event listeners to quiz buttons
    addQuizButtonListeners()
  }

  function renderAvailableQuiz(quiz, container) {
    if (!container) return

    const quizCard = document.createElement("div")
    quizCard.className = "quiz-card"
    quizCard.setAttribute("data-quiz-id", quiz.id)

    quizCard.innerHTML = `
      <div class="quiz-subject">${quiz.subject}</div>
      <h3 class="quiz-title">${quiz.title}</h3>
      <div class="quiz-details">
        <div class="quiz-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span>${quiz.questions.length} Questions</span>
        </div>
        <div class="quiz-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>${quiz.timeLimit} minutes</span>
        </div>
      </div>
      <button class="take-quiz-btn" data-quiz-id="${quiz.id}">Take Quiz</button>
    `

    container.appendChild(quizCard)
  }

  function renderCompletedQuiz(quiz, container) {
    if (!container) return

    const quizCard = document.createElement("div")
    quizCard.className = "quiz-card completed"
    quizCard.setAttribute("data-quiz-id", quiz.id)

    quizCard.innerHTML = `
      <div class="quiz-subject">${quiz.subject}</div>
      <h3 class="quiz-title">${quiz.title}</h3>
      <div class="quiz-details">
        <div class="quiz-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-award"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          <span>Score: ${quiz.score}%</span>
        </div>
        <div class="quiz-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>${quiz.dateCompleted}</span>
        </div>
      </div>
      <button class="review-quiz-btn" data-quiz-id="${quiz.id}">Review Quiz</button>
    `

    container.appendChild(quizCard)
  }

  function renderCreatedQuiz(quiz, container) {
    if (!container) return

    const quizCard = document.createElement("div")
    quizCard.className = "quiz-card created"
    quizCard.setAttribute("data-quiz-id", quiz.id)

    quizCard.innerHTML = `
      <div class="quiz-subject">${quiz.subject}</div>
      <h3 class="quiz-title">${quiz.title}</h3>
      <div class="quiz-details">
        <div class="quiz-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>${quiz.participants || 0} Participants</span>
        </div>
        <div class="quiz-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          <span>Avg. Score: ${quiz.avgScore || 0}%</span>
        </div>
      </div>
      <div class="quiz-actions">
        <button class="edit-quiz-btn" data-quiz-id="${quiz.id}">Edit</button>
        <button class="view-results-btn" data-quiz-id="${quiz.id}">View Results</button>
      </div>
    `

    container.appendChild(quizCard)
  }

  function addQuizButtonListeners() {
    // Take Quiz buttons
    const takeQuizBtns = document.querySelectorAll(".take-quiz-btn")
    takeQuizBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const quizId = Number.parseInt(this.getAttribute("data-quiz-id"))
        startQuiz(quizId)
      })
    })

    // Review Quiz buttons
    const reviewQuizBtns = document.querySelectorAll(".review-quiz-btn")
    reviewQuizBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const quizId = Number.parseInt(this.getAttribute("data-quiz-id"))
        reviewQuiz(quizId)
      })
    })

    // Edit Quiz buttons
    const editQuizBtns = document.querySelectorAll(".edit-quiz-btn")
    editQuizBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const quizId = Number.parseInt(this.getAttribute("data-quiz-id"))
        editQuiz(quizId)
      })
    })

    // View Results buttons
    const viewResultsBtns = document.querySelectorAll(".view-results-btn")
    viewResultsBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const quizId = Number.parseInt(this.getAttribute("data-quiz-id"))
        viewQuizResults(quizId)
      })
    })
  }

  function startQuiz(quizId) {
    const quizzes = JSON.parse(localStorage.getItem("quizzes"))
    const quiz = quizzes.find((q) => q.id === quizId)

    if (!quiz) return

    // Hide quiz lists
    quizLists.forEach((list) => {
      list.style.display = "none"
    })

    // Show quiz content
    quizContent.style.display = "block"
    quizResults.style.display = "none"

    // Render quiz questions
    renderQuizQuestions(quiz)
  }

  function renderQuizQuestions(quiz) {
    quizContent.innerHTML = `
      <div class="quiz-header">
        <h2>${quiz.title}</h2>
        <p>${quiz.description}</p>
        <div class="quiz-timer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span id="quiz-timer-display">${quiz.timeLimit}:00</span>
        </div>
      </div>
      <form id="quiz-form">
        ${quiz.questions
          .map(
            (q, index) => `
          <div class="question-item">
            <h3>Question ${index + 1}: ${q.question}</h3>
            <div class="options-container">
              ${q.options
                .map(
                  (option, optIndex) => `
                <div class="option-item">
                  <input type="radio" id="q${index}_o${optIndex}" name="q${index}" value="${optIndex}" required>
                  <label for="q${index}_o${optIndex}">${option}</label>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `,
          )
          .join("")}
        <div class="quiz-actions">
          <button type="button" id="cancel-quiz-btn" class="cancel-btn">Cancel</button>
          <button type="submit" id="submit-quiz-btn" class="submit-btn">Submit</button>
        </div>
      </form>
    `

    // Start timer
    startQuizTimer(quiz.timeLimit)

    // Add event listeners
    const quizForm = document.getElementById("quiz-form")
    const cancelBtn = document.getElementById("cancel-quiz-btn")

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        // Stop timer
        clearInterval(quizTimerInterval)

        // Show quiz list and hide quiz content
        quizLists[0].style.display = "grid"
        quizContent.style.display = "none"
      })
    }

    if (quizForm) {
      quizForm.addEventListener("submit", (e) => {
        e.preventDefault()

        // Stop timer
        clearInterval(quizTimerInterval)

        // Calculate score
        const userAnswers = []
        quiz.questions.forEach((q, index) => {
          const selectedOption = document.querySelector(`input[name="q${index}"]:checked`)
          if (selectedOption) {
            userAnswers.push(Number.parseInt(selectedOption.value))
          } else {
            userAnswers.push(-1) // No answer
          }
        })

        // Mark quiz as completed
        markQuizCompleted(quiz.id, userAnswers)

        // Show results
        showQuizResults(quiz, userAnswers)
      })
    }
  }

  let quizTimerInterval
  function startQuizTimer(minutes) {
    const timerDisplay = document.getElementById("quiz-timer-display")
    if (!timerDisplay) return

    let totalSeconds = minutes * 60

    quizTimerInterval = setInterval(() => {
      totalSeconds--

      if (totalSeconds <= 0) {
        clearInterval(quizTimerInterval)

        // Auto-submit the quiz
        document.getElementById("submit-quiz-btn").click()
        return
      }

      const mins = Math.floor(totalSeconds / 60)
      const secs = totalSeconds % 60

      timerDisplay.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`

      // Change color when time is running out
      if (totalSeconds < 60) {
        timerDisplay.style.color = "red"
      }
    }, 1000)
  }

  function markQuizCompleted(quizId, userAnswers) {
    const quizzes = JSON.parse(localStorage.getItem("quizzes"))
    const quizIndex = quizzes.findIndex((q) => q.id === quizId)

    if (quizIndex === -1) return

    const quiz = quizzes[quizIndex]

    // Calculate score
    let score = 0
    quiz.questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        score++
      }
    })

    const scorePercentage = Math.round((score / quiz.questions.length) * 100)

    // Update quiz
    quiz.completed = true
    quiz.score = scorePercentage

    // Set completion date
    const today = new Date()
    const options = { year: "numeric", month: "long", day: "numeric" }
    quiz.dateCompleted = today.toLocaleDateString("en-US", options)

    // Save updated quizzes
    quizzes[quizIndex] = quiz
    localStorage.setItem("quizzes", JSON.stringify(quizzes))
  }

  function showQuizResults(quiz, userAnswers) {
    // Hide quiz content and show results
    quizContent.style.display = "none"
    quizResults.style.display = "block"

    // Calculate score
    let score = 0
    quiz.questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        score++
      }
    })

    const scorePercentage = Math.round((score / quiz.questions.length) * 100)

    // Render results
    quizResults.innerHTML = `
      <div class="results-header">
        <h2>Quiz Results</h2>
        <div class="results-summary">
          <h3>${quiz.title}</h3>
          <p>Your score: ${score} out of ${quiz.questions.length}</p>
          <div class="score-percentage">${scorePercentage}%</div>
        </div>
      </div>
      
      <div class="results-details">
        <h3>Question Review</h3>
        ${quiz.questions
          .map(
            (q, index) => `
          <div class="result-item ${userAnswers[index] === q.answer ? "correct" : "incorrect"}">
            <h4>Question ${index + 1}: ${q.question}</h4>
            <div class="result-options">
              ${q.options
                .map(
                  (option, optIndex) => `
                <div class="result-option ${optIndex === q.answer ? "correct-answer" : ""} ${optIndex === userAnswers[index] ? "user-answer" : ""}">
                  ${option}
                  ${optIndex === q.answer ? ' <span class="correct-badge">✓ Correct</span>' : ""}
                  ${optIndex === userAnswers[index] && optIndex !== q.answer ? ' <span class="incorrect-badge">✗ Your Answer</span>' : ""}
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
      
      <div class="results-actions">
        <button id="back-to-quizzes-btn" class="back-btn">Back to Quizzes</button>
        <button id="retry-quiz-btn" class="retry-btn" data-quiz-id="${quiz.id}">Retry Quiz</button>
      </div>
    `

    // Add event listeners
    const backBtn = document.getElementById("back-to-quizzes-btn")
    const retryBtn = document.getElementById("retry-quiz-btn")

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        // Show completed quiz list and hide results
        quizLists.forEach((list) => {
          list.style.display = "none"
        })
        document.getElementById("completed-quizzes").style.display = "grid"
        quizResults.style.display = "none"

        // Update quiz tabs
        quizTabs.forEach((tab) => {
          tab.classList.remove("active")
          if (tab.getAttribute("data-tab") === "completed") {
            tab.classList.add("active")
          }
        })

        // Reload quizzes to update the lists
        loadQuizzes()
      })
    }

    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        // Hide results and start quiz again
        quizResults.style.display = "none"
        startQuiz(Number.parseInt(retryBtn.getAttribute("data-quiz-id")))
      })
    }
  }

  function reviewQuiz(quizId) {
    const quizzes = JSON.parse(localStorage.getItem("quizzes"))
    const quiz = quizzes.find((q) => q.id === quizId)

    if (!quiz || !quiz.completed) return

    // Hide quiz lists
    quizLists.forEach((list) => {
      list.style.display = "none"
    })

    // Show quiz results
    quizResults.style.display = "block"

    // Create mock user answers based on score
    const userAnswers = []
    quiz.questions.forEach((q, index) => {
      // For simplicity, we'll assume the first X% of questions were answered correctly
      const correctAnswersNeeded = Math.round((quiz.score / 100) * quiz.questions.length)
      if (index < correctAnswersNeeded) {
        userAnswers.push(q.answer) // Correct answer
      } else {
        // Random wrong answer
        let wrongAnswer
        do {
          wrongAnswer = Math.floor(Math.random() * q.options.length)
        } while (wrongAnswer === q.answer)
        userAnswers.push(wrongAnswer)
      }
    })

    // Show results
    showQuizResults(quiz, userAnswers)
  }

  function editQuiz(quizId) {
    const quizzes = JSON.parse(localStorage.getItem("quizzes"))
    const quiz = quizzes.find((q) => q.id === quizId)

    if (!quiz || !quiz.created) return

    // Show modal
    quizModal.classList.add("active")

    // Populate form with quiz data
    document.getElementById("quiz-title").value = quiz.title
    document.getElementById("quiz-description").value = quiz.description
    document.getElementById("quiz-subject").value = quiz.subject
    document.getElementById("quiz-time").value = quiz.timeLimit

    // Add questions
    const questionsContainer = document.getElementById("questions-container")
    questionsContainer.innerHTML = ""

    quiz.questions.forEach((question, index) => {
      addQuestionToForm(question, index)
    })

    // Update form submission handler
    const quizCreationForm = document.getElementById("quiz-creation-form")

    // Remove existing event listeners by cloning and replacing
    const newForm = quizCreationForm.cloneNode(true)
    quizCreationForm.parentNode.replaceChild(newForm, quizCreationForm)

    // Add new event listener
    newForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const title = document.getElementById("quiz-title").value
      const description = document.getElementById("quiz-description").value
      const subject = document.getElementById("quiz-subject").value
      const timeLimit = Number.parseInt(document.getElementById("quiz-time").value)

      // Get questions
      const questionItems = document.querySelectorAll(".question-creation-item")
      const questions = []

      questionItems.forEach((item, index) => {
        const questionText = document.getElementById(`question-${index}`).value
        const options = [
          document.querySelector(`input[name="option-${index}-0"]`).value,
          document.querySelector(`input[name="option-${index}-1"]`).value,
          document.querySelector(`input[name="option-${index}-2"]`).value,
          document.querySelector(`input[name="option-${index}-3"]`).value,
        ]

        const answer = Number.parseInt(document.querySelector(`input[name="answer-${index}"]:checked`).value)

        questions.push({
          question: questionText,
          options: options,
          answer: answer,
        })
      })

      // Update quiz
      const quizzes = JSON.parse(localStorage.getItem("quizzes"))
      const quizIndex = quizzes.findIndex((q) => q.id === quizId)

      if (quizIndex !== -1) {
        quizzes[quizIndex] = {
          ...quizzes[quizIndex],
          title,
          description,
          subject,
          timeLimit,
          questions,
        }

        localStorage.setItem("quizzes", JSON.stringify(quizzes))
      }

      // Close modal and reload quizzes
      quizModal.classList.remove("active")
      loadQuizzes()
    })

    // Update close button
    const closeModalBtn = document.getElementById("close-modal-btn")
    const newCloseBtn = closeModalBtn.cloneNode(true)
    closeModalBtn.parentNode.replaceChild(newCloseBtn, closeModalBtn)

    newCloseBtn.addEventListener("click", () => {
      quizModal.classList.remove("active")
    })

    // Update add question button
    const addQuestionBtn = document.getElementById("add-question-btn")
    const newAddQuestionBtn = addQuestionBtn.cloneNode(true)
    addQuestionBtn.parentNode.replaceChild(newAddQuestionBtn, addQuestionBtn)

    newAddQuestionBtn.addEventListener("click", () => {
      const questionCount = document.querySelectorAll(".question-creation-item").length
      addQuestionToForm(null, questionCount)
    })
  }

  function addQuestionToForm(question = null, index) {
    const questionsContainer = document.getElementById("questions-container")

    const questionItem = document.createElement("div")
    questionItem.className = "question-creation-item"

    // Create question header with number and remove button
    const questionHeader = document.createElement("div")
    questionHeader.className = "question-header"
    questionHeader.innerHTML = `
      <h3>Question ${index + 1}</h3>
      <button type="button" class="remove-question-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `

    // Create question text input
    const questionTextGroup = document.createElement("div")
    questionTextGroup.className = "form-group"
    questionTextGroup.innerHTML = `
      <label for="question-${index}">Question Text</label>
      <input type="text" id="question-${index}" name="question-${index}" value="${question ? question.question : ""}" required>
    `

    // Create options container
    const optionsContainer = document.createElement("div")
    optionsContainer.className = "options-creation-container"

    // Add 4 options
    for (let i = 0; i < 4; i++) {
      const optionValue = question ? question.options[i] : ""
      const isChecked = question && question.answer === i ? "checked" : ""

      const optionItem = document.createElement("div")
      optionItem.className = "option-creation-item"
      optionItem.innerHTML = `
        <div class="option-input">
          <input type="text" name="option-${index}-${i}" value="${optionValue}" placeholder="Option ${i + 1}" required>
        </div>
        <div class="option-radio">
          <input type="radio" id="answer-${index}-${i}" name="answer-${index}" value="${i}" ${isChecked} required>
          <label for="answer-${index}-${i}">Correct</label>
        </div>
      `
      optionsContainer.appendChild(optionItem)
    }

    // Assemble the question item
    questionItem.appendChild(questionHeader)
    questionItem.appendChild(questionTextGroup)
    questionItem.appendChild(optionsContainer)

    questionsContainer.appendChild(questionItem)

    // Add event listener to remove button
    const removeBtn = questionItem.querySelector(".remove-question-btn")
    removeBtn.addEventListener("click", () => {
      questionItem.remove()

      // Update question numbers
      const questionItems = questionsContainer.querySelectorAll(".question-creation-item")
      questionItems.forEach((item, idx) => {
        item.querySelector("h3").textContent = `Question ${idx + 1}`
      })
    })
  }

  function viewQuizResults(quizId) {
    const quizzes = JSON.parse(localStorage.getItem("quizzes"))
    const quiz = quizzes.find((q) => q.id === quizId)

    if (!quiz || !quiz.created) return

    // Hide quiz lists
    quizLists.forEach((list) => {
      list.style.display = "none"
    })

    // Show results
    quizResults.style.display = "block"
    quizResults.innerHTML = `
      <div class="results-header">
        <h2>Quiz Results: ${quiz.title}</h2>
        <div class="results-summary">
          <p>Total Participants: ${quiz.participants || 0}</p>
          <p>Average Score: ${quiz.avgScore || 0}%</p>
        </div>
      </div>
      
      <div class="results-details">
        <h3>Question Analysis</h3>
        ${quiz.questions
          .map(
            (q, index) => `
          <div class="result-item">
            <h4>Question ${index + 1}: ${q.question}</h4>
            <div class="result-options">
              ${q.options
                .map(
                  (option, optIndex) => `
                <div class="result-option ${optIndex === q.answer ? "correct-answer" : ""}">
                  ${option}
                  ${optIndex === q.answer ? ' <span class="correct-badge">✓ Correct Answer</span>' : ""}
                  <div class="option-stats">
                    <div class="option-bar" style="width: ${Math.floor(Math.random() * 100)}%;"></div>
                    <span>${Math.floor(Math.random() * 100)}%</span>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
      
      <div class="results-actions">
        <button id="back-to-quizzes-btn" class="back-btn">Back to Quizzes</button>
        <button id="export-results-btn" class="export-btn">Export Results</button>
      </div>
    `

    // Add event listeners
    const backBtn = document.getElementById("back-to-quizzes-btn")
    const exportBtn = document.getElementById("export-results-btn")

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        // Show created quiz list and hide results
        quizLists.forEach((list) => {
          list.style.display = "none"
        })
        document.getElementById("created-quizzes").style.display = "grid"
        quizResults.style.display = "none"

        // Update quiz tabs
        quizTabs.forEach((tab) => {
          tab.classList.remove("active")
          if (tab.getAttribute("data-tab") === "created") {
            tab.classList.add("active")
          }
        })
      })
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        alert("Results exported successfully!")
      })
    }
  }

  // Create Quiz functionality
  const createQuizBtn = document.querySelector(".create-quiz-btn")

  if (createQuizBtn) {
    createQuizBtn.addEventListener("click", () => {
      // Reset form
      const quizCreationForm = document.getElementById("quiz-creation-form")
      if (quizCreationForm) {
        quizCreationForm.reset()
      }

      // Clear questions
      const questionsContainer = document.getElementById("questions-container")
      if (questionsContainer) {
        questionsContainer.innerHTML = ""
      }

      // Show modal
      quizModal.classList.add("active")
    })
  }

  // Close modal when clicking outside
  quizModal.addEventListener("click", (e) => {
    if (e.target === quizModal) {
      quizModal.classList.remove("active")
    }
  })

  // Add question button
  const addQuestionBtn = document.getElementById("add-question-btn")
  const questionsContainer = document.getElementById("questions-container")

  if (addQuestionBtn && questionsContainer) {
    addQuestionBtn.addEventListener("click", () => {
      const questionCount = questionsContainer.querySelectorAll(".question-creation-item").length
      addQuestionToForm(null, questionCount)
    })
  }

  // Create quiz form submission
  const quizCreationForm = document.getElementById("quiz-creation-form")
  if (quizCreationForm) {
    quizCreationForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const quizTitle = document.getElementById("quiz-title").value
      const quizDescription = document.getElementById("quiz-description").value
      const quizSubject = document.getElementById("quiz-subject").value
      const quizTime = Number.parseInt(document.getElementById("quiz-time").value)

      const questionItems = questionsContainer.querySelectorAll(".question-creation-item")
      const questions = []

      questionItems.forEach((item, index) => {
        const questionText = document.getElementById(`question-${index}`).value
        const options = [
          document.querySelector(`input[name="option-${index}-0"]`).value,
          document.querySelector(`input[name="option-${index}-1"]`).value,
          document.querySelector(`input[name="option-${index}-2"]`).value,
          document.querySelector(`input[name="option-${index}-3"]`).value,
        ]

        const answer = Number.parseInt(document.querySelector(`input[name="answer-${index}"]:checked`).value)

        questions.push({
          question: questionText,
          options: options,
          answer: answer,
        })
      })

      // Get existing quizzes
      const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]")

      // Generate new quiz ID
      const newId = quizzes.length > 0 ? Math.max(...quizzes.map((q) => q.id)) + 1 : 1

      // Create new quiz
      const newQuiz = {
        id: newId,
        title: quizTitle,
        description: quizDescription,
        subject: quizSubject,
        timeLimit: quizTime,
        questions: questions,
        completed: false,
        score: null,
        dateCompleted: null,
        created: true,
        participants: 0,
        avgScore: 0,
      }

      // Add to quizzes array
      quizzes.push(newQuiz)

      // Save to localStorage
      localStorage.setItem("quizzes", JSON.stringify(quizzes))

      // Reset form and close modal
      quizCreationForm.reset()
      questionsContainer.innerHTML = ""
      quizModal.classList.remove("active")

      // Re-render quiz list
      renderQuizzes(quizzes)

      // Switch to created tab
      quizTabs.forEach((tab) => {
        tab.classList.remove("active")
        if (tab.getAttribute("data-tab") === "created") {
          tab.classList.add("active")
        }
      })

      quizLists.forEach((list) => {
        list.style.display = "none"
      })
      document.getElementById("created-quizzes").style.display = "grid"
    })
  }

  // Add custom styles for quiz modal
  function addQuizModalStyles() {
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      /* Quiz Modal Styles */
      .quiz-modal-content {
        max-width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        padding: 1.5rem;
      }
      
      .quiz-form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      
      .quiz-form-grid .form-group:nth-child(2) {
        grid-column: span 2;
      }
      
      .questions-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        max-height: 60vh;
        overflow-y: auto;
        padding-right: 0.5rem;
      }
      
      .question-creation-item {
        background-color: #f8f9fa;
        border-radius: 0.5rem;
        padding: 1rem;
        border: 1px solid #e0e0e0;
      }
      
      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }
      
      .question-header h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
      }
      
      .remove-question-btn {
        background: none;
        border: none;
        color: #ff5252;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .remove-question-btn:hover {
        background-color: rgba(255, 82, 82, 0.1);
      }
      
      .remove-question-btn svg {
        width: 18px;
        height: 18px;
      }
      
      .options-creation-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin-top: 0.75rem;
      }
      
      .option-creation-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .option-input {
        flex: 1;
      }
      
      .option-input input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.25rem;
        font-size: 0.875rem;
      }
      
      .option-radio {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        white-space: nowrap;
      }
      
      .option-radio label {
        font-size: 0.75rem;
        color: #666;
      }
      
      .add-question-btn {
        background-color: var(--primary-light);
        color: var(--primary-color);
        border: 1px dashed var(--primary-color);
        border-radius: 0.5rem;
        padding: 0.75rem;
        width: 100%;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 1rem;
      }
      
      .add-question-btn:hover {
        background-color: var(--primary-color);
        color: white;
      }
      
      @media (max-width: 768px) {
        .quiz-form-grid {
          grid-template-columns: 1fr;
        }
        
        .quiz-form-grid .form-group:nth-child(2) {
          grid-column: span 1;
        }
        
        .options-creation-container {
          grid-template-columns: 1fr;
        }
      }
    `
    document.head.appendChild(styleElement)
  }

  // Responsive adjustments
  function handleResize() {
    if (window.innerWidth <= 768) {
      sidebar.classList.add("collapsed")
      sidebar.classList.remove("mobile-open")
      mainContent.style.marginLeft = "0"
    } else if (window.innerWidth <= 992) {
      sidebar.classList.add("collapsed")
      sidebar.classList.remove("mobile-open")
      mainContent.style.marginLeft = ""
    } else {
      sidebar.classList.remove("collapsed")
      mainContent.style.marginLeft = ""
    }
  }

  window.addEventListener("resize", handleResize)

  // Initial call to set the correct state
  handleResize()
})

