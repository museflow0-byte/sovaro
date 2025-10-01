
const $ = (s) => document.querySelector(s);
const startBtn = $("#start");
const statusEl = $("#status");
const outBox = $("#out");
const aClient = $("#link-client");
const aModel  = $("#link-model");
const aMgr    = $("#link-manager");

startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;
  outBox.style.display = "none";
  statusEl.innerHTML = "Creating room…";

  try {
    const body = {
      durationMinutes: Number($("#duration").value || 30),
      clientName: $("#client").value || "Client",
      managerName: $("#manager").value || "Manager",
      modelName: $("#model").value || "Model",
    };

    const resp = await fetch("/api/create-call", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(body),
    });
    const data = await resp.json();

    if (!resp.ok || !data.ok) {
      throw new Error(data?.error || "Failed to create room");
    }

    aClient.textContent = `Client: ${data.links.client}`;
    aClient.href = data.links.client;

    aModel.textContent = `Model:  ${data.links.model}`;
    aModel.href = data.links.model;

    aMgr.textContent = `Manager: ${data.links.manager}`;
    aMgr.href = data.links.manager;

    outBox.style.display = "block";
    statusEl.innerHTML = `<span class="ok">Room ready.</span> Expires at <b>${new Date(data.exp*1000).toLocaleString()}</b>`;
  } catch (e) {
    statusEl.innerHTML = `<span class="err">${e.message}</span>`;
  } finally {
    startBtn.disabled = false;
  }
});
