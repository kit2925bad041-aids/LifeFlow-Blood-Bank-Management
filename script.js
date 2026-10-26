const groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
async function api(url, opt = {}) {
  const r = await fetch(url, opt);
  return r.json();
}
function fd(f) {
  return new URLSearchParams(new FormData(f));
}
async function loadCounts() {
  try {
    let c = await api("counts"),
      total = 0;
    document.getElementById("countGrid").innerHTML = groups
      .map((g) => {
        let n = c[g] || 0;
        total += n;
        return `<div class="card"><b>${g}</b><span>${n} donor${n === 1 ? "" : "s"}</span></div>`;
      })
      .join("");
    document.getElementById("totalDonors").textContent = total;
  } catch (e) {
    document.getElementById("countGrid").textContent =
      "Database connection failed.";
  }
}
async function loadStock() {
  try {
    let s = await api("stock"),
      total = 0;
    document.getElementById("stockGrid").innerHTML = groups
      .map((g) => {
        let n = s[g] || 0;
        total += n;
        return `<div class="card"><b>${g}</b><span>${n} units available</span></div>`;
      })
      .join("");
    document.getElementById("totalUnits").textContent = total;
  } catch (e) {
    document.getElementById("stockGrid").textContent =
      "Database connection failed.";
  }
}
document.getElementById("donorForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let m = document.getElementById("donorMsg");
  let r = await api("donor", { method: "POST", body: fd(e.target) });
  m.textContent = r.message;
  if (r.success) {
    e.target.reset();
    loadCounts();
  }
});
async function searchDonors() {
  let g = document.getElementById("searchGroup").value;
  if (!g) return;
  let r = await api("search?bloodGroup=" + encodeURIComponent(g)),
    box = document.getElementById("results");
  if (!r.length) {
    box.innerHTML = "<p>No donors found for " + g + ".</p>";
    return;
  }
  box.innerHTML = r
    .map(
      (d) =>
        `<div class="donor-row"><b>${d.name}</b> · Age ${d.age} · ${d.gender || "Not specified"} · ${d.blood_group} · ${d.phone}</div>`,
    )
    .join("");
}
document.getElementById("stockForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let m = document.getElementById("stockMsg"),
    r = await api("stock", { method: "POST", body: fd(e.target) });
  m.textContent = r.message;
  if (r.success) {
    e.target.reset();
    loadStock();
  }
});
document.getElementById("requestForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let m = document.getElementById("requestMsg"),
    r = await api("request", { method: "POST", body: fd(e.target) });
  m.textContent = r.message;
  if (r.success) {
    e.target.reset();
    loadStock();
  }
});
loadCounts();
loadStock();
