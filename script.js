// script.js
document.addEventListener("DOMContentLoaded", () => {
  setupIdeaFilters();
  setupDragAndDrop();
  setupStatusPills();
  setupCardDetailsToggle();
  setupAssumptionChecklists();
});

/* ------------ FILTER BUTTONS ON HOME PAGE ------------ */
function setupIdeaFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".idea-card");

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      filterButtons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ------------ DRAG & DROP REORDERING ------------ */
function setupDragAndDrop() {
  const toggleBtn = document.getElementById("toggle-drag");
  const cards = document.querySelectorAll(".idea-card");
  const grid = document.querySelector(".grid");
  if (!toggleBtn || !cards.length || !grid) return;

  let dragEnabled = false;
  let dragSrcEl = null;

  function setDraggable(enabled) {
    cards.forEach((card) => {
      card.draggable = enabled;
      card.classList.toggle("drag-enabled", enabled);
    });
  }

  setDraggable(false);

  toggleBtn.addEventListener("click", () => {
    dragEnabled = !dragEnabled;
    setDraggable(dragEnabled);
    toggleBtn.textContent = dragEnabled ? "Disable drag & drop" : "Enable drag & drop";
  });

  cards.forEach((card) => {
    card.addEventListener("dragstart", (e) => {
      if (!dragEnabled) return;
      dragSrcEl = card;
      card.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      try {
        e.dataTransfer.setData("text/plain", "");
      } catch (err) {
        // Safari may throw, ignore
      }
    });

    card.addEventListener("dragover", (e) => {
      if (!dragEnabled || !dragSrcEl) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    card.addEventListener("drop", (e) => {
      if (!dragEnabled || !dragSrcEl) return;
      e.preventDefault();
      if (card === dragSrcEl) return;
      // Insert dragged card before the one we dropped on
      grid.insertBefore(dragSrcEl, card);
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      dragSrcEl = null;
    });
  });
}

/* ------------ STATUS PILL CYCLE (Idea → In progress → Launched) ------------ */
function setupStatusPills() {
  const pills = document.querySelectorAll(".status-pill");
  if (!pills.length) return;

  const order = ["idea", "in-progress", "launched"];
  const labels = {
    "idea": "Idea",
    "in-progress": "In progress",
    "launched": "Launched"
  };

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const current = pill.getAttribute("data-status") || "idea";
      const idx = order.indexOf(current);
      const next = order[(idx + 1) % order.length];
      pill.setAttribute("data-status", next);
      pill.textContent = labels[next];

      pill.classList.remove("status-idea", "status-in-progress", "status-launched");
      pill.classList.add(`status-${next}`);
    });
  });
}

/* ------------ CARD DETAILS TOGGLE ------------ */
function setupCardDetailsToggle() {
  const toggles = document.querySelectorAll(".more-toggle");
  if (!toggles.length) return;

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const extra = card ? card.querySelector(".card-extra") : null;
      if (!extra) return;
      const open = extra.classList.toggle("open");
      btn.textContent = open ? "Hide" : "Details";
    });
  });
}

/* ------------ CHECKLIST + PROGRESS BAR (Idea pages) ------------ */
function setupAssumptionChecklists() {
  const lists = document.querySelectorAll(".assumption-list");
  if (!lists.length) return;

  lists.forEach((list) => {
    const checkboxes = list.querySelectorAll("input[type='checkbox']");
    const progressFill = list.parentElement.querySelector(".assumption-progress-fill");
    const progressLabel = list.parentElement.querySelector(".assumption-progress-label");

    function updateProgress() {
      const total = checkboxes.length;
      if (!total) return;
      let checked = 0;
      checkboxes.forEach((cb) => {
        if (cb.checked) checked++;
      });
      const percent = Math.round((checked / total) * 100);
      if (progressFill) {
        progressFill.style.width = percent + "%";
      }
      if (progressLabel) {
        progressLabel.textContent = `${percent}% validated`;
      }
    }

    checkboxes.forEach((cb) => {
      cb.addEventListener("change", updateProgress);
    });

    updateProgress();
  });
}
