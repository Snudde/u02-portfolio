const profileButton = document.getElementById("profile-button");
const objectiveButton = document.getElementById("objective-button");
const technicalSkillsButton = document.getElementById(
  "technical-skills-button"
);

const navConfig = [
  { buttonId: "profile-button", sectionId: "profile-section" },
  { buttonId: "objective-button", sectionId: "objective-section" },
  {
    buttonId: "technical-skills-button",
    sectionId: "technical-skills-section",
  },
  { buttonId: "cv-button", sectionId: "cv-section" },
  { buttonId: "projects-button", sectionId: "projects-section" },
];

const allSections = navConfig.map((config) =>
  document.getElementById(config.sectionId)
);

const allButtons = navConfig.map((config) =>
  document.getElementById(config.buttonId)
);

function initializeNavigation(config) {
  config.forEach(({ buttonId, sectionId }) => {
    const button = document.getElementById(buttonId);
    const targetSection = document.getElementById(sectionId);

    button.addEventListener("click", () => {
      allSections.forEach((section) => section.classList.remove("active"));
      allButtons.forEach((button) => button.classList.remove("active"));

      targetSection.classList.add("active");
      button.classList.add("active");
    });
  });
}

initializeNavigation(navConfig);

async function getCv() {
  try {
    const response = await fetch("/data/cv.json");

    if (!response.ok) {
      throw new Error(`HTTP error status ${response.status}`);
    }

    const data = await response.json();

    displayCv(data.work, data.education);
  } catch (error) {
    console.error("Type of error", error);
  }
}

function displayCv(work, education) {
  const workList = document.getElementById("work-list");
  const educationList = document.getElementById("education-list");

  work.forEach(function (work) {
    const li = document.createElement("li");
    li.classList.add("cv-work-item");
    li.innerHTML = `
    
    <span class="cv-title">${work.title}</span>
    <div class="cv-company-container">
    <span class="cv-company"><i class="fa-solid fa-building"></i>${work.company}</span>
    <span class="cv-image"><img src="${work.img}"></span>
    </div>
    <div class="cv-meta-container">
    <span class="cv-location"><i class="fa-solid fa-location-dot"></i>${work.location}</span>
    <span class="cv-year"><i class="fa-regular fa-calendar"></i>${work.fromYear} - ${work.toYear}</span>
    </div>
    <button class="cv-toggle-button" id="cv-toggle-button">Show Details</button>
    <span class="cv-description cv-toggle-content hidden">${work.description}</span>
    
    `;
    workList.appendChild(li);
  });
  education.forEach(function (education) {
    const li = document.createElement("li");
    li.classList.add("cv-education-item");
    li.innerHTML = `
    
    <span class="cv-title">${education.title}</span>
    <div class="cv-company-container">
    <span class="cv-company"><i class="fa-solid fa-building"></i>${education.school}</span>
    <span class="cv-image"><img src="${education.img}"></span>
    </div>
    <div class="cv-meta-container">
    <span class="cv-location"><i class="fa-solid fa-location-dot"></i>${education.location}</span>
    <span class="cv-year"><i class="fa-regular fa-calendar"></i>${education.fromYear} - ${education.toYear}</span>
    </div>
    <button class="cv-toggle-button" id="cv-toggle-button">Show Details</button>
    <span class="cv-description cv-toggle-content hidden">${education.description}</span>
    
    `;
    educationList.appendChild(li);
  });

  document.querySelectorAll(".cv-toggle-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;

      content.classList.toggle("hidden");
      btn.textContent = content.classList.contains("hidden")
        ? "Show Details"
        : "Hide Details";
    });
  });
}

getCv();

function showLoadingState() {
  const projectList = document.getElementById("project-list");
  if (projectList) {
    projectList.innerHTML = `
      <li class="loading-message">
        <i class="fa-solid fa-spinner fa-spin"></i>
        Loading GitHub projects...
      </li>
    `;
  }
}

const projectImages = {
  "Listening-Party-2": "/img/projects/listening-party.png",
  "u01---Landing-Page": "/img/projects/u01.png",
  "Pig-Game-JS": "/img/projects/pig-game.png",
};

async function getFeaturedRepos(username, repoNames) {
  showLoadingState();
  const projectList = document.getElementById("project-list");

  if (!projectList) {
    console.error("Project list element not found");
    return;
  }

  projectList.innerHTML = `
    <li class="loading-message">
      <i class="fa-solid fa-spinner fa-spin"></i>
      Loading featured projects...
    </li>
  `;

  try {
    const repoPromises = repoNames.map((repoName) =>
      fetch(`https://api.github.com/repos/${username}/${repoName}`).then(
        (res) => (res.ok ? res.json() : null)
      )
    );

    const repos = await Promise.all(repoPromises);
    const validRepos = repos.filter((repo) => repo !== null);

    if (validRepos.length === 0) {
      throw new Error("No repositories found");
    }

    displayProjects(validRepos);
  } catch (error) {
    console.error("Error fetching featured repos:", error);
    displayErrorMessage();
  }
}

//VISA ENDAST DESSA REPON
getFeaturedRepos("snudde", [
  "Listening-Party-2",
  "u01---Landing-Page",
  "Pig-Game-JS",
]);

function displayProjects(repos) {
  const projectList = document.getElementById("project-list");

  if (!projectList) {
    console.error("Project list element not found");
    return;
  }

  if (repos.length === 0) {
    projectList.innerHTML =
      '<li class="no-projects">No public repositories found</li>';
    return;
  }

  projectList.innerHTML = "";

  repos.forEach((repo) => {
    const li = document.createElement("li");
    li.classList.add("project-item");

    const imageSrc = projectImages[repo.name] || "/images/default-project.png";

    const updatedDate = new Date(repo.updated_at).toLocaleDateString("sv-SE");

    li.innerHTML = `
    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
    <div class="project-image-wrapper">
      <img src="${imageSrc}" alt="${
      repo.name
    } screenshot" class="project-image" onerror="this.style.display='none'">
    </div>
      <div class="project-info-wrapper">
      <div class="project-header">
        <h3 class="project-title">
          
            ${repo.name}
          
        </h3>
        ${
          repo.homepage
            ? `
          <a href="${repo.homepage}" class="project-demo-link" target="_blank" rel="noopener noreferrer">
            <i class="fa-solid fa-external-link"></i> Demo
          </a>
        `
            : ""
        }
      </div>
      
      <p class="project-description">${
        repo.description || "No description available"
      }</p>
      
      <div class="project-meta">
        ${
          repo.language
            ? `
          <span class="project-language">
            <i class="fa-solid fa-code"></i> ${repo.language}
          </span>
        `
            : ""
        }
        
        <span class="project-stars">
          <i class="fa-solid fa-star"></i> ${repo.stargazers_count}
        </span>
        
        <span class="project-forks">
          <i class="fa-solid fa-code-branch"></i> ${repo.forks_count}
        </span>
        
        <span class="project-updated">
          <i class="fa-regular fa-calendar"></i> ${updatedDate}
        </span>
      </div>
      </div>
      
      ${
        repo.topics && repo.topics.length > 0
          ? `
        <div class="project-topics">
          ${repo.topics
            .map((topic) => `<span class="topic-tag">${topic}</span>`)
            .join("")}
        </div>
        </a>
      `
          : ""
      }
    `;

    projectList.appendChild(li);
  });
}

function displayErrorMessage() {
  const projectList = document.getElementById("project-list");
  if (projectList) {
    projectList.innerHTML = `
      <li class="error-message">
        <i class="fa-solid fa-exclamation-triangle"></i>
        Unable to load GitHub projects. Please try again later.
      </li>
    `;
  }
}

const contactModal = document.getElementById("contact-modal");
const contactBtn = document.getElementById("contact-button");
const closeModalBtn = document.getElementsByClassName("close")[0];

contactBtn.onclick = function () {
  contactModal.style.display = "block";
};

closeModalBtn.onclick = function () {
  contactModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == contactModal) {
    contactModal.style.display = "none";
  }
};

setInterval(() => {
  contactBtn.classList.add("shake");

  contactBtn.addEventListener(
    "animationend",
    () => {
      contactBtn.classList.remove("shake");
    },
    { once: true }
  );
}, 5000);
