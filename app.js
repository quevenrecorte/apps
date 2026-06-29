function showTab(tab) {
  document.querySelectorAll(".tab-content").forEach(el => {
    el.classList.remove("active");
  });

  document.querySelectorAll(".tab-btn").forEach(el => {
    el.classList.remove("active");
  });

  document.getElementById(tab + "-tab").classList.add("active");

  event.target.classList.add("active");
}

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
      icon = "🌐";
    }

    if (type === "batch") {
      link = item.file;
      icon = "📄";
    }

    if (type === "link") {
      link = item.url;
      icon = "🔗";
    }

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