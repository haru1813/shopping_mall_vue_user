if (/Android|iPhone/i.test(navigator.userAgent)) {
    const pc = document.getElementById("app");
    pc.style.display = 'none';
}
else {
    const pc = document.getElementById("app");
    pc.style.width = (screen.width + 0) + "px";
    pc.style.display = 'block';
}