let timer;
const timeoutDuration = 5 * 60 * 1000;
function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    alert("You have been in active for too long");
    window.location.href = "/logout";
  }, timeoutDuration);
}

window.onload = resetTimer;
window.onmousemove = resetTimer;
window.onmousedown = resetTimer;
window.onclick = resetTimer;
window.onkeydown = resetTimer;
