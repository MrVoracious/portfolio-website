const achievmentDivs = document.getElementsByClassName("achievment")
const achievmentsContainer = document.getElementById("achievmentsContainer")
const helper = document.getElementById("helper")

function styleAchievments() {
    for (let i = 0; i < achievmentDivs.length; i++) {
        const e = achievmentDivs[i];
        achievmentsContainer.scrollTop = 0;
        achievmentsContainer.style.overflow = "visible"
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
    helper.style.pointerEvents = "all"
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
    helper.style.pointerEvents = "none"
    for (let i = 0; i < achievmentDivs.length; i++) {
        const e = achievmentDivs[i];
        achievmentsContainer.style.overflow = "scroll"
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
    const spotifyLoader = document.getElementById("spotifyCardContent")
    setTimeout(() => {
        spotifyLoader.style.setProperty('--after-opacity', 0);
    }, 1250);
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
const github = document.getElementById("github");
github.style.willChange = "transform";
github.style.backfaceVisibility = "hidden";
github.style.transform = "translateZ(0)";
const githubContent = document.getElementById("githubContent");
const githubOffset = github.getBoundingClientRect();
const ball = document.getElementById("github");
const nav = document.getElementById("options");
const funContainer = document.getElementById("funContainer");
let paddleWidth = 200;
const paddleHeight = funContainer.getBoundingClientRect().height;
playBar.style.height = paddleHeight + 'px';
playBar.style.width = funContainer.getBoundingClientRect().width + 'px';
let paddleX = funContainer.getBoundingClientRect().left;
let navOffets = nav.getBoundingClientRect();
const ballSize = 40;
const paddleSpeed = 100;
let gameStarted = false;
const highlight2 = document.getElementById("highlight2");
const highlight1 = document.getElementById("highlight1");
const elements = [highlight1, highlight2];
elements.forEach(el => {
    el.style.width = navOffets.width + 'px';
    el.style.height = navOffets.height + 'px';
});

let ballX, ballY, velX, velY;
let animationFrame = null;

const gitHeight = githubOffset.height;
const gitWidth = githubOffset.width;
const gitLeft = githubOffset.left;
const gitTop = githubOffset.top;

function resetGithub(transition) {
    if (transition) {
        github.style.transition = "left 300ms ease-out, top 300ms ease-out, width 300ms ease-out, height 300ms ease-out, background 300ms ease-out, border-radius 300ms ease-out";
        setTimeout(() => {
            github.style.transition = "none";
        }, 300);
    }
    github.style.position = "absolute";
    github.style.left = gitLeft + "px";
    github.style.top = gitTop + "px";
    github.style.height = gitHeight + "px";
    github.style.width = gitWidth + "px";
    githubContent.style.background = "#101010";
    github.style.borderRadius = "20px";
}

function gitBall(transition) {
    if (transition) {
        github.style.transition = "left 300ms ease-out, top 300ms ease-out, width 300ms ease-out, height 300ms ease-out, background 300ms ease-out, border-radius 300ms ease-out";
        setTimeout(() => {
            github.style.transition = "none";
        }, 300);
    }
    github.style.height = ballSize + "px";
    github.style.width = ballSize + "px";
    githubContent.style.background = "#ffffff";
    github.style.borderRadius = "100000px";
}

function highlightReset() {
    elements.forEach(e => {
        e.classList.remove("highlight-active");
    });
}

function highlightClick() {
    velX += velX > 0 ? 1 : -1;
    velY += velY > 0 ? 1 : -1;
    elements.forEach(e => {
        e.classList.add("highlight-active");
    });
    setTimeout(() => {
        highlightReset();
    }, 300);
}

function setPaddlePosition(x) {
    paddleX = Math.max(0, Math.min(window.innerWidth - paddleWidth, x));
    playBar.style.transform = `translateX(${paddleX}px)`;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

resetGithub(false);

function startGame() {
    gitBall(true);
    gameStarted = true;
    playBar.textContent = "";
    paddleWidth = 200;
    paddleX = funContainer.getBoundingClientRect().left + (funContainer.getBoundingClientRect().width / 2) - paddleWidth / 2;
    playBar.style.width = paddleWidth + 'px';
    setPaddlePosition(paddleX);
    playBar.style.border = "1px solid #545454";
    playBar.style.background = "#ffffffff";
    velX = Math.random() < 0.5 ? randInt(-10, -5) : randInt(5, 10);
    velY = Math.random() < 0.5 ? randInt(-3, -2) : randInt(2, 3);

    const ballRect = ball.getBoundingClientRect();
    ballX = ballRect.left;
    ballY = ballRect.top;

    animationFrame = requestAnimationFrame(gameLoop);
}

function moveBall() {
    const steps = Math.ceil(Math.max(Math.abs(velX), Math.abs(velY)));
    const stepX = velX / steps;
    const stepY = velY / steps;

    for (let i = 0; i < steps; i++) {
        ballX += stepX;
        ballY += stepY;
        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";
        checkCollisions();
    }
}

function gameLoop() {
    if (ballX <= 0 || ballX + ballSize >= window.innerWidth) velX *= -1;
    if (ballY <= 0) velY *= -1;

    if (ballY > window.innerHeight) {
        cancelAnimationFrame(animationFrame);
        alert("Game Over");
        resetGame();
        return;
    }

    moveBall();
    animationFrame = requestAnimationFrame(gameLoop);
}

function resetGame() {
    gameStarted = false;
    animationFrame = null;
    resetGithub(true);
    playBar.innerHTML = `
        <div class="card-content">
            PLAY
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640">
                <path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"/>
            </svg>
        </div>
    `;
    playBar.style.width = funContainer.getBoundingClientRect().width + 'px';
    setPaddlePosition(funContainer.getBoundingClientRect().left);
    playBar.style.border = "1px solid var(--border)";
    playBar.style.background = "#101010";
}

playBar.addEventListener("click", () => {
    if (!animationFrame) startGame();
});

document.addEventListener("mousemove", (event) => {
    if (!gameStarted) return;
    setPaddlePosition(event.clientX - paddleWidth / 2);
});

setPaddlePosition(paddleX);

function checkCollisions() {
    const paddleOffets = playBar.getBoundingClientRect();
    const navOffets = nav.getBoundingClientRect();
    const paddleTop = paddleOffets.top;
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
        ballY = paddleTop - ballSize - Math.abs(velY);
    } else if (
        ballBottom >= paddleTop &&
        ballX <= paddleOffets.right &&
        ballCenterX >= paddleOffets.right
    ) {
        velX *= -1;
        ballX = paddleOffets.right + Math.abs(velX);
    } else if (
        ballBottom >= paddleTop &&
        ballX + ballSize >= paddleOffets.left &&
        ballCenterX <= paddleOffets.left
    ) {
        velX *= -1;
        ballX = paddleOffets.left - ballSize - Math.abs(velX);
    }

    if (
        ballY <= navOffets.bottom &&
        ballX >= navOffets.left &&
        ballX + ballSize <= navOffets.right &&
        ballCenterY >= navOffets.bottom
    ) {
        velY *= -1;
        ballY = navOffets.bottom + Math.abs(velY);
        highlightClick();
    } else if (
        ballY <= navOffets.bottom &&
        ballX <= navOffets.right &&
        ballCenterX >= navOffets.right
    ) {
        velX *= -1;
        ballX = navOffets.right + Math.abs(velX);
        highlightClick();
    } else if (
        ballY <= navOffets.bottom &&
        ballX + ballSize >= navOffets.left &&
        ballCenterX <= navOffets.left
    ) {
        velX *= -1;
        ballX = navOffets.left - ballSize - Math.abs(velX);
        highlightClick();
    }
}

document.getElementById("cards").onmousemove = e => {
    for (const card of document.getElementsByClassName("card")) {
        const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };
}