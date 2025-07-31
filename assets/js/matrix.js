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

document.addEventListener('keydown', (e) => {
    let selector;

    // First try to match by data-code for special keys
    const codeMatch = document.querySelector(`.key[data-code="${e.code}"]`);
    if (codeMatch) {
        selector = codeMatch;
    } else {
        // fallback: match by text content for regular keys
        const key = e.key.length === 1 ? e.key : {
            ' ': 'space',
            'Enter': 'return',
            'Backspace': 'delete',
            'Tab': 'tab',
            'CapsLock': 'caps lock',
            'Shift': 'shift',
            'Control': 'control',
            'Alt': 'option',
            'Meta': 'command',
            'Escape': 'esc',
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
        }[e.key] || e.key;

        selector = Array.from(document.querySelectorAll('.key')).find(el =>
            el.textContent.trim().toLowerCase() === key.toLowerCase()
        );
    }

    if (selector) {
        selector.classList.add('active');
        setTimeout(() => {
            selector.classList.remove('active');
        }, 100);
    }
});