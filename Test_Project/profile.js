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

  // Add navigation flag for study rooms link
  const studyRoomsLink = document.querySelector('.sidebar-nav a[href="study-rooms.html"]')
  if (studyRoomsLink) {
    studyRoomsLink.addEventListener("click", (e) => {
      // Set a flag in sessionStorage to indicate navigation from profile page
      sessionStorage.setItem("navigatingFromProfile", "true")
    })
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

  avatarInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader()

      reader.onload = (e) => {
        profileAvatarImg.src = e.target.result

        // Also update header profile image if it exists
        const headerProfileImg = document.querySelector(".header-right .profile-img")
        if (headerProfileImg) {
          headerProfileImg.src = e.target.result
        }
      }

      reader.readAsDataURL(this.files[0])
    }
  })

  // Edit Profile Modal
  const editProfileBtn = document.getElementById("editProfileBtn")
  const editProfileModal = document.getElementById("editProfileModal")
  const closeModalBtn = document.getElementById("closeModalBtn")
  const cancelEditBtn = document.getElementById("cancelEditBtn")
  const editProfileForm = document.getElementById("editProfileForm")

  // Open modal
  editProfileBtn.addEventListener("click", () => {
    // Populate form with current values
    document.getElementById("editName").value = document.getElementById("profileName").textContent
    document.getElementById("editStatus").value = document.getElementById("profileStatus").textContent
    document.getElementById("editLocation").value = document.getElementById("profileLocation").textContent
    document.getElementById("editEmail").value = document.getElementById("profileEmail").textContent
    document.getElementById("editBio").value = document.getElementById("profileBio").textContent
    document.getElementById("editDegree").value = document.getElementById("profileDegree").textContent
    document.getElementById("editSchool").value = document.getElementById("profileSchool").textContent
    document.getElementById("editEducationDate").value = document.getElementById("profileEducationDate").textContent

    editProfileModal.classList.add("active")
  })

  // Close modal
  function closeModal() {
    editProfileModal.classList.remove("active")
  }

  closeModalBtn.addEventListener("click", closeModal)
  cancelEditBtn.addEventListener("click", closeModal)

  // Close modal when clicking outside
  editProfileModal.addEventListener("click", (e) => {
    if (e.target === editProfileModal) {
      closeModal()
    }
  })

  // Save profile changes
  editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Update profile with form values
    document.getElementById("profileName").textContent = document.getElementById("editName").value
    document.getElementById("profileStatus").textContent = document.getElementById("editStatus").value
    document.getElementById("profileLocation").textContent = document.getElementById("editLocation").value
    document.getElementById("profileEmail").textContent = document.getElementById("editEmail").value
    document.getElementById("profileBio").textContent = document.getElementById("editBio").value
    document.getElementById("profileDegree").textContent = document.getElementById("editDegree").value
    document.getElementById("profileSchool").textContent = document.getElementById("editSchool").value
    document.getElementById("profileEducationDate").textContent = document.getElementById("editEducationDate").value

    // Also update header username if it exists
    const headerUsername = document.querySelector(".header-right .user-name")
    if (headerUsername) {
      headerUsername.textContent = document.getElementById("editName").value
    }

    closeModal()

    // Show success message (optional)
    alert("Profile updated successfully!")
  })

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

