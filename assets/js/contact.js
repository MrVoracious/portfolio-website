
// Function to detect mobile devices
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent) || (window.innerWidth <= 800 && window.innerHeight <= 800);
}

const form = document.getElementById("form");

emailjs.init("UERsGRXdFfYb0cwRU");

function sendEmail() {
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;
    const msg = document.getElementById("msg").value;

    const templateParams = {
        fullName: fullName,
        email: email,
        number: number,
        msg: msg
    };

    emailjs.send("service_kjwr7b2", "template_iyk02on", templateParams)
        .then(function (response) {
            alert(`${fullName}, your message was sent successfully!`);
            document.getElementById("form").reset();
        }, function (error) {
            alert("Something went wrong. Check console.");
            console.error("EmailJS error:", error);
        });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendEmail()
})


