const container = document.querySelector('.projectsNameContainer');
const defaultDiv = document.getElementById("defaultdiv")
const defaultDivSpan = document.getElementById("defaultdivspan")
const projectsLogo = document.getElementById("projectsLogo")
let projectDiv;

projectsLogo.onmouseout = function() {bringSpans("projects")}

document.querySelectorAll('.proLogo').forEach(div => {
    div.onmouseout = function () {
        projectDiv.querySelectorAll('span').forEach(span => {
            span.classList.remove("appear")
        });
    }

    div.onmouseover = function () {
        if (defaultDivSpan.classList.contains("appear")) {
            defaultDiv.querySelectorAll('span').forEach(span => {
                span.classList.remove("appear")
            });
        }

        bringSpans(this.dataset.projectName)

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
