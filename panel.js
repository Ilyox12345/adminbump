const API_BASE = "https://api.bumpx.com/stats";
const ADMIN_SECRET = "Bumpxxx@";

// récupérer token
const fragment = new URLSearchParams(window.location.hash.slice(1));
const accessToken = fragment.get("access_token");

if (!accessToken) window.location.href = "index.html";

// Récupérer l'utilisateur Discord
async function getDiscordUser() {
    const res = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return res.json();
}

// Vérifier si admin
async function isAdmin(id) {
    const res = await fetch(API_BASE + "/api/admins", {
        headers: { Authorization: "Bearer " + ADMIN_SECRET }
    });
    const data = await res.json();
    return data.admins.includes(id);
}

// API helper
async function api(url, method = "GET", body = null) {
    return fetch(API_BASE + url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + ADMIN_SECRET
        },
        body: body ? JSON.stringify(body) : null
    }).then(res => res.json());
}

// Déconnexion
function logout() {
    window.location.href = "index.html";
}

// Chargement panel
(async () => {
    const user = await getDiscordUser();
    const admin = await isAdmin(user.id);

    if (!admin) {
        document.body.innerHTML = "<h1>❌ Accès refusé</h1>";
        return;
    }

    // Affichage du panel
    document.getElementById("loading").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    document.getElementById("username").textContent = user.username;

    loadAll();
})();

// --------------------- ACTIONS ADMIN ---------------------

async function loadAll() {
    document.getElementById("botStats").textContent = JSON.stringify(await api("/api/bot/stats"), null, 2);
    document.getElementById("workerStats").textContent = JSON.stringify(await api("/api/worker"), null, 2);
    document.getElementById("adminList").textContent = JSON.stringify(await api("/api/admins"), null, 2);
    document.getElementById("bannedList").textContent = JSON.stringify(await api("/api/bump/banned"), null, 2);
    document.getElementById("bioList").textContent = JSON.stringify(await api("/api/bio/list"), null, 2);
}

async function addAdmin() {
    const id = document.getElementById("addAdminId").value;
    await api("/api/admins/add", "POST", { user_id: id });
    loadAll();
}

async function removeAdmin() {
    const id = document.getElementById("removeAdminId").value;
    await api("/api/admins/remove", "POST", { user_id: id });
    loadAll();
}

async function banServer() {
    const id = document.getElementById("banId").value;
    await api("/api/bump/ban", "POST", { server_id: id });
    loadAll();
}

async function unbanServer() {
    const id = document.getElementById("unbanId").value;
    await api("/api/bump/unban", "POST", { server_id: id });
    loadAll();
}

async function updateBio() {
    const id = document.getElementById("bioServerId").value;
    const bio = document.getElementById("bioText").value;
    await api("/api/bio/update", "POST", { server_id: id, bio });
    loadAll();
}

async function removeBio() {
    const id = document.getElementById("bioRemoveId").value;
    await api("/api/bio/remove", "POST", { server_id: id });
    loadAll();
}
