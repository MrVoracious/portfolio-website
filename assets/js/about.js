const achievmentDivs = document.getElementsByClassName("achievment")
const achievmentsContainer = document.getElementById("achievmentsContainer")
function styleAchievments() {
    for (let i = 0; i < achievmentDivs.length; i++) {
        const e = achievmentDivs[i];
        achievmentsContainer.scrollTop = 0;
        achievmentsContainer.style.overflow = "hidden"
        e.style.zIndex = `${achievmentDivs.length - i}`;
        if (i > 0) {
            e.style.top = `${(i * 12.5) + 15}%`;
            if (i > 4) {
                e.style.filter = `brightness(${0.2})`;
            } else {
                e.style.filter = `brightness(${1 - i * 0.15 - 0.2})`;
            }
            e.style.transform = `scale(${1 - (i * 0.025)})`;
        }
    }
}
function achievmentMouseIn() {
    for (let i = 0; i < achievmentDivs.length; i++) {
        const e = achievmentDivs[i];
        if (i > 0) {
            e.style.top = `${(i * 12.5) + 20}%`;
        }
    }
}
function achievmentMouseOut() {
    styleAchievments()
}

function achievmentClick() {
    for (let i = 0; i < achievmentDivs.length; i++) {
        const e = achievmentDivs[i];
        achievmentsContainer.style.overflow = "overlay"
        if (i > 0) {
            e.style.top = `calc(${75 * i}px + ${0.5 * i}vh)`;
            e.style.filter = `brightness(1)`;
            e.style.transform = `scale(1)`;
        }
    }
}

styleAchievments()
achievmentsContainer.addEventListener('mouseenter', achievmentMouseIn);
achievmentsContainer.addEventListener('mouseleave', achievmentMouseOut);

const githubUsername = "MrVoracious";

// --------------------- Contributions Grid ---------------------
fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}`)
    .then(res => res.json())
    .then(data => {
        const grid = document.getElementById("contrib-grid");
        const display = document.getElementById("contributions");
        const year = new Date().getFullYear();
        const today = new Date();

        // Filter only current year contributions up to today
        const days = data.contributions.filter(day => {
            const date = new Date(day.date);
            return date.getFullYear() === year && date <= today;
        });

        // Show total count by default
        const total = days.reduce((sum, day) => sum + day.count, 0);
        display.textContent = `${total} contributions in ${year}`;

        // Render column-wise (top-down like GitHub)
        let weekCol = [];
        for (let i = 0; i < days.length; i++) {
            weekCol.push(days[i]);
            const dayOfWeek = new Date(days[i].date).getDay(); // 0 = Sunday
            const isEndOfWeek = dayOfWeek === 6 || i === days.length - 1;

            if (isEndOfWeek) {
                for (let j = 0; j < 7; j++) {
                    const day = weekCol.find(d => new Date(d.date).getDay() === j);
                    const div = document.createElement("div");
                    div.className = "contrib";

                    if (day) {
                        div.dataset.count = Math.min(day.count, 8);
                        div.dataset.date = `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`;

                        div.addEventListener("mouseenter", () => {
                            display.textContent = div.dataset.date;
                        });
                        div.addEventListener("mouseleave", () => {
                            display.textContent = `${total} contributions in ${year}`;
                        });
                    } else {
                        div.dataset.count = 0;
                        div.dataset.date = `No contributions`;

                        div.addEventListener("mouseenter", () => {
                            display.textContent = `No contributions`;
                        });
                        div.addEventListener("mouseleave", () => {
                            display.textContent = `${total} contributions in ${year}`;
                        });
                    }

                    grid.appendChild(div);
                }
                weekCol = [];
            }
        }
    });


// --------------------- Last Pushed Date ---------------------
fetch(`https://api.github.com/users/${githubUsername}/events/public`)
    .then(res => res.json())
    .then(events => {
        const pushEvent = events.find(e => e.type === "PushEvent");
        const lastPushed = document.getElementById("lastPushed");

        if (pushEvent) {
            const pushedDate = new Date(pushEvent.created_at);
            const formatted = pushedDate.toLocaleDateString(undefined, {
                year: "numeric", month: "short", day: "numeric"
            });
            lastPushed.textContent = `Last pushed on ${formatted}`;
        } else {
            lastPushed.textContent = "No recent pushes found.";
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("lastPushed").textContent = "Error fetching push data.";
    });

function loadSpotify() {
    fetch("https://portfolio-api-server-beta.vercel.app/api/now-playing")
        .then(res => res.json())
        .then(data => {
            const cover = document.getElementById("cover");
            const status = document.getElementById("status");
            const title = document.getElementById("title");
            const artist = document.getElementById("artist");
            const widget = document.getElementById("spotify-widget")

            cover.src = data.albumImageUrl || "";
            status.textContent = data.isPlaying ? "Now Playing" : "Last Played";
            title.textContent = data.title || "Unknown Title";
            artist.textContent = (data.artist || "Unknown Artist");

            if (data.songUrl) {
                widget.onclick = () => window.open(data.songUrl, "_blank");
            } else {
                widget.onclick = null;
            }
        })
        .catch(err => {
            document.getElementById("spotify-widget").innerHTML = "<p style='padding:10px;'>Could not load song 😢</p>";
            console.error("Spotify widget error:", err);
        });
}

loadSpotify();
setInterval(loadSpotify, 30000);



const playBar = document.getElementById("playBar");
const ball = document.getElementById("ball");
const nav = document.getElementById("options");
const funContainer = document.getElementById("funContainer")
let paddleWidth = 200;
const paddleHeight = funContainer.getBoundingClientRect().height;
playBar.style.height = paddleHeight + 'px';
playBar.style.width = funContainer.getBoundingClientRect().width + 'px';
let paddleX = funContainer.getBoundingClientRect().left;
let paddleOffets
let ballOffets;
let navOffets = nav.getBoundingClientRect()
const ballSize = 40;
const paddleSpeed = 100;
let gameStarted = false;
const highlight2 = document.getElementById("highlight2")
const highlight1 = document.getElementById("highlight1")
const elements = [highlight1, highlight2]
elements[0].style.width = navOffets.width + 'px';
elements[0].style.height = navOffets.height + 'px';
elements[1].style.width = navOffets.width + 'px';
elements[1].style.height = navOffets.height + 'px';

function highlightReset() {
    for (let i = 0; i < elements.length; i++) {
        const e = elements[i];
        e.style.transform = "translateX(-50%) translateY(-50%) scale(1)"
        e.style.opacity = '1';

    }
}

function highlightClick() {
    elements[0].style.transform = "scale(1.15) translateX(-50%) translateY(-50%)"
    elements[1].style.transform = "scale(1.25) translateX(-50%) translateY(-50%)"
    for (let i = 0; i < elements.length; i++) {
        const e = elements[i];
        e.style.opacity = '1';
    }
}

highlightReset()

let ballX, ballY, velX, velY;
let gameInterval = null;

function setPaddlePosition(x) {
    paddleX = Math.max(0, Math.min(window.innerWidth - paddleWidth, x));
    playBar.style.left = paddleX + "px";
}

function startGame() {
    gameStarted = true;
    playBar.textContent = "";
    ball.style.display = "block";
    paddleWidth = 200;
    paddleX = funContainer.getBoundingClientRect().left + (funContainer.getBoundingClientRect().width / 2) - paddleWidth / 2;
    playBar.style.width = paddleWidth + 'px';
    setPaddlePosition(paddleX);
    // nav.style.transform = "scale(1.5) translateY(25%)"

    ballX = window.innerWidth / 2;
    ballY = window.innerHeight / 2;
    velX = 4;
    velY = 5;
    gameInterval = setInterval(gameLoop, 10);
}

function gameLoop() {

    paddleOffets = playBar.getBoundingClientRect()
    ballOffets = ball.getBoundingClientRect()
    navOffets = nav.getBoundingClientRect()
    ballX += velX;
    ballY += velY;

    // Bounce off walls
    if (ballX <= 0 || ballX + ballSize >= window.innerWidth) velX *= -1;
    if (ballY <= 0) velY *= -1;

    // Collision detection
    // const paddleTop = window.innerHeight - 40;
    const paddleTop = paddleOffets.top
    const paddleBottom = paddleTop + paddleHeight;

    const ballBottom = ballY + ballSize;
    const ballCenterX = ballX + ballSize / 2;
    const ballCenterY = ballY + ballSize / 2;

    if (
        ballBottom >= paddleTop &&
        ballCenterX >= paddleX &&
        ballCenterX <= paddleX + paddleWidth &&
        ballCenterY <= paddleOffets.top
    ) {
        velY *= -1;
        ballY = paddleTop - ballSize - 1; // Prevent overlap
    } else if (
        ballBottom >= paddleTop &&
        ballOffets.left <= paddleOffets.right &&
        ballCenterX >= paddleOffets.right
    ) {
        velX *= -1;
        ballX = paddleOffets.right + 1; // Prevent overlap
    } else if (
        ballBottom >= paddleTop &&
        ballOffets.right >= (paddleOffets.left) &&
        ballCenterX <= (paddleOffets.left)
    ) {
        velX *= -1;
        ballX = paddleOffets.left - ballSize - 1; // Prevent overlap
    }

    if (
        ballOffets.top <= navOffets.bottom &&
        ballOffets.left >= navOffets.left &&
        ballOffets.right <= navOffets.right &&
        ballCenterY >= navOffets.bottom
    ) {
        velY *= -1;
        ballY = navOffets.bottom + 1; // Prevent overlap
        highlightClick()
        setTimeout(() => {
            highlightReset()
        }, 300);
    }
    else if (
        ballOffets.top <= navOffets.bottom &&
        ballOffets.left <= navOffets.right &&
        ballCenterX >= navOffets.right
    ) {
        velX *= -1;
        ballX = navOffets.right + 1; // Prevent overlap
        highlightClick()
        setTimeout(() => {
            highlightReset()
        }, 300);
    } else if (
        ballOffets.top <= navOffets.bottom &&
        ballOffets.right >= navOffets.left &&
        ballCenterX <= navOffets.left
    ) {
        velX *= -1;
        ballX = navOffets.left - ballSize - 1; // Prevent overlap
        highlightClick()
        setTimeout(() => {
            highlightReset()
        }, 300);
    }

    // Game Over
    if (ballY > window.innerHeight) {
        clearInterval(gameInterval);
        alert("Game Over");
        resetGame();
        return;
    }

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

function resetGame() {
    gameStarted = false;
    ball.style.display = "none";
    playBar.textContent = "PLAY";
    playBar.style.width = funContainer.getBoundingClientRect().width + 'px';
    setPaddlePosition(funContainer.getBoundingClientRect().left)
    gameInterval = null;
}

playBar.addEventListener("click", () => {
    if (!gameInterval) startGame();
});

document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    if (!gameStarted) return;
    setPaddlePosition(mouseX - (paddleWidth / 2));
});

// Set initial position
setPaddlePosition(paddleX);