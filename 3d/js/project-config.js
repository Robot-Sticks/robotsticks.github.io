
function randomizeProjectCode() {

    const characters = "1234567890";
    const code = Array.from({ length: 20 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
    const newProjectCode = new Date().toISOString().slice(0, 10).replace(/-/g, "") + code;
    return newProjectCode;
}

const startBuildingLink = document.getElementById("start-building-button");
startBuildingLink.href = `3d?p=${randomizeProjectCode()}`;

