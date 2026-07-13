/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

const SITE_NAME = "NitroSoft";

/**
 * Set the page title
 */
export function setTitle(title) {
    document.title = title ? `${title} - ${SITE_NAME}` : SITE_NAME;
}

/**
 * Safely set innerHTML and execute scripts
 * This is necessary for dynamically loaded content with inline scripts
 */
export function setInnerHTML(element, html) {
    element.innerHTML = html;
    
    // Re-execute scripts
    Array.from(element.querySelectorAll("script")).forEach(oldScript => {
        const newScript = document.createElement("script");
        
        // Copy attributes
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy script content
        newScript.textContent = oldScript.textContent;
        
        // Replace old script with new one
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

/**
 * Create a project card element
 */
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-entry';
    
    // Build tags HTML
    const tagsHTML = project.tags 
        ? project.tags.map(tag => `<a href="#" class="pill" aria-label="Tag: ${tag}">${tag}</a>`).join('')
        : '';
    
    // Build links HTML
    const linksHTML = project.links
        ? project.links.map(link => {
            const platform = link.url.includes('github') ? 'GitHub' : 
                           link.url.includes('itch.io') ? 'itch.io' : 
                           link.url.includes('youtube') ? 'YouTube' : 'External link';
            return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${platform} link for ${project.name}">
                <img class="svg-icon" src="${link.icon}" alt="" width="32" height="32" />
            </a>`;
        }).join('')
        : '';
    
    card.innerHTML = `
        <div class="project-head">
            <div class="project-thumbnail" style="background-image: url('${project.icon}')" role="img" aria-label="${project.name} thumbnail"></div>
            <h2><a href="${project.url}">${project.name}</a></h2>
        </div>
        <div class="project-body">
            <p>${project.description}</p>
        </div>
        <div class="project-footer">
            <div class="project-links">${linksHTML}</div>
            <div class="project-tags">${tagsHTML}</div>
        </div>
    `;
    
    return card;
}

/**
 * Load and display project list
 */
export async function loadProjectList(containerId, count = 1000) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id '${containerId}' not found`);
        return;
    }
    
    try {
        // Show loading state
        container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Loading projects...</p></div>';
        
        // Fetch project data
        const response = await fetch('assets/data/project-list.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load projects: ${response.status}`);
        }
        
        const projects = await response.json();
        
        // Clear loading state
        container.innerHTML = '';
        
        // Add projects to container
        const projectsToShow = projects.slice(0, count);
        const fragment = document.createDocumentFragment();
        
        projectsToShow.forEach(project => {
            fragment.appendChild(createProjectCard(project));
        });
        
        container.appendChild(fragment);
        
        console.log(`Loaded ${projectsToShow.length} projects`);
        
    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = `
            <div class="error">
                <p>Failed to load projects. Please try again later.</p>
            </div>
        `;
    }
}

/**
 * Debounce function for performance
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
