
const firebaseConfig = {
    apiKey: "AIzaSyBpC5ylWSWkPDLNKCbJdKqJRRKZmMktEFE",
    authDomain: "portfolio-5b4ef.firebaseapp.com",
    databaseURL: "https://portfolio-5b4ef-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "portfolio-5b4ef",
    storageBucket: "portfolio-5b4ef.appspot.com",
    messagingSenderId: "322498260419",
    appId: "1:322498260419:web:3e37475d0b45a79276a176",
    measurementId: "G-XDRT6KB0N0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ Utility: sanitize key for Firebase
function sanitizeKey(key) {
    return key.toUpperCase().replace(/[.#$\[\]]/g, ""); // remove invalid Firebase characters
}

// ✅ Load key counts (DON'T create them here)
firebase.database().ref("keyCounts").once("value").then(snapshot => {
    const data = snapshot.val() || {};
    document.querySelectorAll(".key").forEach(keyEl => {
        const code = keyEl.getAttribute("data-code");
        if (!code) return; // skip keys without a code

        const safeKey = sanitizeKey(code);
        const count = data[safeKey] ?? 0;
        keyEl.setAttribute("data-count", count);
        updateKeyClass(keyEl, count);
    });
});


// ✅ Key press listener and count increment
document.addEventListener("keydown", (e) => {
    let selector;

    // First try to match special keys using data-code
    const codeMatch = document.querySelector(`.key[data-code="${e.code}"]`);
    if (codeMatch) {
        selector = codeMatch;
    } else {
        const key = e.key.length === 1 ? e.key : {
            " ": "space",
            "Enter": "return",
            "Backspace": "delete",
            "Tab": "tab",
            "CapsLock": "caps lock",
            "Shift": "shift",
            "Control": "control",
            "Alt": "option",
            "Meta": "command",
            "Escape": "esc",
            "ArrowUp": "up",
            "ArrowDown": "down",
            "ArrowLeft": "left",
            "ArrowRight": "right",
        }[e.key] || e.key;

        selector = Array.from(document.querySelectorAll(".key")).find(el =>
            el.textContent.trim().toLowerCase() === key.toLowerCase()
        );
    }

    if (selector) {
        selector.classList.add("active");
        setTimeout(() => {
            selector.classList.remove("active");
        }, 100);

        const code = e.code || selector.getAttribute("data-code") || selector.textContent.trim();
        const safeKey = sanitizeKey(code);
        const ref = firebase.database().ref("keyCounts/" + safeKey);


        ref.once("value").then(snapshot => {
            const current = snapshot.exists() ? snapshot.val() : 0;
            const updated = current + 1;
            ref.set(updated);
            selector.setAttribute("data-count", updated);
            updateKeyClass(selector, updated);
        }).catch(err => {
            console.error("Error updating count for", safeKey, err);
        });
    }
});

function updateKeyClass(el, count) {
    el.classList.remove("zeroCount", "normalCount", "fiftyCount");
    if (count === 0) {
        el.classList.add("zeroCount");
    }
}
