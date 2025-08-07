
// Function to detect mobile devices
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent) || (window.innerWidth <= 800 && window.innerHeight <= 800);
}

const fullName = document.getElementById("input");
const email = document.getElementById("email");
const number = document.getElementById("number");
const msg = document.getElementById("msg");
const form = document.getElementById("form");

function sendEmail() {

    const bodyMsg = `<b><h4>Name</h3></b> ${fullName.value} <br> <b><h4>Email</h3></b> ${email.value} <br> <b><h4>Phone Number</h3></b> ${number.value} <br> <b><h4>Message</h4></b> ${msg.value}`;

    Email.send({
        SecureToken: '406d7ee0-94a6-4de1-8aef-9219b718f68d',
        To: 'vanditkad@gmail.com',
        From: "vanditkad@gmail.com",
        Subject: `${fullName.value} would like to contact you`,
        Body: bodyMsg
    }).then(
    message => {
        if (message === "OK") {
            alert(`${fullName.value}, your message was sent successfully!`);
            form.reset();
        } else {
            alert("Something went wrong: " + message);
            console.error("Email sending failed:", message);
        }
    }
).catch(
    error => {
        alert("Email sending failed. Check console.");
        console.error("SMTP.js error:", error);
    }
);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendEmail()
})
