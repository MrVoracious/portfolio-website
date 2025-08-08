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
                urlContainer.style.height = '0';
                urlContainer.style.width = '0';
            }
        } else {
            prologoActive = true
            logo.classList.remove('blur');
            logo.classList.add('no-blur');
            if (urlContainer) {
                const urlCount = urlContainer.querySelectorAll('.url').length;
                urlContainer.style.height = `${4.5 * urlCount}vh`;
                urlContainer.style.opacity = '1';
                urlContainer.style.width = 'calc(200% + 1vw + 6px)';
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
        container.style.height = '0';
        container.style.width = '0';
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

document.addEventListener('click', () => {
    removeAllBlur();
});