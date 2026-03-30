const form = document.getElementById("commandForm");
const commandId = document.getElementById("commandId");
const titleInput = document.getElementById("title");
const projectInput = document.getElementById("project");
const categoryInput = document.getElementById("category");
const tagsInput = document.getElementById("tags");
const favoriteInput = document.getElementById("favorite");
const commandInput = document.getElementById("command");
const resetFormButton = document.getElementById("resetFormButton");
const commandList = document.getElementById("commandList");
const rowTemplate = document.getElementById("rowTemplate");
const searchInput = document.getElementById("searchInput");
const projectFilter = document.getElementById("projectFilter");
const categoryFilter = document.getElementById("categoryFilter");
const favoritesOnly = document.getElementById("favoritesOnly");
const emptyState = document.getElementById("emptyState");
const stats = document.getElementById("stats");
const toast = document.getElementById("toast");
const exportButton = document.getElementById("exportButton");
const importFile = document.getElementById("importFile");
const seedButton = document.getElementById("seedButton");

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1600);
}

function fillForm(item = null) {
  commandId.value = item?.id || "";
  titleInput.value = item?.title || "";
  projectInput.value = item?.project || "";
  categoryInput.value = item?.category || "";
  tagsInput.value = item?.tags?.join(", ") || "";
  favoriteInput.checked = Boolean(item?.favorite);
  commandInput.value = item?.command || "";
  titleInput.focus();
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

async function copyText(text) {
  await navigator.clipboard.writeText(text);
  showToast("Commande copiée ✅");
}

function downloadJson(filename, content) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function render() {
  const commands = await getCommands();
  const filtered = filterCommands(commands, {
    search: searchInput.value,
    project: projectFilter.value,
    category: categoryFilter.value,
    onlyFavorites: favoritesOnly.checked
  });

  updateSelect(projectFilter, getProjects(commands), "Tous les projets");
  updateSelect(categoryFilter, getCategories(commands), "Toutes catégories");
  const favCount = commands.filter(item => item.favorite).length;
  stats.textContent = `${commands.length} commande(s) • ${favCount} favori(s)`;
  commandList.innerHTML = "";
  emptyState.classList.toggle("hidden", filtered.length > 0);

  for (const item of filtered) {
    const node = rowTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".project").textContent = item.project;
    node.querySelector(".category").textContent = item.category;
    node.querySelector(".title").textContent = item.title;
    node.querySelector(".tags").textContent = item.tags.length ? `# ${item.tags.join(" · ")}` : "Sans tags";
    node.querySelector(".command").textContent = item.command;

    const favoriteBadge = node.querySelector(".favorite");
    favoriteBadge.classList.toggle("hidden", !item.favorite);

    node.querySelector(".copy-btn").addEventListener("click", () => copyText(item.command));
    node.querySelector(".edit-btn").addEventListener("click", () => fillForm(item));
    node.querySelector(".fav-btn").textContent = item.favorite ? "★" : "☆";
    node.querySelector(".fav-btn").addEventListener("click", async () => {
      await toggleFavorite(item.id);
      await render();
      showToast(item.favorite ? "Retiré des favoris" : "Ajouté aux favoris");
    });
    node.querySelector(".delete-btn").addEventListener("click", async () => {
      const ok = confirm(`Supprimer "${item.title}" ?`);
      if (!ok) return;
      await deleteCommand(item.id);
      await render();
      showToast("Commande supprimée");
    });

    commandList.appendChild(node);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await upsertCommand({
    id: commandId.value || undefined,
    title: titleInput.value,
    project: projectInput.value,
    category: categoryInput.value,
    favorite: favoriteInput.checked,
    tags: tagsInput.value,
    command: commandInput.value
  });
  fillForm();
  await render();
  showToast("Commande enregistrée ✨");
});

resetFormButton.addEventListener("click", () => fillForm());
searchInput.addEventListener("input", render);
projectFilter.addEventListener("change", render);
categoryFilter.addEventListener("change", render);
favoritesOnly.addEventListener("change", render);

exportButton.addEventListener("click", async () => {
  const commands = await getCommands();
  downloadJson("quickcmd-commands-v2.json", JSON.stringify(commands, null, 2));
  showToast("Export JSON prêt");
});

importFile.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  const data = JSON.parse(text);
  await importCommands(data);
  await render();
  showToast("Import terminé 🚀");
  importFile.value = "";
});

seedButton.addEventListener("click", async () => {
  await seedDemoCommands();
  await render();
  showToast("Base réinitialisée");
});

document.addEventListener("DOMContentLoaded", () => {
  fillForm();
  render();
});
