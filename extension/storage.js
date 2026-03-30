const STORAGE_KEY = "quickcmd.commands.v4";
const LEGACY_KEYS = [
  "quickcmd.commands.v4",
  "quickcmd.commands.v2",
  "quickcmd.commands"
];

const DEFAULT_COMMANDS = [
  {
    title: "Git status",
    project: "Tous projets",
    category: "Git",
    favorite: true,
    tags: ["git", "status"],
    command: "git status"
  },
  {
    title: "Git add + commit",
    project: "Tous projets",
    category: "Git",
    favorite: true,
    tags: ["git", "commit"],
    command: 'git add . && git commit -m "feat: my change"'
  },
  {
    title: "Git pull",
    project: "Tous projets",
    category: "Git",
    favorite: false,
    tags: ["git", "pull"],
    command: "git pull"
  },
  {
    title: "Git pull --rebase",
    project: "Tous projets",
    category: "Git",
    favorite: true,
    tags: ["git", "rebase", "sync"],
    command: "git pull --rebase origin main"
  },
  {
    title: "Git sync rapide",
    project: "Tous projets",
    category: "Git",
    favorite: true,
    tags: ["git", "sync", "github"],
    command: 'git add . && git commit -m "update" && git push origin HEAD'
  },
  {
    title: "Git sync safe",
    project: "Tous projets",
    category: "Git",
    favorite: true,
    tags: ["git", "sync", "github", "safe"],
    command: 'git pull --rebase origin main && git add . && git commit -m "update" && git push origin HEAD'
  },
  {
    title: "Installer dépendances",
    project: "Tous projets",
    category: "npm",
    favorite: true,
    tags: ["npm", "install"],
    command: "npm install"
  },
  {
    title: "Lancer dev",
    project: "Tous projets",
    category: "npm",
    favorite: true,
    tags: ["npm", "dev"],
    command: "npm run dev"
  },
  {
    title: "Build prod",
    project: "Tous projets",
    category: "npm",
    favorite: true,
    tags: ["npm", "build"],
    command: "npm run build"
  },
  {
    title: "Type check",
    project: "Tous projets",
    category: "npm",
    favorite: true,
    tags: ["typescript", "quality"],
    command: "npx tsc --noEmit"
  },
  {
    title: "Créer dossier skills Claude",
    project: "Local tooling",
    category: "Claude",
    favorite: true,
    tags: ["claude", "skills", "setup"],
    command: "mkdir .claude\nmkdir .claude\\skills"
  },
  {
    title: "Ouvrir skills Claude",
    project: "Local tooling",
    category: "Claude",
    favorite: false,
    tags: ["claude", "skills", "vscode"],
    command: "code .claude\\skills"
  },
  {
    title: "Créer dossier skills Gemini",
    project: "Local tooling",
    category: "Gemini",
    favorite: false,
    tags: ["gemini", "skills", "setup"],
    command: "mkdir .gemini\nmkdir .gemini\\skills"
  },
  {
    title: "Lister fichiers cachés",
    project: "Local tooling",
    category: "Windows",
    favorite: false,
    tags: ["windows", "debug"],
    command: "dir /a"
  },
  {
    title: "Aller sur disque F",
    project: "Windows",
    category: "Windows",
    favorite: false,
    tags: ["windows", "drive"],
    command: "F:"
  },
  {
    title: "BRIX - dev",
    project: "BRIX",
    category: "npm",
    favorite: true,
    tags: ["brix", "vite", "dev"],
    command: "npm run dev"
  },
  {
    title: "BRIX - build",
    project: "BRIX",
    category: "npm",
    favorite: true,
    tags: ["brix", "build"],
    command: "npm run build"
  },
  {
    title: "BRIX - type check",
    project: "BRIX",
    category: "npm",
    favorite: true,
    tags: ["brix", "typescript"],
    command: "npx tsc --noEmit"
  },
  {
    title: "BRIX - Firebase hosting dev",
    project: "BRIX",
    category: "Firebase",
    favorite: false,
    tags: ["brix", "firebase", "hosting"],
    command: "firebase deploy --only hosting --project mybrix-dev"
  },
  {
    title: "BRIX - Firebase prod",
    project: "BRIX",
    category: "Firebase",
    favorite: false,
    tags: ["brix", "firebase", "prod"],
    command: "firebase deploy --project brix-9fdb2"
  },
  {
    title: "ZAPI - dev",
    project: "ZAPI",
    category: "npm",
    favorite: true,
    tags: ["zapi", "vite", "dev"],
    command: "npm run dev"
  },
  {
    title: "ZAPI - build",
    project: "ZAPI",
    category: "npm",
    favorite: true,
    tags: ["zapi", "build"],
    command: "npm run build"
  },
  {
    title: "ZAPI - Vercel prod",
    project: "ZAPI",
    category: "Vercel",
    favorite: true,
    tags: ["zapi", "vercel", "deploy"],
    command: "vercel --prod"
  },
  {
    title: "Vox-Cloud - dev",
    project: "Vox-Cloud",
    category: "npm",
    favorite: true,
    tags: ["vox-cloud", "vite", "dev"],
    command: "npm run dev"
  },
  {
    title: "Vox-Cloud - build",
    project: "Vox-Cloud",
    category: "npm",
    favorite: true,
    tags: ["vox-cloud", "build"],
    command: "npm run build"
  },
  {
    title: "Vox-Cloud - hosting",
    project: "Vox-Cloud",
    category: "Firebase",
    favorite: false,
    tags: ["vox-cloud", "firebase", "hosting"],
    command: "firebase deploy --only hosting"
  },
  {
    title: "Vox-Cloud - functions",
    project: "Vox-Cloud",
    category: "Firebase",
    favorite: false,
    tags: ["vox-cloud", "firebase", "functions"],
    command: "firebase deploy --only functions"
  },
  {
    title: "PowerShell - policy temporaire",
    project: "Windows",
    category: "PowerShell",
    favorite: false,
    tags: ["powershell", "executionpolicy"],
    command: "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"
  }
];

function getSyncArea() {
  return chrome.storage.sync;
}

function getLocalArea() {
  return chrome.storage.local;
}

function normalizeCommand(input = {}) {
  return {
    id: input.id || crypto.randomUUID(),
    title: String(input.title || "").trim(),
    project: String(input.project || "").trim(),
    category: String(input.category || "Autre").trim(),
    favorite: Boolean(input.favorite),
    tags: Array.isArray(input.tags)
      ? input.tags.map(t => String(t).trim()).filter(Boolean)
      : String(input.tags || "")
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
    command: String(input.command || "").trim(),
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString()
  };
}

function buildDefaultCommands() {
  return DEFAULT_COMMANDS.map(normalizeCommand);
}

async function readFromArea(area, key) {
  const result = await area.get([key]);
  return Array.isArray(result[key]) ? result[key] : [];
}

async function writeToArea(area, key, value) {
  await area.set({ [key]: value });
}

async function migrateLegacyDataToSync() {
  const syncArea = getSyncArea();
  const localArea = getLocalArea();

  const existingSync = await readFromArea(syncArea, STORAGE_KEY);
  if (existingSync.length > 0) return existingSync;

  for (const key of LEGACY_KEYS) {
    const fromSync = await readFromArea(syncArea, key);
    if (fromSync.length > 0) {
      const cleaned = fromSync.map(normalizeCommand);
      await writeToArea(syncArea, STORAGE_KEY, cleaned);
      return cleaned;
    }
  }

  for (const key of LEGACY_KEYS) {
    const fromLocal = await readFromArea(localArea, key);
    if (fromLocal.length > 0) {
      const cleaned = fromLocal.map(normalizeCommand);
      await writeToArea(syncArea, STORAGE_KEY, cleaned);
      return cleaned;
    }
  }

  const defaults = buildDefaultCommands();
  await writeToArea(syncArea, STORAGE_KEY, defaults);
  return defaults;
}

async function getCommands() {
  const syncArea = getSyncArea();
  const items = await readFromArea(syncArea, STORAGE_KEY);
  if (items.length > 0) return items;
  return migrateLegacyDataToSync();
}

async function saveCommands(commands) {
  const cleaned = commands.map(normalizeCommand);
  await writeToArea(getSyncArea(), STORAGE_KEY, cleaned);
  return cleaned;
}

async function upsertCommand(payload) {
  const commands = await getCommands();
  const existing = payload?.id ? commands.find(item => item.id === payload.id) : null;
  const command = normalizeCommand({
    ...existing,
    ...payload,
    createdAt: existing?.createdAt || payload?.createdAt
  });
  const index = commands.findIndex(item => item.id === command.id);
  if (index >= 0) {
    commands[index] = command;
  } else {
    commands.unshift(command);
  }
  await saveCommands(commands);
  return command;
}

async function deleteCommand(id) {
  const commands = await getCommands();
  await saveCommands(commands.filter(item => item.id !== id));
}

async function toggleFavorite(id) {
  const commands = await getCommands();
  const next = commands.map(item => {
    if (item.id !== id) return item;
    return { ...item, favorite: !item.favorite, updatedAt: new Date().toISOString() };
  });
  await saveCommands(next);
}

async function importCommands(items) {
  if (!Array.isArray(items)) {
    throw new Error("Le fichier importé doit contenir un tableau JSON.");
  }
  const cleaned = items
    .map(normalizeCommand)
    .filter(item => item.title && item.project && item.command);
  await saveCommands(cleaned);
  return cleaned;
}

function getProjects(commands) {
  return [...new Set(commands.map(c => c.project).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function getCategories(commands) {
  return [...new Set(commands.map(c => c.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function filterCommands(commands, filters = {}) {
  const search = (filters.search || "").trim().toLowerCase();
  const project = filters.project || "";
  const category = filters.category || "";
  const onlyFavorites = Boolean(filters.onlyFavorites);

  return commands
    .filter(item => !project || item.project === project)
    .filter(item => !category || item.category === category)
    .filter(item => !onlyFavorites || item.favorite)
    .filter(item => {
      if (!search) return true;
      const haystack = [
        item.title,
        item.project,
        item.category,
        item.command,
        ...(item.tags || [])
      ].join(" ").toLowerCase();
      return haystack.includes(search);
    })
    .sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });
}

async function seedDemoCommands() {
  const demo = buildDefaultCommands();
  await saveCommands(demo);
  return demo;
}
