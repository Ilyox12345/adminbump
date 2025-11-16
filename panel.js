// ============================
// CONFIG
// ============================

// TON WORKER CLOUDFLARE
const API_BASE = "https://bumpxx.ilyesquibroute93.workers.dev";

// ============================
// TOKEN DISCORD (OAUTH2)
// ============================
const fragment = new URLSearchParams(window.location.hash.slice(1));
const accessToken = fragment.get("access_token");

// Si pas connecté → renvoie au login
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
// PANEL (pas d'admin pour le moment)
// ============================
function isAdmin() {
    // TON WORKER n’a pas de système d’admins
    return true; // accès autorisé pour toi, en attendant la vraie API
}


// ============================
// API pour récupérer les STATS du Worker
// ============================
async function getWorkerStats() {
    const res = await fetch(API_BASE + "/stats");
    return res.json();
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
    const admin = isAdmin();

    if (!admin) {
        document.body.innerHTML = `
            <div style="text-align:center;margin-top:80px;font-size:32px;color:red;">
                ❌ Accès refusé<br><br>
                Vous n'êtes pas administrateur.
            </div>
        `;
        return;
    }

    // Affiche le panel
    document.getElementById("loading").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    document.getElementById("username").textContent = user.username;

    loadAll();
})();


// ============================
// CHARGER LES STATS GLOBALES
// ============================
async function loadAll() {
    const workerStats = await getWorkerStats();

    document.getElementById("workerStats").textContent =
        JSON.stringify(workerStats, null, 2);
}

