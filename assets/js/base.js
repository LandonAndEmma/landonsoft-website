let siteName = "LandonSoft";
//Ready
window.onload = function () {
}
function setTitle(title) {
  if (title == undefined)
    document.title = siteName;
  else
    document.title = title + " - " + siteName;
}
function setInnerHTML(elm, html) {
  elm.innerHTML = html;
  Array.from(elm.querySelectorAll("script")).forEach(oldScript => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes)
      .forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}
function loadProjectList(containerId, count) {
  if (!count)
    count = 1000;
  var mainContent = document.getElementById(containerId);
  var fetchTemplate = fetch("templates/project-entry.htm").then(function (templateFile) { return templateFile.text(); });
  var fetchProjectJson = fetch("assets/data/project-list.json?v1.2").then(function (response) { return response.json(); });
  Promise.all([fetchTemplate, fetchProjectJson]).then(function (results) {
    var template = results[0];
    var projects = results[1];
    for (var i = 0; i < projects.length && i < count; i++) {
      var item = projects[i];
      var entry = template;
      var tagsHtml = "";
      var linksHtml = "";
      if (item.tags) {
        for (var t = 0; t < item.tags.length; t++) {
          tagsHtml += '<a href="#" class="pill">' + item.tags[t] + '</a>';
        }
      }
      if (item.links) {
        for (var l = 0; l < item.links.length; l++) {
          linksHtml += '<a target="_blank" href="' + item.links[l].url + '"><img class="svg-icon" src="' + item.links[l].icon + '"></a>';
        }
      }
      entry = entry.replace("{{name}}", item.name);
      entry = entry.replace("{{url}}", item.url);
      entry = entry.replace("{{icon}}", item.icon);
      entry = entry.replace("{{description}}", item.description);
      entry = entry.replace("{{tags}}", tagsHtml);
      entry = entry.replace("{{links}}", linksHtml);
      mainContent.innerHTML += entry;
    }
  });
}