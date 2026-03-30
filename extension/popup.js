const searchInput = document.getElementById("searchInput");
const projectFilter = document.getElementById("projectFilter");
const categoryFilter = document.getElementById("categoryFilter");
const commandList = document.getElementById("commandList");
const commandCardTemplate = document.getElementById("commandCardTemplate");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");
const seedButton = document.getElementById("seedButton");
const clearFiltersButton = document.getElementById("clearFiltersButton");
const showFavoritesBtn = document.getElementById("showFavoritesBtn");
const showRecentBtn = document.getElementById("showRecentBtn");
const resultsLabel = document.getElementById("resultsLabel");
const resultsCount = document.getElementById("resultsCount");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");

let currentMode = "favorites";
let currentPage = 1;
const PAGE_SIZE = 3;

function showToast(message = "Copié ✅") {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1400);
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
  showToast("Commande copiée ✅");
}

function updateSelect(select, values, defaultLabel) {
  const current = select.value;
  select.innerHTML = `<option value="">${defaultLabel}</option>`;
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    if (value === current) option.selected = true;
    select.appendChild(option);
  }
}

function applyModeStyling() {
  showFavoritesBtn.classList.toggle("active", currentMode === "favorites");
  showRecentBtn.classList.toggle("active", currentMode === "recent");
  resultsLabel.textContent = currentMode === "favorites" ? "Tes commandes favorites" : "Tes commandes récentes";
}

function getFilteredCommands(commands) {
  let filtered = filterCommands(commands, {
    search: searchInput.value,
    project: projectFilter.value,
    category: categoryFilter.value,
    onlyFavorites: false
  });

  if (currentMode === "favorites") {
    const favs = filtered.filter(item => item.favorite);
    filtered = favs.length ? favs : filtered;
  }

  return filtered;
}

function renderCommands(commands) {
  const filtered = getFilteredCommands(commands);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  resultsCount.textContent = `${filtered.length} résultat(s)`;
  pageInfo.textContent = `Page ${currentPage}/${totalPages}`;
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;

  commandList.innerHTML = "";
  emptyState.classList.toggle("hidden", visible.length > 0);

  for (const item of visible) {
    const node = commandCardTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".title").textContent = item.title;
    node.querySelector(".project").textContent = item.project;
    node.querySelector(".category").textContent = item.category;
    node.querySelector(".command").textContent = item.command;

    const favBadge = node.querySelector(".favorite");
    favBadge.classList.toggle("hidden", !item.favorite);

    const favBtn = node.querySelector(".fav-btn");
    favBtn.textContent = item.favorite ? "★" : "☆";
    favBtn.addEventListener("click", async () => {
      await toggleFavorite(item.id);
      await refresh();
      showToast(item.favorite ? "Retiré des favoris" : "Ajouté aux favoris");
    });

    node.querySelector(".copy-btn").addEventListener("click", () => copyText(item.command));
    commandList.appendChild(node);
  }
}

async function refresh(resetPage = false) {
  const commands = await getCommands();
  if (resetPage) currentPage = 1;
  updateSelect(projectFilter, getProjects(commands), "Tous projets");
  updateSelect(categoryFilter, getCategories(commands), "Toutes catégories");
  applyModeStyling();
  renderCommands(commands);
}

showFavoritesBtn.addEventListener("click", async () => {
  currentMode = "favorites";
  await refresh(true);
});

showRecentBtn.addEventListener("click", async () => {
  currentMode = "recent";
  await refresh(true);
});

prevPageBtn.addEventListener("click", async () => {
  if (currentPage > 1) {
    currentPage -= 1;
    await refresh(false);
  }
});

nextPageBtn.addEventListener("click", async () => {
  currentPage += 1;
  await refresh(false);
});

seedButton.addEventListener("click", async () => {
  await seedDemoCommands();
  await refresh(true);
  showToast("Base réinitialisée 🚀");
});

clearFiltersButton.addEventListener("click", async () => {
  searchInput.value = "";
  projectFilter.value = "";
  categoryFilter.value = "";
  currentMode = "favorites";
  await refresh(true);
});

searchInput.addEventListener("input", () => refresh(true));
projectFilter.addEventListener("change", () => refresh(true));
categoryFilter.addEventListener("change", () => refresh(true));

document.addEventListener("DOMContentLoaded", () => refresh(true));
