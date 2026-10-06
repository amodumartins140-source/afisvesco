
// Edit this list to change the services shown on the page.
const services = [
  {
    name: "Battery and charging",
    category: "Power",
    description: "Help with batteries, charging systems and onboard power."
  },
  {
    name: "Electrical troubleshooting",
    category: "Repairs",
    description: "Describe power problems, faults or equipment that stops working."
  },
  {
    name: "Navigation equipment",
    category: "Navigation",
    description: "Service for navigation, radio and communications equipment."
  },
  {
    name: "Equipment installation",
    category: "Installation",
    description: "Plan an installation or upgrade for your vessel."
  },
  {
    name: "Wiring repair",
    category: "Repairs",
    description: "Get help with inspection or repair of vessel wiring."
  },
  {
    name: "Lighting and onboard systems",
    category: "Installation",
    description: "Help with lighting, controls and other onboard systems."
  }
];

const serviceGrid = document.querySelector("#serviceGrid");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");

// Draw the service cards, applying the search and category filters.
function showServices() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const matchingServices = services.filter(function(service) {
    const matchesText =
      service.name.toLowerCase().includes(searchText) ||
      service.description.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" ||
      service.category === selectedCategory;

    return matchesText && matchesCategory;
  });

  serviceGrid.innerHTML = "";

  matchingServices.forEach(function(service) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="tag">${service.category}</div>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
    `;
    serviceGrid.appendChild(card);
  });

  if (matchingServices.length === 0) {
    serviceGrid.innerHTML = '<p class="muted">No matching services. Try another search.</p>';
  }
}

searchInput.addEventListener("input", showServices);
categoryFilter.addEventListener("change", showServices);
showServices();

// The matcher suggests a service and can fill it into the quote form.
let suggestedService = "";

document.querySelectorAll(".symptom").forEach(function(button) {
  button.addEventListener("click", function() {
    suggestedService = button.dataset.service;
    document.querySelector("#matcherResult").textContent =
      "Suggested starting point: " + suggestedService;

    document.querySelector("#useSuggestion").hidden = false;
  });
});

document.querySelector("#useSuggestion").addEventListener("click", function() {
  const serviceSelect = document.querySelector("#service");
  const option = Array.from(serviceSelect.options).find(function(item) {
    return item.text.toLowerCase().includes(suggestedService.toLowerCase());
  });

  if (option) {
    serviceSelect.value = option.value;
  } else {
    serviceSelect.value = "Not sure yet";
  }

  document.querySelector("#request").scrollIntoView({ behavior: "smooth" });
});

// Keep request and checklist data in this browser.
const requestStorageKey = "bluecurrentRequests";
const checklistStorageKey = "bluecurrentChecklist";

function getRequests() {
  return JSON.parse(localStorage.getItem(requestStorageKey) || "[]");
}

function showRequests() {
  const requestList = document.querySelector("#requestList");
  const requests = getRequests();

  requestList.innerHTML = "";

  if (requests.length === 0) {
    requestList.innerHTML = '<p class="muted">No requests saved yet.</p>';
    return;
  }

  requests.forEach(function(request) {
    const item = document.createElement("article");
    item.className = "request-item";
    item.innerHTML = `
      <strong>${request.service}</strong>
      <p>Request ${request.id} · ${request.vessel} · ${request.urgency}</p>
      <p>${request.location} · Saved ${request.date}</p>
    `;
    requestList.appendChild(item);
  });
}

const businessWhatsAppNumber = "2349012161345";
const formMessage = document.querySelector("#formMessage");

document.querySelector("#requestForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const message = [
    "New marine electrical service request",
    "",
    `Customer name: ${formData.get("name")}`,
    `Customer phone: ${formData.get("phone")}`,
    `Customer WhatsApp: ${formData.get("customerWhatsApp")}`,
    `Boat: ${formData.get("vessel")}`,
    `Location: ${formData.get("location")}`,
    `Service: ${formData.get("service")}`,
    `Timing: ${formData.get("urgency")}`,
    `Details: ${formData.get("details") || "Not provided"}`,
    "Photo: I will attach it in this WhatsApp chat."
  ].join("\n");

  const whatsappLink =
    `https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(message)}`;

  formMessage.textContent = "Opening WhatsApp with your request...";

  setTimeout(function() {
    window.location.href = whatsappLink;
  }, 250);
});

// Restore and save checklist ticks when the page is reopened.
const savedChecklist = JSON.parse(
  localStorage.getItem(checklistStorageKey) || "{}"
);

document.querySelectorAll("[data-check]").forEach(function(checkbox) {
  checkbox.checked = Boolean(savedChecklist[checkbox.dataset.check]);

  checkbox.addEventListener("change", function() {
    savedChecklist[checkbox.dataset.check] = checkbox.checked;
    localStorage.setItem(
      checklistStorageKey,
      JSON.stringify(savedChecklist)
    );
  });
});

showRequests();