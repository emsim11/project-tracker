// Define HTML Elements in Variables
var timeDisplay = $('#Today-Date')
var projectDisplay = $('#Project-Display');
var projectForm = $('#Project-Form');
var projectNameInput = $('#Project-Name-Input');
var projectTypeInput = $('#Project-Type-Input');
var projectDateInput = $('#Project-Date-Input');

// Time Display
function todaysDate() {
    // Define today as today
    var dateToday = dayjs().format('[Today is ] dddd, MMM DD, YYYY [at] hh[:]mm[:]ss a');
    // Return the date in the browser
    timeDisplay.text(dateToday);
}

// Upload Projects from Local Storage or Display None
function readProjectsFromStorage() {
    var projects = localStorage.getItem('projects');
    if (projects) {
        projects = JSON.parse(projects);
    } else {
        projects = [];
    }
    return projects;
}

// Save Projects to Local Storage
function saveProjectsToStorage(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Gets Project Data from Local Storage and Displays It
function printProjectData() {
    // Clear Current Projects
    projectDisplay.empty();
    // Get Projects from Local Storage
    var projects = readProjectsFromStorage();
    // Loop Through Each Project and Create New Row
    for (var i = 0; i < projects.length; i += 1) {
        var project = projects[i];
        var projectDate = dayjs(project.date);
        // Define Date and Time for Start of Today
        var today = dayjs().startOf('day');
        // Create Row and Columns for Project
        var row = $('<tr>');
        var name = $('<td>').text(project.name);
        var type = $('<td>').text(project.type);
        var date = $('<td>').text(projectDate.format('MM/DD/YYYY'));
        // Save Index of Project as a Data-* Attribute on the Button
        var deleteProject = $(
            '<td><button class="btn btn-sm btn-delete-project" data-index="' + i + '">✔️</button></td>'
        );
        // Add Class to Row by Comparing Project Date and Today's Date
        if (projectDate.isBefore(today)) {
            row.addClass('Project-Late');
        } else if (projectDate.isSame(today)) {
            row.addClass('Project-Today');
        }
        // Append Elements to DOM to Display Them
        row.append(name, type, date, deleteProject);
        projectDisplay.append(row);
    }
}
// Remove Project From LOcal Storage and Print the Project Data
function handleDeleteProject() {
    var projectIndex = parseInt($(this).attr('data-index'));
    var projects = readProjectsFromStorage();
    // Remove Project From Array
    projects.splice(projectIndex, 1);
    saveProjectsToStorage(projects);
    // Print Projects
    printProjectData();
}
// Add a Project to Local Storage and Print the Project Data
function handleProjectFormSubmit(event) {
    event.preventDefault();
    // Read User Input From Form
    var projectName = projectNameInput.val().trim();
    var projectType = projectTypeInput.val();
    var projectDate = projectDateInput.val();
    var newProject = {
        name: projectName,
        type: projectType,
        date: projectDate,
    };
    // Add Project to Local Storage
    var projects = readProjectsFromStorage();
    projects.push(newProject);
    saveProjectsToStorage(projects);
    // Print Project Data
    printProjectData();
    // Clear the Form Inputs
    projectNameInput.val('');
    projectTypeInput.val('');
    projectDateInput.val('');
}
projectForm.on('submit', handleProjectFormSubmit);
// jQuery Event Delegation to Listen for Clicks on Dynamically Added Delete Buttons
projectDisplay.on('click', '.btn-delete-project', handleDeleteProject);
// Display Date and Time
todaysDate();
// Update the time every second
setInterval(todaysDate,1000);
// Run Print Projects Function
printProjectData();