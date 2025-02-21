let sessionSlots = { 1: "", 2: "", 3: "", 4: "" };
let mandatorySession = "Territory Management";

function handleGroupChange() {
  let userGroup = document.getElementById("user-group").value;
  document.getElementById("booking").style.display = userGroup
    ? "block"
    : "none";

  if (userGroup === "R&E") {
    sessionSlots[1] = "";
    sessionSlots[2] = "";
  }

  updateSelectedSessions();
  loadSlot(1);
}

function loadSlot(slotNumber) {
  if (Object.values(sessionSlots).every((s) => s)) {
    document.getElementById("session-selection").style.display = "none";
    return;
  } else {
    document.getElementById("session-selection").style.display = "block";
  }

  document.getElementById("session-slots").innerHTML = "";
  document.getElementById(
    "slot-message"
  ).innerText = `Wähle eine Session für Slot ${slotNumber}`;
  let userGroup = document.getElementById("user-group").value;
  let sessions = [
    "PreQ/Data Privacy",
    "Storytelling",
    "IT-Trends 2025",
    "Selling available Project Capacity",
    "Cold Client Acquisition",
    "Resilience",
  ];

  if (userGroup === "R&E") {
    sessions.push("Territory Management");
  } else if (userGroup === "S&E") {
    sessions.push("Financial Deal Management");
  }

  sessions.forEach((session) => {
    let button = document.createElement("button");
    button.innerText = session;
    button.disabled = isSessionUnavailable(session, slotNumber);
    button.onclick = function () {
      bookSession(session, slotNumber);
    };
    document.getElementById("session-slots").appendChild(button);
  });
}

function isSessionUnavailable(session, slotNumber) {
  let userGroup = document.getElementById("user-group").value;
  if (userGroup === "R&E" && session === "Financial Deal Management")
    return true;
  if (userGroup === "S&E" && session === "Territory Management") return true;
  if (
    userGroup === "R&E" &&
    !Object.values(sessionSlots).includes(mandatorySession) &&
    slotNumber === 2
  )
    return session !== mandatorySession;
  return (
    Object.values(sessionSlots).includes(session) &&
    sessionSlots[slotNumber] !== session
  );
}

function bookSession(session, slotNumber) {
  let previousSession = sessionSlots[slotNumber];
  if (previousSession && previousSession !== session) {
    delete sessionSlots[slotNumber];
  }
  sessionSlots[slotNumber] = session;
  updateSelectedSessions();
  checkConfirmButton();

  if (slotNumber < 4 && !sessionSlots[slotNumber + 1]) {
    loadSlot(slotNumber + 1);
  }
}

function editSlot(slotNumber) {
  loadSlot(slotNumber);
}

function updateSelectedSessions() {
  let selectedSessions = document.getElementById("selected-sessions");
  selectedSessions.innerHTML = `<h3>Deine gebuchten Sessions:</h3>`;
  for (let i = 1; i <= 4; i++) {
    if (sessionSlots[i]) {
      let sessionElement = document.createElement("p");
      sessionElement.innerHTML = `Slot ${i}: ${sessionSlots[i]} <button onclick='editSlot(${i})'>Bearbeiten</button>`;
      selectedSessions.appendChild(sessionElement);
    }
  }
  checkConfirmButton();
}

function checkConfirmButton() {
  let userGroup = document.getElementById("user-group").value;
  let hasMandatorySession =
    Object.values(sessionSlots).includes(mandatorySession);
  let allSlotsFilled = Object.values(sessionSlots).every((s) => s);
  if (allSlotsFilled) {
    document.getElementById("session-selection").style.display = "none";
  }
  document.getElementById("confirm-button").style.display =
    userGroup === "R&E"
      ? hasMandatorySession && allSlotsFilled
        ? "block"
        : "none"
      : allSlotsFilled
      ? "block"
      : "none";
}

function confirmBooking() {
  alert("Buchung bestätigt! Sessions: " + JSON.stringify(sessionSlots));
}
