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

  // Room Creation Modal
  const createRoomBtn = document.getElementById("create-room-btn");
  const roomModal = document.getElementById("room-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const cancelRoomBtn = document.getElementById("cancel-room-btn");
  const roomForm = document.getElementById("room-form");

  function openModal() {
    roomModal.classList.add("active");
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("room-date").value = today;
  }

  function closeModal() {
    roomModal.classList.remove("active");
  }

  if (createRoomBtn) {
    createRoomBtn.addEventListener("click", openModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (cancelRoomBtn) {
    cancelRoomBtn.addEventListener("click", closeModal);
  }

  // Close modal when clicking outside
  if (roomModal) {
    roomModal.addEventListener("click", (e) => {
      if (e.target === roomModal) {
        closeModal();
      }
    });
  }

  // Create room
  if (roomForm) {
    roomForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const roomName = document.getElementById("room-name").value;
      const roomSubject = document.getElementById("room-subject").value;
      const roomCapacity = document.getElementById("room-capacity").value;
      const roomDescription = document.getElementById("room-description").value;
      const roomDate = document.getElementById("room-date").value;
      const roomTime = document.getElementById("room-time").value;
      const roomDuration = document.getElementById("room-duration").value;

      // Generate a unique ID for the room
      const roomId = Date.now().toString();
      
      // Create room object
      const room = {
        id: roomId,
        name: roomName,
        subject: roomSubject,
        capacity: roomCapacity,
        description: roomDescription,
        date: roomDate,
        time: roomTime,
        duration: roomDuration,
        participants: ["John Doe"], // Current user is automatically added
        messages: [], // Initialize empty messages array
        files: [], // Initialize empty files array
        createdBy: "John Doe",
        createdAt: new Date().toISOString()
      };

      // Save room to localStorage
      saveRoom(room);
      
      // Redirect to the room detail page
      window.location.href = `room-detail.html?id=${roomId}`;
    });
  }

  // Room Filtering
  const filterInput = document.getElementById("filter-input");
  const filterSubject = document.getElementById("filter-subject");
  const filterStatus = document.getElementById("filter-status");

  if (filterInput) {
    filterInput.addEventListener("input", filterRooms);
  }

  if (filterSubject) {
    filterSubject.addEventListener("change", filterRooms);
  }

  if (filterStatus) {
    filterStatus.addEventListener("change", filterRooms);
  }

  function filterRooms() {
    const searchTerm = filterInput ? filterInput.value.toLowerCase() : "";
    const subjectFilter = filterSubject ? filterSubject.value : "all";
    const statusFilter = filterStatus ? filterStatus.value : "all";

    const roomCards = document.querySelectorAll(".room-card");

    roomCards.forEach((card) => {
      const roomTitle = card.querySelector(".room-title").textContent.toLowerCase();
      const roomSubject = card.querySelector(".room-subject").textContent.toLowerCase();
      const roomStatus = card.querySelector(".room-status").classList.contains("active") ? "active" : "upcoming";
      
      const titleMatch = roomTitle.includes(searchTerm);
      const subjectMatch = subjectFilter === "all" || roomSubject === subjectFilter;
      const statusMatch = statusFilter === "all" || roomStatus === statusFilter;
      
      // Special case for "my-rooms"
      const isMyRoom = statusFilter === "my-rooms" ? 
        card.dataset.createdBy === "John Doe" || card.dataset.participants.includes("John Doe") : 
        true;

      if (titleMatch && subjectMatch && statusMatch && isMyRoom) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Save room to localStorage
  function saveRoom(room) {
    let rooms = JSON.parse(localStorage.getItem("studyRooms")) || [];
    rooms.push(room);
    localStorage.setItem("studyRooms", JSON.stringify(rooms));
  }

  // Add room to UI
  function addRoomToUI(room) {
    const roomsList = document.getElementById("rooms-list");
    
    // Check if empty state exists and remove it
    const emptyState = document.querySelector(".empty-state");
    if (emptyState) {
      roomsList.removeChild(emptyState);
    }

    const roomCard = document.createElement("div");
    roomCard.className = "room-card";
    roomCard.dataset.id = room.id;
    roomCard.dataset.createdBy = room.createdBy;
    roomCard.dataset.participants = JSON.stringify(room.participants);

    // Determine if room is active or upcoming
    const roomDate = new Date(`${room.date}T${room.time}`);
    const now = new Date();
    const isActive = roomDate <= now && roomDate.getTime() + (room.duration * 60 * 1000) > now.getTime();
    const status = isActive ? "active" : "upcoming";

    // Format time for display
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const startTime = new Date(`${room.date}T${room.time}`).toLocaleTimeString([], timeOptions);
    const endTime = new Date(roomDate.getTime() + (room.duration * 60 * 1000)).toLocaleTimeString([], timeOptions);

    roomCard.innerHTML = `
      <div class="room-header">
        <span class="room-subject">${room.subject}</span>
        <span class="room-status ${status}">${status}</span>
      </div>
      <h3 class="room-title">${room.name}</h3>
      <p class="room-description">${room.description}</p>
      <div class="room-details">
        <div class="room-participants">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>${room.participants.length}/${room.capacity}</span>
        </div>
        <div class="room-time">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>${startTime} - ${endTime}</span>
        </div>
      </div>
      <button class="join-room-btn" data-room-id="${room.id}">Join Room</button>
    `;

    roomsList.appendChild(roomCard);

    // Add event listener to join button
    const joinBtn = roomCard.querySelector(".join-room-btn");
    joinBtn.addEventListener("click", () => {
      joinRoom(room.id);
    });
  }

  // Join a room
  function joinRoom(roomId) {
    // Save the current room ID to localStorage
    localStorage.setItem("currentRoomId", roomId);
    
    // Redirect to the room detail page
    window.location.href = `room-detail.html?id=${roomId}`;
  }

  // Load rooms from localStorage
  function loadRooms() {
    const roomsList = document.getElementById("rooms-list");
    if (!roomsList) return;

    // Clear existing rooms
    roomsList.innerHTML = "";

    const rooms = JSON.parse(localStorage.getItem("studyRooms")) || [];

    if (rooms.length === 0) {
      // Show empty state
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <h3>No Study Rooms Yet</h3>
        <p>Create your first study room to get started!</p>
        <button class="create-first-room-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create Room
        </button>
      `;
      roomsList.appendChild(emptyState);

      // Add event listener to the create button
      const createFirstRoomBtn = emptyState.querySelector(".create-first-room-btn");
      createFirstRoomBtn.addEventListener("click", openModal);
    } else {
      // Add each room to the UI
      rooms.forEach(room => {
        addRoomToUI(room);
      });
    }
  }

  // Initialize the page
  loadRooms();

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
})

// Function to notify the dashboard of changes
function notifyDashboardOfChanges() {
  // Trigger a storage event to notify other tabs/pages
  const event = new Event("storage")
  event.key = "studyRooms"
  event.newValue = localStorage.getItem("studyRooms")
  window.dispatchEvent(event)
}

// Modify your existing saveRoom function
function saveRoom(room) {
  const rooms = JSON.parse(localStorage.getItem("studyRooms")) || []
  rooms.push(room)
  localStorage.setItem("studyRooms", JSON.stringify(rooms))

  // Notify dashboard of changes
  notifyDashboardOfChanges()
}