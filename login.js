const CLIENT_ID = "1439239509521989745";
const REDIRECT_URI = "https://bumpx.pages.dev/panel.html";


function loginDiscord() {
    const url =
        "https://discord.com/oauth2/authorize" +
        `?client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&response_type=token` +
        `&scope=identify`;

    window.location.href = url;
}
