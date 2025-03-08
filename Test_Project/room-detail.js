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

  // Get room ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("id") || localStorage.getItem("currentRoomId");

  if (!roomId) {
    // Redirect to study rooms page if no room ID is provided
    window.location.href = "study-rooms.html";
    return;
  }

  // Load room data
  const room = loadRoomData(roomId);
  if (!room) {
    // Redirect to study rooms page if room doesn't exist
    window.location.href = "study-rooms.html";
    return;
  }

  // Update page title
  document.title = `9arini - ${room.name}`;
  document.getElementById("room-title").textContent = room.name;

  // Update room info
  updateRoomInfo(room);

  // Initialize tabs
  initTabs();

  // Initialize chat
  initChat(room);

  // Initialize files tab
  initFilesTab(room);

  // Initialize participants tab
  initParticipantsTab(room);

  // Leave room button
  const leaveRoomBtn = document.getElementById("leave-room-btn");
  if (leaveRoomBtn) {
    leaveRoomBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to leave this room?")) {
        leaveRoom(room);
      }
    });
  }

  // Invite modal
  const inviteBtn = document.getElementById("invite-btn");
  const inviteModal = document.getElementById("invite-modal");
  const closeInviteModalBtn = document.getElementById("close-invite-modal-btn");
  const cancelInviteBtn = document.getElementById("cancel-invite-btn");
  const inviteForm = document.getElementById("invite-form");

  function openInviteModal() {
    inviteModal.classList.add("active");
  }

  function closeInviteModal() {
    inviteModal.classList.remove("active");
    inviteForm.reset();
  }

  if (inviteBtn) {
    inviteBtn.addEventListener("click", openInviteModal);
  }

  if (closeInviteModalBtn) {
    closeInviteModalBtn.addEventListener("click", closeInviteModal);
  }

  if (cancelInviteBtn) {
    cancelInviteBtn.addEventListener("click", closeInviteModal);
  }

  // Close modal when clicking outside
  if (inviteModal) {
    inviteModal.addEventListener("click", (e) => {
      if (e.target === inviteModal) {
        closeInviteModal();
      }
    });
  }

  // Invite form submission
  if (inviteForm) {
    inviteForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("invite-email").value;
      const message = document.getElementById("invite-message").value;

      // In a real application, you would send an invitation email here
      alert(`Invitation sent to ${email}`);

      closeInviteModal();
    });
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

  // Simulate real-time updates
  simulateRealTimeUpdates(room);
});

// Load room data from localStorage
function loadRoomData(roomId) {
  const rooms = JSON.parse(localStorage.getItem("studyRooms")) || [];
  return rooms.find(room => room.id === roomId);
}

// Update room data in localStorage
function updateRoomData(room) {
  const rooms = JSON.parse(localStorage.getItem("studyRooms")) || [];
  const index = rooms.findIndex(r => r.id === room.id);
  
  if (index !== -1) {
    rooms[index] = room;
    localStorage.setItem("studyRooms", JSON.stringify(rooms));
  }
}

// Update room info in the UI
function updateRoomInfo(room) {
  document.getElementById("room-subject").textContent = room.subject;
  document.getElementById("room-name").textContent = room.name;
  document.getElementById("room-description").textContent = room.description;
  document.getElementById("room-participants").textContent = `${room.participants.length}/${room.capacity} Participants`;
  
  // Format time for display
  const roomDate = new Date(`${room.date}T${room.time}`);
  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const startTime = roomDate.toLocaleTimeString([], timeOptions);
  const endTime = new Date(roomDate.getTime() + (room.duration * 60 * 1000)).toLocaleTimeString([], timeOptions);
  const dateStr = roomDate.toLocaleDateString([], dateOptions);
  
  document.getElementById("room-time").textContent = `${dateStr}, ${startTime} - ${endTime}`;
  document.getElementById("room-creator").textContent = `Created by ${room.createdBy}`;
}

// Initialize tabs
function initTabs() {
  const tabs = document.querySelectorAll(".room-tab");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");
      
      // Update active tab
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      // Show corresponding tab pane
      tabPanes.forEach(pane => {
        pane.classList.remove("active");
      });
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  });
}

// Initialize chat
function initChat(room) {
  const chatMessages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const attachFileBtn = document.getElementById("attach-file-btn");
  const fileInput = document.getElementById("file-input");

  // Load existing messages
  loadMessages(room);

  // Send message
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const messageText = chatInput.value.trim();
      if (messageText) {
        sendMessage(room, messageText);
        chatInput.value = "";
      }
    });
  }

  // Attach file
  if (attachFileBtn && fileInput) {
    attachFileBtn.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        sendFile(room, file);
        fileInput.value = "";
      }
    });
  }
}

// Load messages
function loadMessages(room) {
  const chatMessages = document.getElementById("chat-messages");
  if (!chatMessages) return;

  // Clear existing messages
  chatMessages.innerHTML = "";

  if (room.messages && room.messages.length > 0) {
    let currentDate = null;

    room.messages.forEach(message => {
      const messageDate = new Date(message.timestamp);
      const messageDay = messageDate.toDateString();

      // Add date divider if it's a new day
      if (currentDate !== messageDay) {
        const dateDivider = document.createElement("div");
        dateDivider.className = "chat-date-divider";
        dateDivider.textContent = formatDate(messageDate);
        chatMessages.appendChild(dateDivider);
        currentDate = messageDay;
      }

      // Add message
      addMessageToUI(message);
    });
  } else {
    // Add welcome message
    const welcomeMessage = {
      id: "welcome",
      sender: "System",
      content: `Welcome to the ${room.name} study room! You can start chatting now.`,
      timestamp: new Date().toISOString(),
      type: "text"
    };
    
    addMessageToUI(welcomeMessage);
  }

  // Scroll to bottom
  scrollToBottom();
}

// Add message to UI
function addMessageToUI(message) {
  const chatMessages = document.getElementById("chat-messages");
  if (!chatMessages) return;

  const isOutgoing = message.sender === "John Doe";
  
  const messageElement = document.createElement("div");
  messageElement.className = `message ${isOutgoing ? "outgoing" : "incoming"}`;
  
  let messageHTML = "";
  
  if (!isOutgoing) {
    messageHTML += `
      <img src="images/profile.jpg" alt="${message.sender}" class="message-avatar">
    `;
  }
  
  messageHTML += `<div class="message-content">`;
  
  if (!isOutgoing) {
    messageHTML += `<div class="message-sender">${message.sender}</div>`;
  }
  
  messageHTML += `<div class="message-bubble">`;
  
  if (message.type === "text") {
    messageHTML += `<div class="message-text">${message.content}</div>`;
  } else if (message.type === "file") {
    messageHTML += `
      <div class="message-text">${message.content}</div>
      <div class="message-file">
        <div class="message-file-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
        </div>
        <div class="message-file-info">
          <div class="message-file-name">${message.file.name}</div>
          <div class="message-file-size">${formatFileSize(message.file.size)}</div>
        </div>
        <button class="message-file-download" data-file-id="${message.file.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
      </div>
    `;
  }
  
  messageHTML += `</div>`;
  
  const messageTime = new Date(message.timestamp);
  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  messageHTML += `<div class="message-time">${messageTime.toLocaleTimeString([], timeOptions)}</div>`;
  
  messageHTML += `</div>`;
  
  messageElement.innerHTML = messageHTML;
  chatMessages.appendChild(messageElement);
  
  // Add event listener to download button if it's a file message
  if (message.type === "file") {
    const downloadBtn = messageElement.querySelector(".message-file-download");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        downloadFile(message.file);
      });
    }
  }
}

// Send message
function sendMessage(room, content) {
  const message = {
    id: Date.now().toString(),
    sender: "John Doe",
    content: content,
    timestamp: new Date().toISOString(),
    type: "text"
  };
  
  // Add message to UI
  addMessageToUI(message);
  
  // Add message to room data
  if (!room.messages) {
    room.messages = [];
  }
  
  room.messages.push(message);
  updateRoomData(room);
  
  // Scroll to bottom
  scrollToBottom();
}

// Send file
function sendFile(room, file) {
  // In a real application, you would upload the file to a server here
  // For this demo, we'll just simulate it
  
  const fileId = Date.now().toString();
  const fileObj = {
    id: fileId,
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file) // This is temporary and will be lost on page refresh
  };
  
  const message = {
    id: Date.now().toString(),
    sender: "John Doe",
    content: "Shared a file",
    timestamp: new Date().toISOString(),
    type: "file",
    file: fileObj
  };
  
  // Add message to UI
  addMessageToUI(message);
  
  // Add message to room data
  if (!room.messages) {
    room.messages = [];
  }
  
  room.messages.push(message);
  
  // Add file to room files
  if (!room.files) {
    room.files = [];
  }
  
  room.files.push(fileObj);
  updateRoomData(room);
  
  // Scroll to bottom
  scrollToBottom();
  
  // Update files tab
  updateFilesTab(room);
}

// Download file
function downloadFile(file) {
  // In a real application, you would download the file from a server here
  // For this demo, we'll just use the temporary URL
  
  const a = document.createElement("a");
  a.href = file.url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Scroll chat to bottom
function scrollToBottom() {
  const chatMessages = document.getElementById("chat-messages");
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Initialize files tab
function initFilesTab(room) {
  const uploadFileBtn = document.getElementById("upload-file-btn");
  const uploadInput = document.getElementById("upload-input");
  const uploadFirstFileBtn = document.getElementById("upload-first-file-btn");
  
  // Update files list
  updateFilesTab(room);
  
  // Upload file button
  if (uploadFileBtn && uploadInput) {
    uploadFileBtn.addEventListener("click", () => {
      uploadInput.click();
    });
    
    uploadInput.addEventListener("change", () => {
      if (uploadInput.files.length > 0) {
        const file = uploadInput.files[0];
        uploadFile(room, file);
        uploadInput.value = "";
      }
    });
  }
  
  // Upload first file button
  if (uploadFirstFileBtn) {
    uploadFirstFileBtn.addEventListener("click", () => {
      uploadInput.click();
    });
  }
}

// Update files tab
function updateFilesTab(room) {
  const filesList = document.getElementById("files-list");
  if (!filesList) return;
  
  // Clear existing files
  filesList.innerHTML = "";
  
  if (room.files && room.files.length > 0) {
    room.files.forEach(file => {
      addFileToUI(file, filesList);
    });
  } else {
    // Show empty state
    filesList.innerHTML = `
      <div class="empty-files">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
        <p>No files have been shared yet</p>
        <button id="upload-first-file-btn" class="upload-first-file-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          Upload First File
        </button>
      </div>
    `;
    
    // Add event listener to upload first file button
    const uploadFirstFileBtn = document.getElementById("upload-first-file-btn");
    const uploadInput = document.getElementById("upload-input");
    
    if (uploadFirstFileBtn && uploadInput) {
      uploadFirstFileBtn.addEventListener("click", () => {
        uploadInput.click();
      });
    }
  }
}

// Add file to UI
function addFileToUI(file, filesList) {
  const fileItem = document.createElement("div");
  fileItem.className = "file-item";
  fileItem.dataset.id = file.id;
  
  // Get file icon based on type
  let fileIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`;
  
  if (file.type.startsWith("image/")) {
    fileIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
  } else if (file.type.startsWith("video/")) {
    fileIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`;
  } else if (file.type.startsWith("audio/")) {
    fileIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-music"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
  } else if (file.type === "application/pdf") {
    fileIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
  }
  
  // Format date
  const fileDate = new Date();
  const dateOptions = { month: 'short', day: 'numeric' };
  const dateStr = fileDate.toLocaleDateString([], dateOptions);
  
  fileItem.innerHTML = `
    <div class="file-icon">
      ${fileIconSvg}
    </div>
    <div class="file-name">${file.name}</div>
    <div class="file-info">
      <span>${formatFileSize(file.size)}</span>
      <span>${dateStr}</span>
    </div>
    <div class="file-actions">
      <button class="file-download" data-file-id="${file.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      </button>
      <button class="file-delete" data-file-id="${file.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
      </button>
    </div>
  `;
  
  filesList.appendChild(fileItem);
  
  // Add event listeners to buttons
  const downloadBtn = fileItem.querySelector(".file-download");
  const deleteBtn = fileItem.querySelector(".file-delete");
  
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      downloadFile(file);
    });
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this file?")) {
        deleteFile(file.id);
      }
    });
  }
}

// Upload file
function uploadFile(room, file) {
  // In a real application, you would upload the file to a server here
  // For this demo, we'll just simulate it
  
  const fileId = Date.now().toString();
  const fileObj = {
    id: fileId,
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file) // This is temporary and will be lost on page refresh
  };
  
  // Add file to room files
  if (!room.files) {
    room.files = [];
  }
  
  room.files.push(fileObj);
  updateRoomData(room);
  
  // Update files tab
  updateFilesTab(room);
  
  // Send file message
  sendFile(room, file);
}

// Delete file
function deleteFile(fileId) {
  // Get room ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("id") || localStorage.getItem("currentRoomId");
  
  if (!roomId) return;
  
  // Load room data
  const room = loadRoomData(roomId);
  if (!room || !room.files) return;
  
  // Remove file from room files
  const fileIndex = room.files.findIndex(file => file.id === fileId);
  if (fileIndex !== -1) {
    room.files.splice(fileIndex, 1);
    updateRoomData(room);
    
    // Update files tab
    updateFilesTab(room);
  }
}

// Initialize participants tab
function initParticipantsTab(room) {
  updateParticipantsTab(room);
}

// Update participants tab
function updateParticipantsTab(room) {
  const participantsList = document.getElementById("participants-list");
  if (!participantsList) return;
  
  // Clear existing participants
  participantsList.innerHTML = "";
  
  if (room.participants && room.participants.length > 0) {
    room.participants.forEach(participant => {
      const participantItem = document.createElement("div");
      participantItem.className = "participant-item";
      
      // Determine if participant is online (for demo purposes, only the current user is online)
      const isOnline = participant === "John Doe";
      
      participantItem.innerHTML = `
        <img src="images/profile.jpg" alt="${participant}" class="participant-avatar">
        <div class="participant-name">${participant}</div>
        <div class="participant-role">Student</div>
        <div class="participant-status">
          <span class="status-indicator ${isOnline ? 'online' : 'offline'}"></span>
          <span>${isOnline ? 'Online' : 'Offline'}</span>
        </div>
      `;
      
      participantsList.appendChild(participantItem);
    });
  }
}

// Leave room
function leaveRoom(room) {
  // Remove current user from participants
  const userIndex = room.participants.indexOf("John Doe");
  if (userIndex !== -1) {
    room.participants.splice(userIndex, 1);
    updateRoomData(room);
  }
  
  // Redirect to study rooms page
  window.location.href = "study-rooms.html";
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Format date
function formatDate(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString([], options);
  }
}

// Simulate real-time updates
function simulateRealTimeUpdates(room) {
  // Simulate other users joining the room
  setTimeout(() => {
    if (!room.participants.includes("Sarah Johnson")) {
      room.participants.push("Sarah Johnson");
      updateRoomData(room);
      updateParticipantsTab(room);
      
      // Add system message
      const message = {
        id: Date.now().toString(),
        sender: "System",
        content: "Sarah Johnson has joined the room.",
        timestamp: new Date().toISOString(),
        type: "text"
      };
      
      addMessageToUI(message);
      
      if (!room.messages) {
        room.messages = [];
      }
      
      room.messages.push(message);
      updateRoomData(room);
    }
  }, 10000);
  
  // Simulate receiving messages
  const messages = [
    "Hi everyone! I'm excited to study with you all.",
    "Can someone explain the concept of derivatives in calculus?",
    "I'm having trouble understanding the chain rule. Any help would be appreciated!",
    "Has anyone started working on the assignment due next week?",
    "I found a great resource for this topic: https://example.com/resource"
  ];
  
  let messageIndex = 0;
  
  const messageInterval = setInterval(() => {
    if (messageIndex >= messages.length) {
      clearInterval(messageInterval);
      return;
    }
    
    const message = {
      id: Date.now().toString(),
      sender: "Sarah Johnson",
      content: messages[messageIndex],
      timestamp: new Date().toISOString(),
      type: "text"
    };
    
    addMessageToUI(message);
    
    if (!room.messages) {
      room.messages = [];
    }
    
    room.messages.push(message);
    updateRoomData(room);
    
    messageIndex++;
  }, 15000);
}