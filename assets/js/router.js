let routes = {};
let templates = {};
function view(url, title) {
    let appDiv = document.getElementById("main-content");
    fetch(url).then(function (page) {
        return page.text();
    }).then(function (html) {
        setInnerHTML(appDiv, html);
        setTitle(title);
    });
}
function route(path, template) {
    if (typeof template === 'function') {
        return routes[path] = template;
    }
    else if (typeof template === 'string') {
        return routes[path] = templates[template];
    } else {
        return;
    };
};
function template(name, templateFunction) {
    return templates[name] = templateFunction;
};
function resolveRoute(route) {
    try {
        return routes[route];
    } catch (e) {
        throw new Error(`Route ${route} not found`);
    };
};
function router(evt) {
    let url = window.location.hash.slice(1) || '/';
    let routeFunc = resolveRoute(url);
    console.log(url);
    routeFunc();
};
function initRoutes() {
    // Define templates here
    template('home', () => view("pages/home.htm"));
    template('projects', () => view("pages/projects.htm", "Projects"));
    template('contact', () => view("pages/contact.htm", "Contact"));
    template('youtube', () => view("pages/youtube.htm", "Videos"));
    template('projects-landon-and-emma', () => view("pages/projects/landon-and-emma.htm", "Landon & Emma"));
    template('projects-mysims-kart-ds', () => view("pages/projects/mysims-kart-ds.htm", "MySims Kart DS"));
    template('projects-apicula-gui', () => view("pages/projects/apicula-gui.htm", "Apicula GUI"));
    // Define routes here
    route('/', 'home');
    route('/contact', 'contact');
    route('/projects', 'projects');
    route('/youtube', 'youtube');
    route('/projects/landon-and-emma', 'projects-landon-and-emma');
    route('/projects/mysims-kart-ds', 'projects-mysims-kart-ds');
    route('/projects/apicula-gui', 'projects-apicula-gui');
}
initRoutes();
// Add event listeners
window.addEventListener('load', router);
window.addEventListener('hashchange', router);