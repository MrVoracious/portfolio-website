document.querySelectorAll('.proLogo').forEach(div => {
    let projectDiv;
    const container = document.querySelector('.projectsNameContainer');
    div.onmouseout = function () {
        projectDiv.querySelectorAll('span').forEach(span => {
            const delay = getComputedStyle(span).animationDelay;
            const playState = getComputedStyle(span).animationPlayState;
            span.classList.remove("appear")
        });
    }

    div.onmouseover = function () {
        const project = this.dataset.projectName
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
            spans[i].style.transitionDelay = `${delay * 50}ms`;
        }
    };
});