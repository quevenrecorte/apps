document.querySelectorAll(".tab-btn").forEach(button => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

    this.classList.add("active");
    document.getElementById(this.dataset.tab + "-tab").classList.add("active");
  });
});

async function loadData(file, containerId, type) {
  const res = await fetch(file);
  const data = await res.json();
  const container = document.getElementById(containerId);

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = item.name.toLowerCase();

    let link = "";
    let icon = "📦";

    if (type === "app") {
      link = item.url;

      if (item.name === "Lighthouse") icon = "🏠";
      else if (item.name === "Hermes") icon = "📩";
      else if (item.name === "Aegis") icon = "🔐";
      else icon = "🌐";
    }

    if (type === "business") {
  link = item.url;
  icon = "🏢";
}

if (type === "server") {
  link = item.url;
  icon = "🖥️";
}

    if (type === "batch") {
      link = item.file;
      icon = "📄";
    }

    if (type === "link") {
      link = item.url;
      icon = "🔗";
    }

    if (item.name === "Router") icon = "🌐";
if (item.name === "AdGuard") icon = "🛡️";

    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.target = "_blank";

    if (type === "batch") {
      anchor.setAttribute("download", "");
    }

    anchor.innerHTML = `
      <div class="icon">${icon}</div>
      <h3>${item.name}</h3>
    `;

    card.appendChild(anchor);
    container.appendChild(card);
  });
}

loadData("data/apps.json", "apps-list", "app");
loadData("data/batchfiles.json", "batch-list", "batch");
loadData("data/links.json", "links-list", "link");
loadData("data/business.json", "business-list", "business");
loadData("data/homeserver.json", "server-list", "server");

document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const name = card.dataset.name;
    if (name.includes(value)) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
});