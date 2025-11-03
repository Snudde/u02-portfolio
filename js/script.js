/*const profileButton = document.getElementById("profile-button");
const objectiveButton = document.getElementById("objective-button");
const technicalSkillsButton = document.getElementById(
  "technical-skills-button"
);

const profileSection = document.getElementById("profile-section");
const objectiveSection = document.getElementById("objective-section");
const technicalSkillsSection = document.getElementById(
  "technical-skills-section"
);
*/
/*profileButton.addEventListener("click", function () {
  profileSection.classList.add("active");
  objectiveSection.classList.remove("active");
  technicalSkillsSection.classList.remove("active");
});*/

// Configuration: Map buttons to their corresponding sections
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

// Get all section elements once (better performance)
const allSections = navConfig.map((config) =>
  document.getElementById(config.sectionId)
);

// Main navigation function
function initializeNavigation(config) {
  config.forEach(({ buttonId, sectionId }) => {
    const button = document.getElementById(buttonId);
    const targetSection = document.getElementById(sectionId);

    button.addEventListener("click", () => {
      // Remove 'active' from ALL sections
      allSections.forEach((section) => section.classList.remove("active"));

      // Add 'active' to the clicked section
      targetSection.classList.add("active");
    });
  });
}

// Initialize everything
initializeNavigation(navConfig);

async function getCv() {
  try {
    // Väntar in tills datat har hämtats från todos.json
    const response = await fetch("/data/cv.json");

    // response.ok är att HTTP-status koden är 200 om hämtningen lyckas
    if (!response.ok) {
      throw new Error(`HTTP error status ${response.status}`);
    }

    // Väntar in till datat har parsats (översatts) till ett JS objekt
    const data = await response.json();

    // Kör display funktion
    displayCv(data.work, data.education);

    console.log("Inne i asynkrona funktion getTodos()");
  } catch (error) {
    console.error("Type of error", error);
  }
}

function displayCv(work, education) {
  // Hämta referens i DOM:en, ul
  const workList = document.getElementById("work-list");
  const educationList = document.getElementById("education-list");

  // Skapa ett li-element för varje todo
  work.forEach(function (work) {
    const li = document.createElement("li");
    li.classList.add("cv-work-item");
    li.innerHTML = `
    
    <span class="cv-title">${work.title}</span>
    <div class="cv-company-container">
    <span class="cv-company">${work.company}</span>
    <span class="cv-image"><img src="${work.img}"></span>
    </div>
    <div class="cv-meta-container">
    <span class="cv-location"><i class="fa-solid fa-location-dot"></i>${work.location}</span>
    <span class="cv-year"><i class="fa-regular fa-calendar"></i>${work.fromYear} - ${work.toYear}</span>
    </div>
    <span class="cv-description">${work.description}</span>
    
    `;
    workList.appendChild(li);
  });
  education.forEach(function (education) {
    const li = document.createElement("li");
    li.classList.add("cv-education-item");
    li.innerHTML = `
    
    <span class="cv-title">${education.title}</span>
    <div class="cv-company-container">
    <span class="cv-company">${education.school}</span>
    <span class="cv-image"><img src="${education.img}"></span>
    </div>
    <div class="cv-meta-container">
    <span class="cv-location"><i class="fa-solid fa-location-dot"></i>${education.location}</span>
    <span class="cv-year"><i class="fa-regular fa-calendar"></i>${education.fromYear} - ${education.toYear}</span>
    </div>
    <span class="cv-description">${education.description}</span>
    
    `;
    educationList.appendChild(li);
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

async function getFeaturedRepos(username, repoNames) {
  showLoadingState();
  const projectList = document.getElementById("project-list");

  if (!projectList) {
    console.error("Project list element not found");
    return;
  }

  // Show loading state
  projectList.innerHTML = `
    <li class="loading-message">
      <i class="fa-solid fa-spinner fa-spin"></i>
      Loading featured projects...
    </li>
  `;

  try {
    // Fetch all repos at once
    const repoPromises = repoNames.map((repoName) =>
      fetch(`https://api.github.com/repos/${username}/${repoName}`).then(
        (res) => (res.ok ? res.json() : null)
      )
    );

    const repos = await Promise.all(repoPromises);

    // Filter out any failed fetches (null values)
    const validRepos = repos.filter((repo) => repo !== null);

    if (validRepos.length === 0) {
      throw new Error("No repositories found");
    }

    displayProjects(validRepos);
    console.log(`Loaded ${validRepos.length} featured projects`);
  } catch (error) {
    console.error("Error fetching featured repos:", error);
    displayErrorMessage();
  }
}

// Usage - just list the repos you want to show
getFeaturedRepos("snudde", ["Listening-Party-2", "u01---Landing-Page"]);

function displayProjects(repos) {
  const projectList = document.getElementById("project-list");

  if (!projectList) {
    console.error("Project list element not found");
    return;
  }

  // Show message if no repos
  if (repos.length === 0) {
    projectList.innerHTML =
      '<li class="no-projects">No public repositories found</li>';
    return;
  }

  projectList.innerHTML = "";

  repos.forEach((repo) => {
    const li = document.createElement("li");
    li.classList.add("project-item");

    // Format the update date
    const updatedDate = new Date(repo.updated_at).toLocaleDateString("sv-SE");

    li.innerHTML = `
      <div class="project-header">
        <h3 class="project-title">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            ${repo.name}
          </a>
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
      
      ${
        repo.topics && repo.topics.length > 0
          ? `
        <div class="project-topics">
          ${repo.topics
            .map((topic) => `<span class="topic-tag">${topic}</span>`)
            .join("")}
        </div>
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
function typeCode(text, elementId, speed = 50) {
  const element = document.getElementById(elementId);
  let index = 0;

  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      // Optional: Wait then show rendered version
      setTimeout(() => {
        element.style.display = "none";

        // Create and show the actual h1
        const header = document.createElement("div");
        header.innerHTML = text;
        element.parentNode.insertBefore(header, element);
      }, 800);
    }
  }

  type();
}

// Usage
document.addEventListener("DOMContentLoaded", () => {
  typeCode(
    '<h1 class="main-page-header">Kalle Salomonsson</h1><br><p>Fullstack Web Developer',
    "code-display",
    60
  );
});
