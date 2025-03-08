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

  // Initialize dashboard components
  initializeTodoList()
  initializeSchedule()
  initializeTimer()
  initializeGroupChat()

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

  // Todo List Functionality
  function initializeTodoList() {
    const todoContainer = document.querySelector(".todo-container")
    if (!todoContainer) return

    const todoForm = document.getElementById("todo-form")
    const todoInput = document.getElementById("todo-input")
    const todoList = document.getElementById("todo-list")

    // Load todos from localStorage
    loadTodos()

    if (todoForm) {
      todoForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const todoText = todoInput.value.trim()
        if (todoText === "") return

        addTodo(todoText)
        todoInput.value = ""
      })
    }

    function addTodo(text) {
      const todoItem = document.createElement("li")
      todoItem.className = "todo-item"

      const checkbox = document.createElement("input")
      checkbox.type = "checkbox"
      checkbox.className = "todo-checkbox"

      const todoText = document.createElement("span")
      todoText.className = "todo-text"
      todoText.textContent = text

      const deleteBtn = document.createElement("button")
      deleteBtn.className = "todo-delete"
      deleteBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>'

      todoItem.appendChild(checkbox)
      todoItem.appendChild(todoText)
      todoItem.appendChild(deleteBtn)

      todoList.appendChild(todoItem)

      // Save todos to localStorage
      saveTodos()

      // Add event listeners
      checkbox.addEventListener("change", () => {
        todoText.classList.toggle("completed")
        saveTodos()
      })

      deleteBtn.addEventListener("click", () => {
        todoItem.remove()
        saveTodos()
      })
    }

    function saveTodos() {
      if (!todoList) return

      const todos = []
      const todoItems = todoList.querySelectorAll(".todo-item")

      todoItems.forEach((item) => {
        const text = item.querySelector(".todo-text").textContent
        const completed = item.querySelector(".todo-checkbox").checked

        todos.push({
          text: text,
          completed: completed,
        })
      })

      localStorage.setItem("todos", JSON.stringify(todos))
    }

    function loadTodos() {
      if (!todoList) return

      const savedTodos = localStorage.getItem("todos")
      if (savedTodos) {
        const todos = JSON.parse(savedTodos)

        todos.forEach((todo) => {
          const todoItem = document.createElement("li")
          todoItem.className = "todo-item"

          const checkbox = document.createElement("input")
          checkbox.type = "checkbox"
          checkbox.className = "todo-checkbox"
          checkbox.checked = todo.completed

          const todoText = document.createElement("span")
          todoText.className = "todo-text"
          if (todo.completed) {
            todoText.classList.add("completed")
          }
          todoText.textContent = todo.text

          const deleteBtn = document.createElement("button")
          deleteBtn.className = "todo-delete"
          deleteBtn.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>'

          todoItem.appendChild(checkbox)
          todoItem.appendChild(todoText)
          todoItem.appendChild(deleteBtn)

          todoList.appendChild(todoItem)

          // Add event listeners
          checkbox.addEventListener("change", () => {
            todoText.classList.toggle("completed")
            saveTodos()
          })

          deleteBtn.addEventListener("click", () => {
            todoItem.remove()
            saveTodos()
          })
        })
      }
    }
  }

  // Schedule Functionality
  function initializeSchedule() {
    const scheduleContainer = document.querySelector(".schedule-container")
    if (!scheduleContainer) return

    // Load events from localStorage
    loadEvents()

    const addEventBtn = document.getElementById("add-event-btn")
    const eventModal = document.getElementById("event-modal")
    const closeModalBtn = document.getElementById("close-modal-btn")
    const eventForm = document.getElementById("event-form")

    if (addEventBtn) {
      addEventBtn.addEventListener("click", () => {
        eventModal.classList.add("active")
      })
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => {
        eventModal.classList.remove("active")
      })
    }

    if (eventForm) {
      eventForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const eventTitle = document.getElementById("event-title").value
        const eventDate = document.getElementById("event-date").value
        const eventTime = document.getElementById("event-time").value
        const eventDescription = document.getElementById("event-description").value

        addEvent(eventTitle, eventDate, eventTime, eventDescription)

        eventForm.reset()
        eventModal.classList.remove("active")
      })
    }

    function addEvent(title, date, time, description) {
      const eventsList = document.getElementById("events-list")
      if (!eventsList) return

      const eventItem = document.createElement("div")
      eventItem.className = "event-item"

      const eventHeader = document.createElement("div")
      eventHeader.className = "event-header"

      const eventTitle = document.createElement("h3")
      eventTitle.className = "event-title"
      eventTitle.textContent = title

      const eventActions = document.createElement("div")
      eventActions.className = "event-actions"

      const editBtn = document.createElement("button")
      editBtn.className = "edit-event"
      editBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>'

      const deleteBtn = document.createElement("button")
      deleteBtn.className = "delete-event"
      deleteBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>'

      eventActions.appendChild(editBtn)
      eventActions.appendChild(deleteBtn)

      eventHeader.appendChild(eventTitle)
      eventHeader.appendChild(eventActions)

      const eventInfo = document.createElement("div")
      eventInfo.className = "event-info"

      const eventDateTime = document.createElement("div")
      eventDateTime.className = "event-datetime"
      eventDateTime.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${date} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${time}`

      const eventDesc = document.createElement("p")
      eventDesc.className = "event-description"
      eventDesc.textContent = description

      eventInfo.appendChild(eventDateTime)
      eventInfo.appendChild(eventDesc)

      eventItem.appendChild(eventHeader)
      eventItem.appendChild(eventInfo)

      eventsList.appendChild(eventItem)

      // Save events to localStorage
      saveEvents()

      // Add event listeners
      deleteBtn.addEventListener("click", () => {
        eventItem.remove()
        saveEvents()
      })

      editBtn.addEventListener("click", () => {
        // Populate form with event data
        document.getElementById("event-title").value = title
        document.getElementById("event-date").value = date
        document.getElementById("event-time").value = time
        document.getElementById("event-description").value = description

        // Show modal
        eventModal.classList.add("active")

        // Remove old event
        eventItem.remove()

        // Save events
        saveEvents()
      })
    }

    function saveEvents() {
      const eventsList = document.getElementById("events-list")
      if (!eventsList) return

      const events = []
      const eventItems = eventsList.querySelectorAll(".event-item")

      eventItems.forEach((item) => {
        const title = item.querySelector(".event-title").textContent
        const dateTimeText = item.querySelector(".event-datetime").textContent
        const description = item.querySelector(".event-description").textContent

        // Extract date and time from dateTimeText
        const dateMatch = dateTimeText.match(/(\d{4}-\d{2}-\d{2})/)
        const timeMatch = dateTimeText.match(/(\d{2}:\d{2})/)

        const date = dateMatch ? dateMatch[1] : ""
        const time = timeMatch ? timeMatch[1] : ""

        events.push({
          title: title,
          date: date,
          time: time,
          description: description,
        })
      })

      localStorage.setItem("events", JSON.stringify(events))
    }

    function loadEvents() {
      const eventsList = document.getElementById("events-list")
      if (!eventsList) return

      const savedEvents = localStorage.getItem("events")
      if (savedEvents) {
        const events = JSON.parse(savedEvents)

        events.forEach((event) => {
          addEvent(event.title, event.date, event.time, event.description)
        })
      }
    }
  }

  // Timer Functionality
  function initializeTimer() {
    const timerContainer = document.querySelector(".timer-container")
    if (!timerContainer) return

    const timerDisplay = document.getElementById("timer-display")
    const startBtn = document.getElementById("start-timer")
    const pauseBtn = document.getElementById("pause-timer")
    const resetBtn = document.getElementById("reset-timer")

    let timer
    let seconds = 0
    let minutes = 25
    let isRunning = false

    // Update timer display
    updateTimerDisplay()

    if (startBtn) {
      startBtn.addEventListener("click", startTimer)
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", pauseTimer)
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", resetTimer)
    }

    function startTimer() {
      if (isRunning) return

      isRunning = true

      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer)
            isRunning = false
            alert("Time is up!")
            return
          }

          minutes--
          seconds = 59
        } else {
          seconds--
        }

        updateTimerDisplay()
      }, 1000)
    }

    function pauseTimer() {
      clearInterval(timer)
      isRunning = false
    }

    function resetTimer() {
      clearInterval(timer)
      isRunning = false
      minutes = 25
      seconds = 0
      updateTimerDisplay()
    }

    function updateTimerDisplay() {
      if (!timerDisplay) return

      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes
      const formattedSeconds = seconds < 10 ? "0" + seconds : seconds

      timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`
    }
  }

  // Group Chat Functionality
  function initializeGroupChat() {
    const chatContainer = document.querySelector(".chat-container")
    if (!chatContainer) return

    const chatMessages = document.getElementById("chat-messages")
    const chatForm = document.getElementById("chat-form")
    const messageInput = document.getElementById("message-input")

    // Load messages from localStorage
    loadMessages()

    if (chatForm) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const messageText = messageInput.value.trim()
        if (messageText === "") return

        sendMessage(messageText)
        messageInput.value = ""
      })
    }

    function sendMessage(text) {
      if (!chatMessages) return

      const messageItem = document.createElement("div")
      messageItem.className = "message-item outgoing"

      const messageContent = document.createElement("div")
      messageContent.className = "message-content"

      const messageSender = document.createElement("div")
      messageSender.className = "message-sender"
      messageSender.textContent = "You"

      const messageText = document.createElement("div")
      messageText.className = "message-text"
      messageText.textContent = text

      const messageTime = document.createElement("div")
      messageTime.className = "message-time"

      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")

      messageTime.textContent = `${hours}:${minutes}`

      messageContent.appendChild(messageSender)
      messageContent.appendChild(messageText)
      messageContent.appendChild(messageTime)

      messageItem.appendChild(messageContent)

      chatMessages.appendChild(messageItem)

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight

      // Save messages to localStorage
      saveMessages()

      // Simulate response after 1 second
      setTimeout(() => {
        receiveMessage("This is a simulated response.")
      }, 1000)
    }

    function receiveMessage(text) {
      if (!chatMessages) return

      const messageItem = document.createElement("div")
      messageItem.className = "message-item incoming"

      const messageAvatar = document.createElement("div")
      messageAvatar.className = "message-avatar"
      messageAvatar.innerHTML = '<img src="images/avatar.jpg" alt="User Avatar">'

      const messageContent = document.createElement("div")
      messageContent.className = "message-content"

      const messageSender = document.createElement("div")
      messageSender.className = "message-sender"
      messageSender.textContent = "Bot"

      const messageText = document.createElement("div")
      messageText.className = "message-text"
      messageText.textContent = text

      const messageTime = document.createElement("div")
      messageTime.className = "message-time"

      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")

      messageTime.textContent = `${hours}:${minutes}`

      messageContent.appendChild(messageSender)
      messageContent.appendChild(messageText)
      messageContent.appendChild(messageTime)

      messageItem.appendChild(messageAvatar)
      messageItem.appendChild(messageContent)

      chatMessages.appendChild(messageItem)

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight

      // Save messages to localStorage
      saveMessages()
    }

    function saveMessages() {
      if (!chatMessages) return

      const messages = []
      const messageItems = chatMessages.querySelectorAll(".message-item")

      messageItems.forEach((item) => {
        const sender = item.querySelector(".message-sender").textContent
        const text = item.querySelector(".message-text").textContent
        const time = item.querySelector(".message-time").textContent
        const type = item.classList.contains("outgoing") ? "outgoing" : "incoming"

        messages.push({
          sender: sender,
          text: text,
          time: time,
          type: type,
        })
      })

      localStorage.setItem("chatMessages", JSON.stringify(messages))
    }

    function loadMessages() {
      if (!chatMessages) return

      const savedMessages = localStorage.getItem("chatMessages")
      if (savedMessages) {
        const messages = JSON.parse(savedMessages)

        messages.forEach((message) => {
          const messageItem = document.createElement("div")
          messageItem.className = `message-item ${message.type}`

          if (message.type === "incoming") {
            const messageAvatar = document.createElement("div")
            messageAvatar.className = "message-avatar"
            messageAvatar.innerHTML = '<img src="images/avatar.jpg" alt="User Avatar">'
            messageItem.appendChild(messageAvatar)
          }

          const messageContent = document.createElement("div")
          messageContent.className = "message-content"

          const messageSender = document.createElement("div")
          messageSender.className = "message-sender"
          messageSender.textContent = message.sender

          const messageText = document.createElement("div")
          messageText.className = "message-text"
          messageText.textContent = message.text

          const messageTime = document.createElement("div")
          messageTime.className = "message-time"
          messageTime.textContent = message.time

          messageContent.appendChild(messageSender)
          messageContent.appendChild(messageText)
          messageContent.appendChild(messageTime)

          messageItem.appendChild(messageContent)

          chatMessages.appendChild(messageItem)
        })

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight
      }
    }
  }
})

