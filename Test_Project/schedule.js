document.addEventListener("DOMContentLoaded", () => {
  // Sidebar Toggle
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      sidebar.classList.toggle("mobile-open");
    });
  }

  // Calendar Variables
  const calendarContainer = document.querySelector(".calendar-grid");
  const monthYearText = document.getElementById("current-month");
  const prevMonthBtn = document.querySelector(".prev-month");
  const nextMonthBtn = document.querySelector(".next-month");
  const dailySchedule = document.querySelector(".daily-schedule");

  // Current date for calendar
  let currentDate = new Date();
  let selectedDate = new Date();

  // Event Modal
  let eventModal = document.getElementById("event-modal");
  if (!eventModal) {
    eventModal = document.createElement("div");
    eventModal.id = "event-modal";
    eventModal.className = "modal";
    eventModal.innerHTML = `
      <div class="modal-content">
        <h2>Add Event</h2>
        <form id="event-form">
          <div class="form-group">
            <label for="event-title">Event Title</label>
            <input type="text" id="event-title" name="event-title" required>
          </div>
          <div class="form-group">
            <label for="event-date">Date</label>
            <input type="date" id="event-date" name="event-date" required>
          </div>
          <div class="form-group">
            <label for="event-time">Time</label>
            <input type="time" id="event-time" name="event-time" required>
          </div>
          <div class="form-group">
            <label for="event-description">Description</label>
            <textarea id="event-description" name="event-description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="event-location">Location</label>
            <input type="text" id="event-location" name="event-location">
          </div>
          <div class="form-group">
            <label for="event-color">Color</label>
            <select id="event-color" name="event-color">
              <option value="default">Default</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" id="close-modal-btn" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Event</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(eventModal);
  }

  // Event Details Modal
  let eventDetailsModal = document.getElementById("event-details-modal");
  if (!eventDetailsModal) {
    eventDetailsModal = document.createElement("div");
    eventDetailsModal.id = "event-details-modal";
    eventDetailsModal.className = "modal";
    eventDetailsModal.innerHTML = `
      <div class="modal-content">
        <h2 id="event-details-title">Event Details</h2>
        <div class="event-details-content">
          <div class="event-details-info">
            <div class="event-details-date-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span id="event-details-date"></span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span id="event-details-time"></span>
            </div>
            <div class="event-details-location" id="event-details-location-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span id="event-details-location"></span>
            </div>
          </div>
          <p id="event-details-description"></p>
        </div>
        <div class="form-actions">
          <button type="button" id="delete-event-btn" class="delete-btn">Delete</button>
          <button type="button" id="edit-event-btn" class="edit-btn">Edit</button>
          <button type="button" id="close-details-btn" class="cancel-btn">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(eventDetailsModal);
  }

  // Add Event button
  const addEventBtn = document.querySelector(".add-event-btn");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const eventForm = document.getElementById("event-form");
  const closeDetailsBtn = document.getElementById("close-details-btn");
  const deleteEventBtn = document.getElementById("delete-event-btn");
  const editEventBtn = document.getElementById("edit-event-btn");

  // Event listeners for modals
  if (addEventBtn) {
    addEventBtn.addEventListener("click", () => {
      // Reset form
      eventForm.reset();
      
      // Set default date to selected date
      const dateInput = document.getElementById("event-date");
      dateInput.value = formatDateForInput(selectedDate);
      
      // Show modal
      eventModal.classList.add("active");
      document.getElementById("event-title").focus();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      eventModal.classList.remove("active");
    });
  }

  if (closeDetailsBtn) {
    closeDetailsBtn.addEventListener("click", () => {
      eventDetailsModal.classList.remove("active");
    });
  }

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === eventModal) {
      eventModal.classList.remove("active");
    }
    if (e.target === eventDetailsModal) {
      eventDetailsModal.classList.remove("active");
    }
  });

  // Event form submission
  if (eventForm) {
    eventForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const eventId = eventForm.getAttribute("data-event-id");
      const eventTitle = document.getElementById("event-title").value;
      const eventDate = document.getElementById("event-date").value;
      const eventTime = document.getElementById("event-time").value;
      const eventDescription = document.getElementById("event-description").value;
      const eventLocation = document.getElementById("event-location").value;
      const eventColor = document.getElementById("event-color").value;

      if (eventId) {
        // Update existing event
        updateEvent(eventId, eventTitle, eventDate, eventTime, eventDescription, eventLocation, eventColor);
      } else {
        // Add new event
        addEvent(eventTitle, eventDate, eventTime, eventDescription, eventLocation, eventColor);
      }

      // Reset form and close modal
      eventForm.reset();
      eventForm.removeAttribute("data-event-id");
      eventModal.classList.remove("active");
    });
  }

  // Delete event
  if (deleteEventBtn) {
    deleteEventBtn.addEventListener("click", () => {
      const eventId = eventDetailsModal.getAttribute("data-event-id");
      if (eventId) {
        deleteEvent(eventId);
        eventDetailsModal.classList.remove("active");
      }
    });
  }

  // Edit event
  if (editEventBtn) {
    editEventBtn.addEventListener("click", () => {
      const eventId = eventDetailsModal.getAttribute("data-event-id");
      if (eventId) {
        const events = JSON.parse(localStorage.getItem("events") || "[]");
        const event = events.find(e => e.id === eventId);
        
        if (event) {
          // Populate form with event data
          document.getElementById("event-title").value = event.title;
          document.getElementById("event-date").value = event.date;
          document.getElementById("event-time").value = event.time;
          document.getElementById("event-description").value = event.description || "";
          document.getElementById("event-location").value = event.location || "";
          document.getElementById("event-color").value = event.color || "default";
          
          // Set form data-event-id attribute
          eventForm.setAttribute("data-event-id", eventId);
          
          // Close details modal and open edit modal
          eventDetailsModal.classList.remove("active");
          eventModal.classList.add("active");
        }
      }
    });
  }

  // Initialize calendar
  initCalendar();

  // Load events from localStorage
  loadEvents();

  // Calendar functions
  function initCalendar() {
    renderCalendar();

    // Add event listeners to navigation buttons
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      });
    }

    if (nextMonthBtn) {
      nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      });
    }
  }

  function renderCalendar() {
    if (!calendarContainer || !monthYearText) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update month/year display
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    monthYearText.textContent = `${monthNames[month]} ${year}`;

    // Clear previous calendar days
    while (calendarContainer.firstChild) {
      calendarContainer.removeChild(calendarContainer.firstChild);
    }

    // Add day headers
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(day => {
      const dayHeader = document.createElement("div");
      dayHeader.className = "calendar-day-header";
      dayHeader.textContent = day;
      calendarContainer.appendChild(dayHeader);
    });

    // Get first day of month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get day of week of first day (0-6, 0 is Sunday)
    const firstDayIndex = firstDay.getDay();
    
    // Get number of days in month
    const daysInMonth = lastDay.getDate();
    
    // Get number of days in previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // Calculate total cells needed (42 for 6 rows of 7 days)
    const totalCells = 42;
    
    // Add days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = formatDate(new Date(prevYear, prevMonth, day));
      
      const dayElement = createDayElement(day, "prev-month", dateStr);
      calendarContainer.appendChild(dayElement);
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const dateStr = formatDate(dateObj);
      
      // Check if this is today
      const today = new Date();
      const isToday = i === today.getDate() && 
                      month === today.getMonth() && 
                      year === today.getFullYear();
      
      // Check if this is the selected date
      const isSelected = i === selectedDate.getDate() && 
                         month === selectedDate.getMonth() && 
                         year === selectedDate.getFullYear();
      
      // Check if there are events on this day
      const hasEvents = checkForEvents(dateStr);
      
      let className = "";
      if (isToday) className += " current-day";
      if (isSelected) className += " selected-day";
      if (hasEvents) className += " has-events";
      
      const dayElement = createDayElement(i, className, dateStr);
      calendarContainer.appendChild(dayElement);
    }

    // Add days from next month
    const cellsUsed = firstDayIndex + daysInMonth;
    const cellsRemaining = totalCells - cellsUsed;
    
    for (let i = 1; i <= cellsRemaining; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = formatDate(new Date(nextYear, nextMonth, i));
      
      const dayElement = createDayElement(i, "next-month", dateStr);
      calendarContainer.appendChild(dayElement);
    }

    // Update daily schedule for selected date
    updateDailySchedule(selectedDate);
  }

  function createDayElement(day, className, dateStr) {
    const dayElement = document.createElement("div");
    dayElement.className = `calendar-day ${className}`;
    dayElement.textContent = day;
    dayElement.setAttribute("data-date", dateStr);
    
    // Add click event to show events for this day
    dayElement.addEventListener("click", () => {
      // Remove selected class from all days
      document.querySelectorAll(".calendar-day").forEach(el => {
        el.classList.remove("selected-day");
      });
      
      // Add selected class to clicked day
      dayElement.classList.add("selected-day");
      
      // Update selected date
      selectedDate = new Date(dateStr);
      
      // Update daily schedule
      updateDailySchedule(selectedDate);
    });
    
    return dayElement;
  }

  function updateDailySchedule(date) {
    if (!dailySchedule) return;
    
    const dateStr = formatDate(date);
    const events = getEventsForDate(dateStr);
    
    // Format date for display
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    
    // Update header
    const scheduleHeader = dailySchedule.querySelector("h3");
    if (scheduleHeader) {
      scheduleHeader.textContent = `${isToday(date) ? "Today's" : "Daily"} Schedule - ${formattedDate}`;
    }
    
    // Get timeline container
    const timeline = dailySchedule.querySelector(".timeline");
    if (!timeline) return;
    
    // Clear previous events
    timeline.innerHTML = "";
    
    if (events.length === 0) {
      const noEvents = document.createElement("div");
      noEvents.className = "no-events";
      noEvents.textContent = "No events scheduled for this day";
      timeline.appendChild(noEvents);
      return;
    }
    
    // Sort events by time
    events.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    
    // Add events to timeline
    events.forEach(event => {
      const timelineItem = document.createElement("div");
      timelineItem.className = "timeline-item";
      timelineItem.setAttribute("data-event-id", event.id);
      
      // Add color class if specified
      if (event.color && event.color !== "default") {
        timelineItem.classList.add(`event-color-${event.color}`);
      }
      
      const timelineTime = document.createElement("div");
      timelineTime.className = "timeline-time";
      timelineTime.textContent = formatTime(event.time);
      
      const timelineContent = document.createElement("div");
      timelineContent.className = "timeline-content";
      
      const eventTitle = document.createElement("h4");
      eventTitle.textContent = event.title;
      
      const eventDetails = document.createElement("p");
      if (event.location) {
        eventDetails.textContent = `${event.location} • ${event.duration || "1 hour"}`;
      } else {
        eventDetails.textContent = event.duration || "1 hour";
      }
      
      timelineContent.appendChild(eventTitle);
      timelineContent.appendChild(eventDetails);
      
      timelineItem.appendChild(timelineTime);
      timelineItem.appendChild(timelineContent);
      
      // Add click event to show event details
      timelineItem.addEventListener("click", () => {
        showEventDetails(event.id);
      });
      
      timeline.appendChild(timelineItem);
    });
  }

  function showEventDetails(eventId) {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const event = events.find(e => e.id === eventId);
    
    if (!event) return;
    
    // Set event details in modal
    document.getElementById("event-details-title").textContent = event.title;
    document.getElementById("event-details-date").textContent = formatDateForDisplay(event.date);
    document.getElementById("event-details-time").textContent = formatTime(event.time);
    
    const locationContainer = document.getElementById("event-details-location-container");
    const locationText = document.getElementById("event-details-location");
    
    if (event.location) {
      locationText.textContent = event.location;
      locationContainer.style.display = "flex";
    } else {
      locationContainer.style.display = "none";
    }
    
    document.getElementById("event-details-description").textContent = event.description || "No description provided";
    
    // Set event ID for delete/edit buttons
    eventDetailsModal.setAttribute("data-event-id", eventId);
    
    // Show modal
    eventDetailsModal.classList.add("active");
  }

  // Event functions
  function addEvent(title, date, time, description, location, color) {
    // Generate unique ID
    const eventId = Date.now().toString();
    
    // Create event object
    const newEvent = {
      id: eventId,
      title,
      date,
      time,
      description,
      location,
      color
    };
    
    // Get existing events
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    
    // Add new event
    events.push(newEvent);
    
    // Save to localStorage
    localStorage.setItem("events", JSON.stringify(events));
    
    // Update calendar
    renderCalendar();
    
    // Update daily schedule if the event is for the selected date
    if (date === formatDate(selectedDate)) {
      updateDailySchedule(selectedDate);
    }
  }

  function updateEvent(eventId, title, date, time, description, location, color) {
    // Get existing events
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    
    // Find event index
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) return;
    
    // Update event
    events[eventIndex] = {
      ...events[eventIndex],
      title,
      date,
      time,
      description,
      location,
      color
    };
    
    // Save to localStorage
    localStorage.setItem("events", JSON.stringify(events));
    
    // Update calendar
    renderCalendar();
    
    // Update daily schedule
    updateDailySchedule(selectedDate);
  }

  function deleteEvent(eventId) {
    // Get existing events
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    
    // Filter out the event to delete
    const updatedEvents = events.filter(e => e.id !== eventId);
    
    // Save to localStorage
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    
    // Update calendar
    renderCalendar();
    
    // Update daily schedule
    updateDailySchedule(selectedDate);
  }

  function loadEvents() {
    // Check if there are any events in localStorage
    const savedEvents = localStorage.getItem("events");
    
    if (!savedEvents) {
      // Add some sample events if none exist
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const sampleEvents = [
        {
          id: "sample1",
          title: "Calculus Study Group",
          date: formatDate(today),
          time: "09:00",
          description: "Review for upcoming exam",
          location: "Room 101",
          color: "blue"
        },
        {
          id: "sample2",
          title: "Physics Lab Preparation",
          date: formatDate(today),
          time: "11:30",
          description: "Prepare for tomorrow's lab experiment",
          location: "Online",
          color: "green"
        },
        {
          id: "sample3",
          title: "Programming Workshop",
          date: formatDate(today),
          time: "14:00",
          description: "Introduction to JavaScript",
          location: "Computer Lab",
          color: "purple"
        },
        {
          id: "sample4",
          title: "Group Project Meeting",
          date: formatDate(tomorrow),
          time: "10:00",
          description: "Discuss project timeline and tasks",
          location: "Library",
          color: "orange"
        }
      ];
      
      localStorage.setItem("events", JSON.stringify(sampleEvents));
    }
    
    // Update calendar to show events
    renderCalendar();
  }

  function getEventsForDate(dateStr) {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    return events.filter(event => event.date === dateStr);
  }

  function checkForEvents(dateStr) {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    return events.some(event => event.date === dateStr);
  }

  // Helper functions
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDateForInput(date) {
    return formatDate(date);
  }

  function formatDateForDisplay(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  // Add CSS for event colors
  addEventColorStyles();

  function addEventColorStyles() {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .event-color-blue .timeline-time { color: #1e88e5; }
      .event-color-green .timeline-time { color: #43a047; }
      .event-color-red .timeline-time { color: #e53935; }
      .event-color-purple .timeline-time { color: #8e24aa; }
      .event-color-orange .timeline-time { color: #fb8c00; }
      
      .calendar-day.has-events::after {
        content: "";
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: var(--primary-color);
      }
      
      .calendar-day.selected-day {
        background-color: var(--primary-light);
        font-weight: 500;
      }
      
      .timeline-item {
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      
      .timeline-item:hover {
        transform: translateX(5px);
      }
      
      .no-events {
        color: var(--text-light);
        font-style: italic;
        padding: 20px 0;
      }
      
      .delete-btn {
        background-color: rgba(244, 67, 54, 0.1);
        color: #f44336;
        border: none;
        border-radius: 8px;
        padding: 10px 15px;
        font-weight: 500;
        transition: var(--transition);
      }
      
      .delete-btn:hover {
        background-color: #f44336;
        color: white;
      }
      
      .edit-btn {
        background-color: var(--primary-light);
        color: var(--primary-color);
        border: none;
        border-radius: 8px;
        padding: 10px 15px;
        font-weight: 500;
        transition: var(--transition);
      }
      
      .edit-btn:hover {
        background-color: var(--primary-color);
        color: white;
      }
    `;
    document.head.appendChild(styleElement);
  }

  // Responsive adjustments
  function handleResize() {
    if (window.innerWidth <= 768) {
      sidebar.classList.add("collapsed");
      sidebar.classList.remove("mobile-open");
      mainContent.style.marginLeft = "0";
    } else if (window.innerWidth <= 992) {
      sidebar.classList.add("collapsed");
      sidebar.classList.remove("mobile-open");
      mainContent.style.marginLeft = "";
    } else {
      sidebar.classList.remove("collapsed");
      mainContent.style.marginLeft = "";
    }
  }

  window.addEventListener("resize", handleResize);

  // Initial call to set the correct state
  handleResize();
});
