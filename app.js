const STORAGE_KEY = "story-forge-state-v1";

const seedState = {
  projectTitle: "The Glass Orchard",
  activeView: "workspace",
  activeCharacterId: "char-1",
  draft: {
    title: "Chapter One: The Orchard Wakes",
    content:
      "# Opening image\nLena returns to the family estate after a decade away.\n\n## Tension\nShe expects silence, but the orchard is full of music only she seems to hear.\n\n- Dust in the greenhouse\n- A key hidden in a pomegranate crate\n- Her brother acting as if nothing is wrong",
  },
  ideas: [
    {
      id: "idea-1",
      title: "Secret at the irrigation gate",
      notes: "The broken irrigation gate is actually a coded entry point into the old archive tunnel.",
    },
    {
      id: "idea-2",
      title: "Voice motif",
      notes: "Every time the orchard speaks, it uses a phrase once spoken by the grandmother.",
    },
  ],
  outline: [
    { id: "beat-1", title: "Arrival", summary: "Protagonist returns home under pressure." },
    { id: "beat-2", title: "The impossible sound", summary: "She hears music in the trees." },
    { id: "beat-3", title: "Refusal", summary: "She chooses not to investigate until a threat lands." },
  ],
  scenes: [
    {
      id: "scene-1",
      title: "Train platform goodbye",
      chapter: "1",
      objective: "Show what she is leaving behind.",
      conflict: "Her editor wants the book draft; family wants her silence.",
      outcome: "She boards the train anyway.",
    },
    {
      id: "scene-2",
      title: "Night orchard walk",
      chapter: "1",
      objective: "Introduce the central mystery.",
      conflict: "The orchard behaves like an active intelligence.",
      outcome: "She discovers the hidden key.",
    },
  ],
  plotPointers: [
    {
      id: "plot-1",
      label: "Core question",
      detail: "Who taught the orchard to remember?",
      payoff: "Revealed in the grandmother's journals.",
    },
    {
      id: "plot-2",
      label: "Escalation",
      detail: "Brother begins destroying records to bury the truth.",
      payoff: "Forces protagonist into open conflict by midpoint.",
    },
  ],
  tags: [
    { id: "tag-1", name: "Memory", color: "#d9b16f", notes: "Themes of inheritance and recall." },
    { id: "tag-2", name: "Revision Pass", color: "#c46c4c", notes: "Track scenes needing prose tightening." },
    { id: "tag-3", name: "Family Secrets", color: "#8a9974", notes: "Use on hidden-history threads." },
  ],
  characters: [
    {
      id: "char-1",
      name: "Lena Voss",
      role: "Protagonist",
      archetype: "Reluctant heir",
      desire: "To finish her novel and leave the past untouched.",
      fear: "That her family's history is inside her work and cannot be escaped.",
      contradiction: "She wants distance but keeps searching for signs from home.",
      relationships: "Protective toward Tomas, distrustful of Mara, haunted by Grandmother Iva.",
      arc: "Moves from avoidance to stewardship.",
      analysis: "Lena works best when every external clue collides with an artistic choice she has to make.",
    },
    {
      id: "char-2",
      name: "Tomas Voss",
      role: "Brother",
      archetype: "Keeper of appearances",
      desire: "To preserve the family business at any cost.",
      fear: "Exposure of what their grandmother built beneath the orchard.",
      contradiction: "He claims stability matters most while quietly creating chaos.",
      relationships: "Loves Lena, resents her freedom, fears Mara's insight.",
      arc: "Slides from compromise into sabotage.",
      analysis: "He should never feel purely antagonistic; his logic must stay emotionally legible.",
    },
    {
      id: "char-3",
      name: "Mara Quill",
      role: "Archivist",
      archetype: "Witness who sees too much",
      desire: "To preserve truth before it is erased.",
      fear: "That she will become complicit by waiting too long.",
      contradiction: "She is disciplined in her work but reckless with people.",
      relationships: "Pushes Lena toward action, clashes with Tomas.",
      arc: "Transforms from observer into co-conspirator.",
      analysis: "Mara is a catalyst character; scenes with her should move the plot or sharpen theme.",
    },
  ],
  connections: [
    {
      id: "link-1",
      from: "char-1",
      to: "char-2",
      label: "siblings under pressure",
      type: "character",
    },
    {
      id: "link-2",
      from: "char-1",
      to: "plot-1",
      label: "drives investigation",
      type: "plot",
    },
    {
      id: "link-3",
      from: "char-3",
      to: "plot-2",
      label: "reveals missing records",
      type: "plot",
    },
  ],
};

const navItems = [
  ["workspace", "Workspace", "Draft"],
  ["ideas", "Ideas", "Capture"],
  ["outline", "Outline", "Structure"],
  ["detailed-outline", "Detailed Outline", "Scenes"],
  ["plot", "Plot Pointers", "Threads"],
  ["tags", "Tags", "Reference"],
  ["mind-map", "Mind Map", "Links"],
  ["characters", "Characters", "Analysis"],
];

const toolbarActions = [
  { label: "H1", before: "# ", after: "" },
  { label: "H2", before: "## ", after: "" },
  { label: "Bold", before: "**", after: "**" },
  { label: "Italic", before: "_", after: "_" },
  { label: "Quote", before: "> ", after: "" },
  { label: "List", before: "- ", after: "" },
];

const state = loadState();

const ui = {
  navList: document.getElementById("nav-list"),
  projectTitle: document.getElementById("project-title"),
  draftTitle: document.getElementById("draft-title"),
  draftEditor: document.getElementById("draft-editor"),
  draftPreview: document.getElementById("draft-preview"),
  ideasList: document.getElementById("ideas-list"),
  outlineList: document.getElementById("outline-list"),
  sceneList: document.getElementById("scene-list"),
  plotList: document.getElementById("plot-list"),
  tagList: document.getElementById("tag-list"),
  tagSummary: document.getElementById("tag-summary"),
  connectionList: document.getElementById("connection-list"),
  mindMap: document.getElementById("mind-map"),
  characterList: document.getElementById("character-list"),
  characterEmpty: document.getElementById("character-empty"),
  characterDetail: document.getElementById("character-detail"),
  editorToolbar: document.getElementById("editor-toolbar"),
  resetButton: document.getElementById("reset-button"),
  exportButton: document.getElementById("export-button"),
  importInput: document.getElementById("import-input"),
};

init();

function init() {
  renderNav();
  renderToolbar();
  bindGlobalControls();
  bindDraft();
  renderAll();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(seedState);
  } catch (error) {
    console.error("Failed to load state", error);
    return structuredClone(seedState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderAll() {
  ui.projectTitle.textContent = state.projectTitle;
  ui.draftTitle.value = state.draft.title;
  ui.draftEditor.value = state.draft.content;
  ui.draftPreview.innerHTML = renderMarkdown(state.draft.content);
  setActiveView(state.activeView);
  renderIdeas();
  renderOutline();
  renderScenes();
  renderPlotPointers();
  renderTags();
  renderConnections();
  renderCharacters();
}

function renderNav() {
  ui.navList.innerHTML = "";
  navItems.forEach(([id, label, meta]) => {
    const button = document.createElement("button");
    button.className = `nav-item ${state.activeView === id ? "active" : ""}`;
    button.innerHTML = `<span>${label}</span><span>${meta}</span>`;
    button.addEventListener("click", () => {
      state.activeView = id;
      saveState();
      setActiveView(id);
      renderNav();
    });
    ui.navList.appendChild(button);
  });
}

function setActiveView(id) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.dataset.view === id);
  });
}

function bindDraft() {
  ui.draftTitle.addEventListener("input", (event) => {
    state.draft.title = event.target.value;
    saveState();
  });

  ui.draftEditor.addEventListener("input", (event) => {
    state.draft.content = event.target.value;
    ui.draftPreview.innerHTML = renderMarkdown(state.draft.content);
    saveState();
  });
}

function renderToolbar() {
  toolbarActions.forEach((action) => {
    const button = document.createElement("button");
    button.textContent = action.label;
    button.addEventListener("click", () => wrapSelection(action.before, action.after));
    ui.editorToolbar.appendChild(button);
  });
}

function wrapSelection(before, after) {
  const editor = ui.draftEditor;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selected = editor.value.slice(start, end);
  const nextValue =
    editor.value.slice(0, start) + before + selected + after + editor.value.slice(end);
  editor.value = nextValue;
  editor.focus();
  editor.selectionStart = start + before.length;
  editor.selectionEnd = end + before.length;
  state.draft.content = nextValue;
  ui.draftPreview.innerHTML = renderMarkdown(nextValue);
  saveState();
}

function bindGlobalControls() {
  document.getElementById("add-idea").addEventListener("click", () => {
    state.ideas.unshift({ id: uid("idea"), title: "New idea", notes: "" });
    saveState();
    renderIdeas();
  });

  document.getElementById("add-outline-item").addEventListener("click", () => {
    state.outline.push({ id: uid("beat"), title: "New beat", summary: "" });
    saveState();
    renderOutline();
  });

  document.getElementById("add-scene").addEventListener("click", () => {
    state.scenes.push({
      id: uid("scene"),
      title: "New scene",
      chapter: "",
      objective: "",
      conflict: "",
      outcome: "",
    });
    saveState();
    renderScenes();
  });

  document.getElementById("add-pointer").addEventListener("click", () => {
    state.plotPointers.push({ id: uid("plot"), label: "New plot pointer", detail: "", payoff: "" });
    saveState();
    renderPlotPointers();
    renderConnections();
  });

  document.getElementById("add-tag").addEventListener("click", () => {
    state.tags.push({ id: uid("tag"), name: "New tag", color: "#b88b5f", notes: "" });
    saveState();
    renderTags();
  });

  document.getElementById("add-link").addEventListener("click", () => {
    const firstCharacter = state.characters[0]?.id ?? "";
    const firstPlot = state.plotPointers[0]?.id ?? firstCharacter;
    state.connections.push({
      id: uid("link"),
      from: firstCharacter,
      to: firstPlot,
      label: "New connection",
      type: "plot",
    });
    saveState();
    renderConnections();
  });

  document.getElementById("add-character").addEventListener("click", () => {
    const character = {
      id: uid("char"),
      name: "New character",
      role: "Supporting",
      archetype: "",
      desire: "",
      fear: "",
      contradiction: "",
      relationships: "",
      arc: "",
      analysis: "",
    };
    state.characters.push(character);
    state.activeCharacterId = character.id;
    saveState();
    renderCharacters();
    renderConnections();
  });

  ui.resetButton.addEventListener("click", () => {
    Object.assign(state, structuredClone(seedState));
    saveState();
    renderNav();
    renderAll();
  });

  ui.exportButton.addEventListener("click", exportState);
  ui.importInput.addEventListener("change", importState);
}

function renderIdeas() {
  renderCollection(ui.ideasList, state.ideas, {
    titleLabel: "Idea",
    fields: [
      { key: "title", label: "Idea title", type: "text" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    onChange: () => saveState(),
    onDelete: (id) => {
      state.ideas = state.ideas.filter((item) => item.id !== id);
      saveState();
      renderIdeas();
    },
  });
}

function renderOutline() {
  renderCollection(ui.outlineList, state.outline, {
    titleLabel: "Beat",
    fields: [
      { key: "title", label: "Beat title", type: "text" },
      { key: "summary", label: "Summary", type: "textarea" },
    ],
    onChange: () => saveState(),
    onDelete: (id) => {
      state.outline = state.outline.filter((item) => item.id !== id);
      saveState();
      renderOutline();
    },
    onReorder: (nextItems) => {
      state.outline = nextItems;
      saveState();
      renderOutline();
    },
  });
}

function renderScenes() {
  renderCollection(ui.sceneList, state.scenes, {
    titleLabel: "Scene",
    fields: [
      { key: "title", label: "Scene title", type: "text" },
      { key: "chapter", label: "Chapter", type: "text" },
      { key: "objective", label: "Objective", type: "textarea" },
      { key: "conflict", label: "Conflict", type: "textarea" },
      { key: "outcome", label: "Outcome", type: "textarea" },
    ],
    onChange: () => saveState(),
    onDelete: (id) => {
      state.scenes = state.scenes.filter((item) => item.id !== id);
      saveState();
      renderScenes();
    },
  });
}

function renderPlotPointers() {
  renderCollection(ui.plotList, state.plotPointers, {
    titleLabel: "Pointer",
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "detail", label: "Detail", type: "textarea" },
      { key: "payoff", label: "Payoff", type: "textarea" },
    ],
    onChange: () => {
      saveState();
      renderConnections();
    },
    onDelete: (id) => {
      state.plotPointers = state.plotPointers.filter((item) => item.id !== id);
      state.connections = state.connections.filter((link) => link.from !== id && link.to !== id);
      saveState();
      renderPlotPointers();
      renderConnections();
    },
  });
}

function renderTags() {
  renderCollection(ui.tagList, state.tags, {
    titleLabel: "Tag",
    fields: [
      { key: "name", label: "Tag name", type: "text" },
      { key: "color", label: "Color", type: "text" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    onChange: () => {
      saveState();
      paintTagSummary();
    },
    onDelete: (id) => {
      state.tags = state.tags.filter((item) => item.id !== id);
      saveState();
      renderTags();
    },
  });
  paintTagSummary();
}

function paintTagSummary() {
  ui.tagSummary.innerHTML = "";
  state.tags.forEach((tag) => {
    const pill = document.createElement("span");
    pill.className = "tag-pill";
    pill.style.background = `${tag.color}33`;
    pill.innerHTML = `<strong>${escapeHtml(tag.name)}</strong><span>${escapeHtml(tag.notes)}</span>`;
    ui.tagSummary.appendChild(pill);
  });
}

function renderConnections() {
  const nodes = [
    ...state.characters.map((character, index) => ({
      id: character.id,
      label: character.name,
      type: character.role,
      x: 40 + (index % 2) * 220,
      y: 40 + Math.floor(index / 2) * 180,
    })),
    ...state.plotPointers.map((pointer, index) => ({
      id: pointer.id,
      label: pointer.label,
      type: "Plot pointer",
      x: 460 + (index % 2) * 220,
      y: 40 + Math.floor(index / 2) * 180,
    })),
  ];

  ui.mindMap.innerHTML = "";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 900 700");

  state.connections.forEach((connection) => {
    const from = nodes.find((node) => node.id === connection.from);
    const to = nodes.find((node) => node.id === connection.to);
    if (!from || !to) return;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(from.x + 75));
    line.setAttribute("y1", String(from.y + 44));
    line.setAttribute("x2", String(to.x + 75));
    line.setAttribute("y2", String(to.y + 44));
    line.setAttribute("stroke", connection.type === "character" ? "#9f4328" : "#d0a75f");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");
    svg.appendChild(line);
  });

  ui.mindMap.appendChild(svg);

  nodes.forEach((node) => {
    const box = document.createElement("div");
    box.className = "map-node";
    box.style.left = `${node.x}px`;
    box.style.top = `${node.y}px`;
    box.innerHTML = `<strong>${escapeHtml(node.label)}</strong><span>${escapeHtml(node.type)}</span>`;
    ui.mindMap.appendChild(box);
  });

  renderConnectionList();
}

function renderConnectionList() {
  ui.connectionList.innerHTML = "";
  state.connections.forEach((connection) => {
    const card = document.createElement("div");
    card.className = "item-card";

    const fromLabel = resolveEntityName(connection.from);
    const toLabel = resolveEntityName(connection.to);

    card.innerHTML = `
      <header>
        <strong>${escapeHtml(connection.label)}</strong>
        <div class="item-card-actions">
          <button class="small-button" data-action="delete">Delete</button>
        </div>
      </header>
      <label>From</label>
      <select data-key="from">${renderEntityOptions(connection.from)}</select>
      <label>To</label>
      <select data-key="to">${renderEntityOptions(connection.to)}</select>
      <label>Type</label>
      <select data-key="type">
        <option value="character" ${connection.type === "character" ? "selected" : ""}>Character</option>
        <option value="plot" ${connection.type === "plot" ? "selected" : ""}>Plot</option>
      </select>
      <label>Connection label</label>
      <input data-key="label" type="text" value="${escapeAttribute(connection.label)}" />
      <p class="muted">${escapeHtml(fromLabel)} -> ${escapeHtml(toLabel)}</p>
    `;

    card.querySelectorAll("[data-key]").forEach((input) => {
      input.addEventListener("input", (event) => {
        connection[event.target.dataset.key] = event.target.value;
        saveState();
        renderConnections();
      });
    });

    card.querySelector("[data-action='delete']").addEventListener("click", () => {
      state.connections = state.connections.filter((item) => item.id !== connection.id);
      saveState();
      renderConnections();
    });

    ui.connectionList.appendChild(card);
  });
}

function renderEntityOptions(selectedId) {
  const entities = [
    ...state.characters.map((item) => ({ id: item.id, label: `${item.name} (Character)` })),
    ...state.plotPointers.map((item) => ({ id: item.id, label: `${item.label} (Plot)` })),
  ];
  return entities
    .map(
      (entity) =>
        `<option value="${escapeAttribute(entity.id)}" ${
          entity.id === selectedId ? "selected" : ""
        }>${escapeHtml(entity.label)}</option>`,
    )
    .join("");
}

function renderCharacters() {
  ui.characterList.innerHTML = "";
  state.characters.forEach((character) => {
    const button = document.createElement("button");
    button.className = character.id === state.activeCharacterId ? "active" : "";
    button.innerHTML = `<strong>${escapeHtml(character.name)}</strong><br /><span>${escapeHtml(
      character.role,
    )}</span>`;
    button.addEventListener("click", () => {
      state.activeCharacterId = character.id;
      saveState();
      renderCharacters();
    });
    ui.characterList.appendChild(button);
  });

  const activeCharacter = state.characters.find((character) => character.id === state.activeCharacterId);
  if (!activeCharacter) {
    ui.characterEmpty.classList.remove("hidden");
    ui.characterDetail.classList.add("hidden");
    return;
  }

  ui.characterEmpty.classList.add("hidden");
  ui.characterDetail.classList.remove("hidden");
  ui.characterDetail.innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Character Analysis</p>
        <h3>${escapeHtml(activeCharacter.name)}</h3>
      </div>
      <button id="delete-character" class="ghost-button">Delete Character</button>
    </div>
    <div class="analysis-grid">
      <div>
        <label>Name</label>
        <input data-key="name" type="text" value="${escapeAttribute(activeCharacter.name)}" />
      </div>
      <div>
        <label>Role</label>
        <input data-key="role" type="text" value="${escapeAttribute(activeCharacter.role)}" />
      </div>
      <div>
        <label>Archetype</label>
        <input data-key="archetype" type="text" value="${escapeAttribute(activeCharacter.archetype)}" />
      </div>
      <div>
        <label>Arc</label>
        <input data-key="arc" type="text" value="${escapeAttribute(activeCharacter.arc)}" />
      </div>
    </div>
    <label>Desire</label>
    <textarea data-key="desire">${escapeHtml(activeCharacter.desire)}</textarea>
    <label>Fear</label>
    <textarea data-key="fear">${escapeHtml(activeCharacter.fear)}</textarea>
    <label>Contradiction</label>
    <textarea data-key="contradiction">${escapeHtml(activeCharacter.contradiction)}</textarea>
    <label>Relationships</label>
    <textarea data-key="relationships">${escapeHtml(activeCharacter.relationships)}</textarea>
    <label>Analysis</label>
    <textarea data-key="analysis">${escapeHtml(activeCharacter.analysis)}</textarea>
  `;

  ui.characterDetail.querySelectorAll("[data-key]").forEach((field) => {
    field.addEventListener("input", (event) => {
      activeCharacter[event.target.dataset.key] = event.target.value;
      saveState();
      renderCharacters();
      renderConnections();
    });
  });

  ui.characterDetail.querySelector("#delete-character").addEventListener("click", () => {
    state.characters = state.characters.filter((character) => character.id !== activeCharacter.id);
    state.connections = state.connections.filter(
      (connection) => connection.from !== activeCharacter.id && connection.to !== activeCharacter.id,
    );
    state.activeCharacterId = state.characters[0]?.id ?? null;
    saveState();
    renderCharacters();
    renderConnections();
  });
}

function renderCollection(root, items, config) {
  root.innerHTML = "";
  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "item-card";

    const fieldsMarkup = config.fields
      .map((field) => {
        if (field.type === "textarea") {
          return `
            <label>${field.label}</label>
            <textarea data-key="${field.key}">${escapeHtml(item[field.key] ?? "")}</textarea>
          `;
        }

        return `
          <label>${field.label}</label>
          <input data-key="${field.key}" type="text" value="${escapeAttribute(item[field.key] ?? "")}" />
        `;
      })
      .join("");

    card.innerHTML = `
      <header>
        <strong>${config.titleLabel} ${index + 1}</strong>
        <div class="item-card-actions">
          ${
            config.onReorder
              ? `<button class="small-button" data-action="up">Up</button>
                 <button class="small-button" data-action="down">Down</button>`
              : ""
          }
          <button class="small-button" data-action="delete">Delete</button>
        </div>
      </header>
      ${fieldsMarkup}
    `;

    card.querySelectorAll("[data-key]").forEach((input) => {
      input.addEventListener("input", (event) => {
        item[event.target.dataset.key] = event.target.value;
        config.onChange();
      });
    });

    const deleteButton = card.querySelector("[data-action='delete']");
    deleteButton.addEventListener("click", () => config.onDelete(item.id));

    if (config.onReorder) {
      card.querySelector("[data-action='up']").addEventListener("click", () => {
        if (index === 0) return;
        const nextItems = [...items];
        [nextItems[index - 1], nextItems[index]] = [nextItems[index], nextItems[index - 1]];
        config.onReorder(nextItems);
      });

      card.querySelector("[data-action='down']").addEventListener("click", () => {
        if (index === items.length - 1) return;
        const nextItems = [...items];
        [nextItems[index + 1], nextItems[index]] = [nextItems[index], nextItems[index + 1]];
        config.onReorder(nextItems);
      });
    }

    root.appendChild(card);
  });
}

function renderMarkdown(markdown) {
  const escaped = escapeHtml(markdown);
  return escaped
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith("# ")) return `<h1>${block.slice(2)}</h1>`;
      if (block.startsWith("## ")) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith("> ")) return `<blockquote>${block.slice(2)}</blockquote>`;
      if (block.split("\n").every((line) => line.startsWith("- "))) {
        const items = block
          .split("\n")
          .map((line) => `<li>${line.slice(2)}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${inlineMarkdown(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

function inlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>");
}

function resolveEntityName(id) {
  return (
    state.characters.find((item) => item.id === id)?.name ??
    state.plotPointers.find((item) => item.id === id)?.label ??
    "Unknown"
  );
}

function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(state.projectTitle)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importState(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result));
      Object.keys(state).forEach((key) => delete state[key]);
      Object.assign(state, imported);
      saveState();
      renderNav();
      renderAll();
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}
