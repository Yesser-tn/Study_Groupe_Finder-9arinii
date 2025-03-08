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

  // Todo List Functionality
  const todoContainer = document.querySelector(".todo-container")
  if (!todoContainer) return

  const addTodoForm = document.querySelector(".add-todo-form")
  const newTodoInput = document.getElementById("new-todo")
  const addTodoBtn = document.getElementById("add-todo-btn")
  const todoList = document.querySelector(".todo-list")
  const todoFilters = document.querySelectorAll(".todo-filter")

  // Load todos from localStorage
  loadTodos()

  // Add new todo
  if (addTodoBtn) {
    addTodoBtn.addEventListener("click", () => {
      addNewTodo()
    })
  }

  if (addTodoForm) {
    addTodoForm.addEventListener("submit", (e) => {
      e.preventDefault()
      addNewTodo()
    })
  }

  function addNewTodo() {
    const todoText = newTodoInput.value.trim()
    if (todoText === "") return

    // Show priority selection modal
    showPriorityModal(todoText)

    // Clear input
    newTodoInput.value = ""
  }

  // Filter todos
  if (todoFilters) {
    todoFilters.forEach((filter) => {
      filter.addEventListener("click", function () {
        const filterType = this.getAttribute("data-filter")

        // Update active filter
        todoFilters.forEach((f) => f.classList.remove("active"))
        this.classList.add("active")

        // Filter todos
        filterTodos(filterType)
      })
    })
  }

  // Create priority selection modal
  function createPriorityModal() {
    const modal = document.createElement("div")
    modal.className = "modal"
    modal.id = "priority-modal"

    modal.innerHTML = `
            <div class="modal-content">
                <h2>Select Priority</h2>
                <div class="form-group">
                    <label for="todo-priority">Priority Level</label>
                    <select id="todo-priority" class="todo-priority">
                        <option value="low">Low Priority</option>
                        <option value="medium" selected>Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="todo-due-date">Due Date (Optional)</label>
                    <input type="date" id="todo-due-date">
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-btn" id="cancel-priority">Cancel</button>
                    <button type="button" class="save-btn" id="save-priority">Add Task</button>
                </div>
            </div>
        `

    document.body.appendChild(modal)

    // Add event listeners
    document.getElementById("cancel-priority").addEventListener("click", () => {
      modal.classList.remove("active")
    })

    // Close when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active")
      }
    })

    return modal
  }

  // Show priority selection modal
  function showPriorityModal(todoText) {
    let modal = document.getElementById("priority-modal")

    if (!modal) {
      modal = createPriorityModal()
    }

    modal.classList.add("active")

    const saveBtn = document.getElementById("save-priority")

    // Remove any existing event listeners
    const newSaveBtn = saveBtn.cloneNode(true)
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn)

    // Add new event listener
    newSaveBtn.addEventListener("click", () => {
      const priority = document.getElementById("todo-priority").value
      const dueDate = document.getElementById("todo-due-date").value

      addTodo(todoText, priority, dueDate)
      modal.classList.remove("active")
    })
  }

  function addTodo(text, priority = "medium", dueDate = "") {
    if (!todoList) return

    // Format due date text
    let dueDateText = ""
    if (dueDate) {
      const date = new Date(dueDate)
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)

      if (date.toDateString() === today.toDateString()) {
        dueDateText = "Today"
      } else if (date.toDateString() === tomorrow.toDateString()) {
        dueDateText = "Tomorrow"
      } else {
        dueDateText = date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
      }
    }

    // Create todo item
    const todoItem = document.createElement("div")
    todoItem.className = "todo-item"
    todoItem.setAttribute("data-priority", priority)

    if (priority === "high") {
      todoItem.classList.add("high-priority")
    } else if (priority === "medium") {
      todoItem.classList.add("medium-priority")
    } else {
      todoItem.classList.add("low-priority")
    }

    const todoId = "todo-" + Date.now()

    todoItem.innerHTML = `
            <div class="todo-checkbox">
                <input type="checkbox" id="${todoId}">
                <label for="${todoId}"></label>
            </div>
            <div class="todo-content">
                <p>${text}</p>
                <div class="todo-meta">
                    ${dueDateText ? `<span class="todo-date">Due: ${dueDateText}</span>` : ""}
                    <span class="todo-priority ${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority</span>
                </div>
            </div>
            <div class="todo-actions">
                <button class="edit-todo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </button>
                <button class="delete-todo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `

    todoList.appendChild(todoItem)

    // Add event listeners
    const checkbox = todoItem.querySelector('input[type="checkbox"]')
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        todoItem.classList.add("completed")
      } else {
        todoItem.classList.remove("completed")
      }
      saveTodos()
    })

    const editBtn = todoItem.querySelector(".edit-todo")
    editBtn.addEventListener("click", () => {
      editTodo(todoItem)
    })

    const deleteBtn = todoItem.querySelector(".delete-todo")
    deleteBtn.addEventListener("click", () => {
      todoItem.remove()
      saveTodos()
    })

    // Save todos
    saveTodos()
  }

  function editTodo(todoItem) {
    const todoText = todoItem.querySelector(".todo-content p").textContent
    const todoPriority = todoItem.getAttribute("data-priority") || "medium"
    const todoDateEl = todoItem.querySelector(".todo-date")
    let todoDueDate = ""

    if (todoDateEl) {
      const dueDateText = todoDateEl.textContent.replace("Due: ", "")

      // Convert text date back to YYYY-MM-DD format
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)

      if (dueDateText === "Today") {
        todoDueDate = today.toISOString().split("T")[0]
      } else if (dueDateText === "Tomorrow") {
        todoDueDate = tomorrow.toISOString().split("T")[0]
      } else {
        // Try to parse the date
        try {
          const date = new Date(dueDateText)
          if (!isNaN(date.getTime())) {
            todoDueDate = date.toISOString().split("T")[0]
          }
        } catch (e) {
          console.error("Could not parse date:", dueDateText)
        }
      }
    }

    // Create edit modal
    let modal = document.getElementById("edit-todo-modal")

    if (!modal) {
      modal = document.createElement("div")
      modal.className = "modal"
      modal.id = "edit-todo-modal"

      modal.innerHTML = `
                <div class="modal-content">
                    <h2>Edit Task</h2>
                    <div class="form-group">
                        <label for="edit-todo-text">Task</label>
                        <input type="text" id="edit-todo-text" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-todo-priority">Priority Level</label>
                        <select id="edit-todo-priority" class="todo-priority">
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-todo-due-date">Due Date (Optional)</label>
                        <input type="date" id="edit-todo-due-date">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" id="cancel-edit">Cancel</button>
                        <button type="button" class="save-btn" id="save-edit">Save Changes</button>
                    </div>
                </div>
            `

      document.body.appendChild(modal)

      // Add event listeners
      document.getElementById("cancel-edit").addEventListener("click", () => {
        modal.classList.remove("active")
      })

      // Close when clicking outside
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active")
        }
      })
    }

    // Set values
    document.getElementById("edit-todo-text").value = todoText
    document.getElementById("edit-todo-priority").value = todoPriority
    document.getElementById("edit-todo-due-date").value = todoDueDate

    modal.classList.add("active")

    const saveBtn = document.getElementById("save-edit")

    // Remove any existing event listeners
    const newSaveBtn = saveBtn.cloneNode(true)
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn)

    // Add new event listener
    newSaveBtn.addEventListener("click", () => {
      const newText = document.getElementById("edit-todo-text").value.trim()
      if (newText === "") return

      const newPriority = document.getElementById("edit-todo-priority").value
      const newDueDate = document.getElementById("edit-todo-due-date").value

      // Update todo item
      todoItem.querySelector(".todo-content p").textContent = newText

      // Update priority
      todoItem.setAttribute("data-priority", newPriority)
      todoItem.classList.remove("high-priority", "medium-priority", "low-priority")
      todoItem.classList.add(`${newPriority}-priority`)

      const prioritySpan = todoItem.querySelector(".todo-priority")
      prioritySpan.className = `todo-priority ${newPriority}`
      prioritySpan.textContent = `${newPriority.charAt(0).toUpperCase() + newPriority.slice(1)} Priority`

      // Update due date
      let dueDateSpan = todoItem.querySelector(".todo-date")

      if (newDueDate) {
        const date = new Date(newDueDate)
        const today = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)

        let dueDateText = ""
        if (date.toDateString() === today.toDateString()) {
          dueDateText = "Today"
        } else if (date.toDateString() === tomorrow.toDateString()) {
          dueDateText = "Tomorrow"
        } else {
          dueDateText = date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
        }

        if (dueDateSpan) {
          dueDateSpan.textContent = `Due: ${dueDateText}`
        } else {
          dueDateSpan = document.createElement("span")
          dueDateSpan.className = "todo-date"
          dueDateSpan.textContent = `Due: ${dueDateText}`
          todoItem.querySelector(".todo-meta").prepend(dueDateSpan)
        }
      } else if (dueDateSpan) {
        dueDateSpan.remove()
      }

      // Save todos
      saveTodos()

      // Close modal
      modal.classList.remove("active")
    })
  }

  function saveTodos() {
    if (!todoList) return

    const todos = []
    const todoItems = todoList.querySelectorAll(".todo-item")

    todoItems.forEach((item) => {
      const text = item.querySelector(".todo-content p").textContent
      const completed = item.querySelector('input[type="checkbox"]').checked
      const priority = item.getAttribute("data-priority") || "medium"

      const dueDateEl = item.querySelector(".todo-date")
      let dueDate = ""

      if (dueDateEl) {
        dueDate = dueDateEl.textContent.replace("Due: ", "")
      }

      todos.push({
        text: text,
        completed: completed,
        priority: priority,
        dueDate: dueDate,
      })
    })

    localStorage.setItem("todos", JSON.stringify(todos))
  }

  function loadTodos() {
    if (!todoList) return

    // Clear existing todos
    todoList.innerHTML = ""

    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      const todos = JSON.parse(savedTodos)

      todos.forEach((todo) => {
        // Create todo item
        const todoItem = document.createElement("div")
        todoItem.className = "todo-item"
        if (todo.completed) {
          todoItem.classList.add("completed")
        }
        todoItem.setAttribute("data-priority", todo.priority)

        if (todo.priority === "high") {
          todoItem.classList.add("high-priority")
        } else if (todo.priority === "medium") {
          todoItem.classList.add("medium-priority")
        } else {
          todoItem.classList.add("low-priority")
        }

        const todoId = "todo-" + Date.now() + Math.random().toString(36).substr(2, 5)

        todoItem.innerHTML = `
                    <div class="todo-checkbox">
                        <input type="checkbox" id="${todoId}" ${todo.completed ? "checked" : ""}>
                        <label for="${todoId}"></label>
                    </div>
                    <div class="todo-content">
                        <p>${todo.text}</p>
                        <div class="todo-meta">
                            ${todo.dueDate ? `<span class="todo-date">Due: ${todo.dueDate}</span>` : ""}
                            <span class="todo-priority ${todo.priority}">${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority</span>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="edit-todo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button class="delete-todo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                `

        todoList.appendChild(todoItem)

        // Add event listeners
        const checkbox = todoItem.querySelector('input[type="checkbox"]')
        checkbox.addEventListener("change", function () {
          if (this.checked) {
            todoItem.classList.add("completed")
          } else {
            todoItem.classList.remove("completed")
          }
          saveTodos()
        })

        const editBtn = todoItem.querySelector(".edit-todo")
        editBtn.addEventListener("click", () => {
          editTodo(todoItem)
        })

        const deleteBtn = todoItem.querySelector(".delete-todo")
        deleteBtn.addEventListener("click", () => {
          todoItem.remove()
          saveTodos()
        })
      })
    }
  }

  function filterTodos(filter) {
    if (!todoList) return

    const todoItems = todoList.querySelectorAll(".todo-item")

    todoItems.forEach((item) => {
      const isCompleted = item.classList.contains("completed")

      switch (filter) {
        case "all":
          item.style.display = ""
          break
        case "pending":
          item.style.display = isCompleted ? "none" : ""
          break
        case "completed":
          item.style.display = isCompleted ? "" : "none"
          break
      }
    })
  }

  // Initialize existing todo buttons
  function initExistingTodos() {
    const todoItems = document.querySelectorAll(".todo-item")

    todoItems.forEach((item) => {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox) {
        checkbox.addEventListener("change", function () {
          if (this.checked) {
            item.classList.add("completed")
          } else {
            item.classList.remove("completed")
          }
          saveTodos()
        })
      }

      const editBtn = item.querySelector(".edit-todo")
      if (editBtn) {
        editBtn.addEventListener("click", () => {
          editTodo(item)
        })
      }

      const deleteBtn = item.querySelector(".delete-todo")
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          item.remove()
          saveTodos()
        })
      }
    })

    // Save initial todos
    saveTodos()
  }

  // Initialize existing todos
  initExistingTodos()

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

