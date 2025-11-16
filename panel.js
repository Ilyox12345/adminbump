// ============================
// CONFIG
// ============================
const API_BASE = "https://api.bumpx.fr";   // ⚠️ Mets ton vrai domaine API ici
const ADMIN_SECRET = "Bumpxxx@";           // Ton secret admin (même que ton bot)

// ============================
// TOKEN DISCORD (OAUTH2)
// ============================
const fragment = new URLSearchParams(window.location.hash.slice(1));
const accessToken = fragment.get("access_token");

// Si pas connecté → renvoie login
if (!accessToken) {
    window.location.href = "index.html";
}


// ============================
// RÉCUPÉRER USER DISCORD
// ============================
async function getDiscordUser() {
    const res = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    return res.json();
}


// ============================
// CHECK ADMIN PANEL
// ============================
async function isAdmin(id) {
    const res = await fetch(API_BASE + "/api/admins", {
        headers: { Authorization: "Bearer " + ADMIN_SECRET }
    });

    const data = await res.json();
    return data.admins.includes(id);
}


// ============================
// API HELPER
// ============================
async function api(url, method = "GET", body = null) {
    const response = await fetch(API_BASE + url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + ADMIN_SECRET
        },
        body: body ? JSON.stringify(body) : null
    });

    return response.json();
}


// ============================
// DÉCONNEXION
// ============================
function logout() {
    window.location.href = "index.html";
}


// ============================
// CHARGEMENT DU PANEL
// ============================
(async () => {
    const user = await getDiscordUser();
    const admin = await isAdmin(user.id);

    if (!admin) {
        document.body.innerHTML = `
            <div style="text-align:center;margin-top:80px;font-size:32px;color:red;">
                ❌ Accès refusé<br><br>
                Vous n'êtes pas administrateur de BumpX.
            </div>
        `;
        return;
    }

    // Affiche panel
    document.getElementById("loading").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    // Username Discord
    document.getElementById("username").textContent = user.username;

    loadAll();
})();


// ============================
// CHARGER TOUTES LES DONNÉES
// ============================
async function loadAll() {
    document.getElementById("botStats").textContent =
        JSON.stringify(await api("/api/bot/stats"), null, 2);

    document.getElementById("workerStats").textContent =
        JSON.stringify(await api("/api/worker"), null, 2);

    document.getElementById("adminList").textContent =
        JSON.stringify(await api("/api/admins"), null, 2);

    document.getElementById("bannedList").textContent =
        JSON.stringify(await api("/api/bump/banned"), null, 2);

    document.getElementById("bioList").textContent =
        JSON.stringify(await api("/api/bio/list"), null, 2);
}


// ============================
// ACTIONS ADMIN
// ============================

// Ajouter un admin
async function addAdmin() {
    const id = document.getElementById("addAdminId").value;
    await api("/api/admins/add", "POST", { user_id: id });
    loadAll();
}

// Retirer un admin
async function removeAdmin() {
    const id = document.getElementById("removeAdminId").value;
    await api("/api/admins/remove", "POST", { user_id: id });
    loadAll();
}

// Bannir un serveur
async function banServer() {
    const id = document.getElementById("banId").value;
    await api("/api/bump/ban", "POST", { server_id: id });
    loadAll();
}

// Débannir un serveur
async function unbanServer() {
    const id = document.getElementById("unbanId").value;
    await api("/api/bump/unban", "POST", { server_id: id });
    loadAll();
}

// Modifier une bio
async function updateBio() {
    const id = document.getElementById("bioServerId").value;
    const bio = document.getElementById("bioText").value;
    await api("/api/bio/update", "POST", { server_id: id, bio });
    loadAll();
}

// Supprimer une bio
async function removeBio() {
    const id = document.getElementById("bioRemoveId").value;
    await api("/api/bio/remove", "POST", { server_id: id });
    loadAll();
}
