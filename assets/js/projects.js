const container = document.querySelector('.projectsNameContainer');
const defaultDiv = document.getElementById("defaultdiv")
const defaultDivSpan = document.getElementById("defaultdivspan")
const projectsLogo = document.getElementById("projectsLogo")
let projectDiv;
let prologoActive = false;

projectsLogo.onmouseout = function () { if (!prologoActive) { bringSpans("projects") } }


document.querySelectorAll('.proLogo').forEach(div => {
    div.onmouseout = function () {
        if (!prologoActive) {
            projectDiv.querySelectorAll('span').forEach(span => {
                span.classList.remove("appear")
            });
        }
    }

    div.onmouseover = function () {
        if (!prologoActive) {
            if (defaultDivSpan.classList.contains("appear")) {
                defaultDiv.querySelectorAll('span').forEach(span => {
                    span.classList.remove("appear")
                });
            }

            bringSpans(this.dataset.projectName)
        }
    };

    div.onclick = function () {
        if (prologoActive) {
            projectDiv.querySelectorAll('span').forEach(span => {
                span.classList.remove("appear")
            });
            if (defaultDivSpan.classList.contains("appear")) {
                defaultDiv.querySelectorAll('span').forEach(span => {
                    span.classList.remove("appear")
                });
            }

            bringSpans(this.dataset.projectName)
        }
    };
});


bringSpans("projects")

function bringSpans(projectName) {
    const project = projectName
    const projectList = project.toUpperCase().split("");
    projectDiv = container.querySelector(`.${project}`);
    console.log(project)
    const middle = (projectList.length - 1) / 2;
    const spans = projectDiv.querySelectorAll('span')

    for (let i = 0; i < projectList.length; i++) {
        const letter = projectList[i];
        let delay = middle - i;
        delay = (delay === 0 || Math.abs(delay) === 0.5) ? 0 : Math.abs(Math.floor(delay));
        spans[i].classList.remove("pre")
        spans[i].classList.add("appear")
        spans[i].style.transitionDelay = `${(delay) * 50}ms`;
    }
}

const proLogos = document.querySelectorAll('.proLogo');
const nav = document.querySelector('nav');
const nameContainer = document.querySelector('.projectsNameContainer');

function applyBlur(activeLogo) {
    proLogos.forEach(logo => {
        const urlContainer = logo.querySelector('.urlContainer');
        if (logo !== activeLogo) {
            logo.classList.add('blur');
            logo.classList.remove('no-blur');
            if (urlContainer) {
                urlContainer.classList.remove("urlContainerOpened")
            }
        } else {
            prologoActive = true
            logo.classList.remove('blur');
            logo.classList.add('no-blur');
            if (urlContainer) {
                urlContainer.classList.add("urlContainerOpened")
            }
        }
    });

    Array.from(document.body.children).forEach(child => {
        if (child !== nav && !child.contains(activeLogo)) {
            child.classList.add('blur');
        } else {
            child.classList.remove('blur');
        }
    });

    if (!nameContainer.contains(activeLogo)) {
        nameContainer.classList.add('blur');
    } else {
        nameContainer.classList.remove('blur');
    }
}

function removeAllBlur() {
    prologoActive = false
    document.querySelectorAll('.blur').forEach(el => el.classList.remove('blur'));
    document.querySelectorAll('.no-blur').forEach(el => el.classList.remove('no-blur'));
    document.querySelectorAll('.urlContainer').forEach(container => {
        container.classList.remove("urlContainerOpened")

    });

    projectDiv.querySelectorAll('span').forEach(span => {
        span.classList.remove("appear")
    });
    bringSpans("projects")
}

proLogos.forEach(logo => {
    logo.addEventListener('click', (e) => {
        e.stopPropagation();
        applyBlur(logo);
    });
});

const fakeNav = document.getElementById("fakeNav")
let fakeNavFlag = false;
document.addEventListener('click', (event) => {
    if (!fakeNavFlag) {
        removeAllBlur();
    }
});
const navOptions = document.getElementById("options")
let navOffets = navOptions.getBoundingClientRect()
fakeNav.style.left = navOffets.right - 25 + 'px';
fakeNav.style.top = navOffets.top + 'px';
fakeNav.style.height = navOffets.height + 'px';
let img;

function showPreview(e) {
    navOffets = navOptions.getBoundingClientRect()
    fakeNav.style.left = navOffets.right + 5 + 'px';
    fakeNav.style.opacity = '1';
    fakeNavFlag = true
    img = document.getElementById(e)
    img.style.scale = "1";
    const body = document.body
    body.addEventListener('mousemove', (e) => {
        const rect = body.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        let normX = (x - centerX) / centerX;
        let normY = (y - centerY) / centerY;

        normY *= -1;

        const scaleX = 1 - Math.abs(normX);
        const scaleY = 1 - Math.abs(normY);

        const rotateY = normX * 20 * scaleY;
        const rotateX = normY * 20 * scaleX;
        img.style.transformOrigin = "center center";
        img.style.transform = `translateX(-50%) translateY(-50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

}
fakeNav.addEventListener('click', (event) => {
    fakeNav.style.left = navOffets.right - 25 + 'px';
    fakeNav.style.opacity = '0';
    fakeNavFlag = false
    img.style.transformOrigin = "left top";
    img.style.scale = "0";
});