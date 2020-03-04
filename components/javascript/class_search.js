


// URLs for use in fetches
const corsAnywhereURL = "https://cors-anywhere.herokuapp.com/"
const baseSubjectURL = "http://api.asg.northwestern.edu/subjects/?key=eQSCJbgt58PVr9KC&term=";
const baseCourseURL = "http://api.asg.northwestern.edu/courses/?key=eQSCJbgt58PVr9KC";
const baseDetailsURL = "http://api.asg.northwestern.edu/courses/details/?key=eQSCJbgt58PVr9KC&id="

// Code for the current course term
const currentTerm = 4760;  // Fall 2019 is most recent data in the API

// Stores results of currrently returned search result data
let currentSearchData = [];
// Stores data of currently viewed course description
let currentCourseData;


///// Load in subjects for the quarter /////
const loadSubjects = () => {
    console.log(corsAnywhereURL + baseSubjectURL+currentTerm)
    fetch(corsAnywhereURL + baseSubjectURL+currentTerm)
        .then(response => response.json())
        .then(populateSubjects);
}
const populateSubjects = (dataFromServer) => {
    console.log(dataFromServer);
    subjectDropdown = document.getElementById('subject-dropdown');
    for (subject of dataFromServer) {
        let optionTemplate = `<option value=${subject.symbol}>${subject.symbol} - ${subject.name}</option>`;
        subjectDropdown.innerHTML += optionTemplate;
    }
}
///////////////////////////


////// Handles the filter by days functionality /////
const dayOfWeekString = () => {
    let dayString = "";
    
    if (!document.getElementById('daysOfWeek-activate').classList.contains('DOW-active')) {
        // If day filter not active, return no days selected
        dayString = 'noDaysSelected';
    } else if (document.getElementsByClassName('DOW-selected').length == 0) {
        // Filter active but no days were selected, so act as if filter is inactive
        dayString = 'noDaysSelected';
    } else {
        for (day of document.getElementsByClassName('dayOfWeek')) {
            if (day.classList.contains('DOW-selected')) {
                dayString += day.id.substring(0,2);
            }
        }
    }
    return dayString;
}
// Displays the day of the week filter
displayDaysOfWeek = (displayString) => {
    if (displayString == 'show') {
        for (day of document.getElementsByClassName('daysOfWeek')) {
            day.classList.remove('DOW-selected');
        }
        document.getElementById('daysOfWeek-activate').style.display='none';
        document.getElementById('daysOfWeek-activate').classList.toggle('DOW-active');
        document.getElementById('daysOfWeek-selector-container').style.display='flex';
    } else {
        document.getElementById('daysOfWeek-selector-container').style.display='none';
        document.getElementById('daysOfWeek-activate').classList.toggle('DOW-active');
        document.getElementById('daysOfWeek-activate').style.display='block';
    }
}
// Changes class of the day of week selector when clicked based on class
daysOfWeekClick = (dayString) => {
    let day = document.getElementById(dayString);
    day.classList.toggle('DOW-selected');
}
// 

///////////////////////////


///// Load in courses based on search criteria /////
const getCourses = () => {
    let searchParams = {'term':currentTerm, 'subject':document.getElementById('subject-dropdown').value, 'meeting_days':dayOfWeekString()};
    let endpoints = "";
    // Handle case where user hasn't selected a subject
    if (searchParams.subject == 'default') {alert('Please select a subject to search'); return;}
    for (var key in searchParams) {
        // Check if key is meeting_days, in which case we only want to add if the DOW filter is active and meeting string is not none
        console.log(searchParams.meeting_days);
        if (key != 'meeting_days' || searchParams.meeting_days != 'noDaysSelected') {
            endpoints += `&${key}=${searchParams[key]}`
        }
    }
    console.log(endpoints);
    fetch(corsAnywhereURL + baseCourseURL+endpoints)
        .then(response => response.json())
        .then(showCourses)
        .then(attachSearchReultsClickHandler);
}
///////////////////////////


///// Convert times in server return from 24-hour to 12-hour format /////
const toAMPM = (time) => {
    const hour = time.substring(0, 2);
    const mins = time.substring(2);
    let hoursAsInt = parseInt(hour);
    let AMPM = "";
    if (hoursAsInt < 12) {
        AMPM = "AM";
        if (hoursAsInt == 0) {
            hoursAsInt = 12;
        }
    }
    else {
        AMPM = "PM";
        if (hoursAsInt != 12) {
            hoursAsInt -= 12;
        }
    }
    return hoursAsInt + mins + AMPM;
}
///////////////////////////


///// Populate the results of the search in the Search Results section /////
const showCourses = (dataFromServer) => {
    // Assign dataFromServer to currentSearchData for later filtering use 
    currentSearchData = dataFromServer;
    console.log(currentSearchData);

    // Populate the search results section accordingly
    document.getElementById('search-results').innerHTML = ``;
    if (currentSearchData.length == 0) {
        document.getElementById('search-results').innerHTML = '<p>No courses found that match your search criteria</p>'
    }
    for (course of currentSearchData) {
        let course_card_template = `
        <div id="${course.id}" class='search-card'>
            <h1>${course.subject} ${course.catalog_num}</h1>
            <p>${course.title}</p>
            <p>${course.instructor}</p>`;

        // Handles cases where start time not set 
        // !IMPORTANT: Tab alignment necessary to ensure template tags line up properly
        if ((course.meeting_days == null) || (course.start_time == null) || (course.end_time == null)){
            course_card_template += `<p>Meeting Times TBA</p>
        </div>`;
        } else {
            course_card_template += `<p>${course.meeting_days} &ensp; ${toAMPM(course.start_time)}-${toAMPM(course.end_time)}</p>
        </div>`;
        }

        document.getElementById('search-results').innerHTML += course_card_template;
        document.getElementById('search-results-container').style.display = 'flex';
    }
}
// Attach the onclick action for each of the search result cards
const attachSearchReultsClickHandler = () => {
    const results = document.getElementsByClassName("search-card");
    for (r of results) {
        // Pass course_id into the search details modal for querying the server and getting information
        let course_id = r.id;
        r.onclick = function(){getSearchDetails(course_id, 0);}
    }
}
///////////////////////////


///// Handles displaying the search details modal when click on search result /////
// Retrieve search details from the server
const getSearchDetails = (course_id, formatCode) => {
    // Check if we already have the data stored, otherwise make a fetch request
    if (courses[course_id] != undefined) {
        displaySearchDetails(courses[course_id]['details'], formatCode)
    } else {
        fetch(corsAnywhereURL + baseDetailsURL+course_id)
            .then(response => response.json())
            .then(function(response) {
                displaySearchDetails(response[0], formatCode)});
    }
}

// Populate and display the search details modal
const displaySearchDetails = (dataFromServer, formatCode) => {
    // formatCode indicates which way we should format the modal
    console.log(dataFromServer);
    currentCourseData = dataFromServer;
    let details = dataFromServer;
    document.getElementById('search-details-title').innerHTML = `${details.subject} ${details.catalog_num}`;
    details_content_template = `<h1>${details.title}</h1>
        <p>${details.subject} ${details.catalog_num} - Section ${details.section} <br> ${details.instructor.name}</p>`;

    // Handle case of no meeting times given
    if ((details.meeting_days == null) || (details.start_time == null) || (details.end_time == null)){
        details_content_template += `<p>Meeting Times TBA<br>`;
        // Meeting times unknown so can't add to calendar
        document.getElementById('search-details-add-class').style.display = 'none';
    }else{
        details_content_template += `<p>${details.meeting_days} &ensp; ${toAMPM(details.start_time)}-${toAMPM(details.end_time)}<br>`;
        // Meeting times known so can add to calendar
        document.getElementById('search-details-add-class').onclick = function() {addCourse()};
        document.getElementById('search-details-add-class').style.display = 'block';
    }
    
    // Handle case of no meeting location given
    if ((details.room == null) || (details.room.building_name == "TBA")) {
        details_content_template += `Meeting Location TBA</p>`;
    }else{
        details_content_template += `${details.room.building_name} ${details.room.name}</p>`;
    }

    // Add in other course details if they're available
    if (details.attributes != null) {
        // Need to trim because the attributes have two extra \n\n at the end for some reason
        details_content_template += `<p>${details.attributes.trim()}</p>`;
    }
    if (details.overview != null) {
        details_content_template += `<h2>Overview of class</h2>
        <p>${details.overview}</p>`;
    }
    for (cd of details.course_descriptions) {
        details_content_template += `<h2>${cd.name}</h2>
        <p>${cd.desc}</p>`;
    }

    // Format it as if we clicked from the search results
    console.log(details_content_template);
    // Insert information into the search-details-content section
    document.getElementById('search-details-content').innerHTML = details_content_template;

    let detailsButton = document.getElementById('search-details-add-class');

    switch (formatCode) {
        case 0:
            // Format for click from search results
            if (courses[details.id] != undefined) {
                // Class already in calendar so don't display option to add again
                detailsButton.style.display = 'none';
            } else {
                // Attach onclick event to add class to calendar
                detailsButton.onclick = function() {addCourse()};
            }
            break;
        case 1:
            // Format for click from calendar view
            detailsButton.innerHTML = 'Remove class from schedule'
            detailsButton.onclick = function() {removeCourse(details.id)}
            break;
    }

    
    // Display the modal
    document.getElementById('search-details-modal').style.display='block';
}

// Close modal when user clicks outside of search details modal
window.onclick = function(event) {
    if (event.target == document.getElementById('search-details-modal')) {
      event.target.style.display = "none";
    }
}
///////////////////////////



///////////////////////////////////////////////
///////////// Calendar Javascript /////////////
///////////////////////////////////////////////

// Stores the current courses displayed in the calendar
const courses = {};

// Array of possible display colors
const colors = ['#66CDAA', '#DC143C', '#FF8C00', '#228B22', '#F0E68C', '#4169E1', '#8FBC8F'];

// Adds a course from the search details modal
const addCourse = () => {
    // Add the course to the calendar
    addCourseToCal(currentCourseData);
    // Hide the search details modal once class added to calendar
    document.getElementById('search-details-modal').style.display = 'none';
}

// Adds the course to the calendar
const addCourseToCal = (desc) => {
    // Creates the Calendar Cells
    let calTemplate = createCalCell(desc);
    
    // Add the template to each day that the class is on
    for (let i = 0; i < desc.meeting_days.length; i+=2){
        // Add 
        if (desc.meeting_days.substring(i, i+2) == 'Mo'){
            document.getElementById('cal-Monday').innerHTML += calTemplate;
        }
        if (desc.meeting_days.substring(i, i+2) == 'Tu'){
            document.getElementById('cal-Tuesday').innerHTML += calTemplate;
        }
        if (desc.meeting_days.substring(i, i+2) == 'We'){
            document.getElementById('cal-Wednesday').innerHTML += calTemplate;
        }
        if (desc.meeting_days.substring(i, i+2) == 'Th'){
            document.getElementById('cal-Thursday').innerHTML += calTemplate;
        }
        if (desc.meeting_days.substring(i, i+2) == 'Fr'){
            document.getElementById('cal-Friday').innerHTML += calTemplate;
        }
    }

    // Add this course to the array holding the courses currently displayed in the calendar
    courses[desc.id] = {'details': desc, 
                        'startPos': getPositionCal(desc.start_time), 
                        'endPos': getPositionCal(desc.end_time)};

    // Add onclick function to class in calendar
    console.log(desc.id.toString());
    console.log(document.getElementsByClassName(desc.id));
    for (calClass of document.getElementsByClassName(desc.id)) {
        calClass.onclick = function () {displayCalDetails(desc.id)};
    }
    
}

// Creates a cell in the calendar
const createCalCell = (desc) => {
    // Template for class cell
    let template = `
    <a href='#'
        style='
            background-color:${getBackgroundColorCal()}; 
            height:calc(((100% - 30px) / 15) * ${getHeightCal(desc.start_time, desc.end_time)}); 
            position:absolute; 
            top:calc(30px + ((100% - 30px) / 15) * ${getPositionCal(desc.start_time)}); 
            left:1px; 
            right:5px;' 
        class='class-cell ${desc.id}'>
        <p>${toAMPM(desc.start_time)} - ${toAMPM(desc.end_time)}</p>
        <p class='cal-class-title'>${desc.subject} ${desc.catalog_num}</p>
    </container>
    `;

    console.log(template);
    return template;    
}

// Calculate the height/position units for placement on the calendar
// Height units returned in terms of hours //
    // IE: class of 50 minute length will return 0.8333...
    //     class of 90 minute length will return 1.5
const getPositionCal = (startTime) => {
    let startSplit = startTime.split(':')
    let startHours = (+startSplit[0]) + ((+startSplit[1])/60);
    return (startHours - 8)
}

const getHeightCal = (startTime, endTime) => {
    let startSplit = startTime.split(':')
    let endSplit = endTime.split(':')
    let startHours = (+startSplit[0]) + ((+startSplit[1])/60);
    let endHours = (+endSplit[0]) + ((+endSplit[1])/60);
    return (endHours - startHours);
}
///////////////////////////


const getBackgroundColorCal = () => {
    console.log(Object.keys(courses).length);
    console.log(colors.length);
    console.log((courses.length % colors.length));
    return colors[(Object.keys(courses).length % colors.length)];
}


const displayCalDetails = (id) => {
    console.log('Display class with id: ' + id);
    getSearchDetails(id, 1);
}

const removeCourse = (courseID) => {
    removeCalCell(courseID);
    document.getElementById('search-details-modal').style.display = 'none';
}

const removeCalCell = (id) => {
    // Removes the class from the calendar
    console.log(document.getElementsByClassName(id));
    calClasses = document.getElementsByClassName(id);
    while (calClasses.length) {
        calClasses[0].remove();
    }
}
