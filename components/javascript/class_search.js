


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
    fetch(corsAnywhereURL + baseSubjectURL+currentTerm)
        .then(response => response.json())
        .then(populateSubjects);
}
const populateSubjects = (dataFromServer) => {
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
    
    if (document.getElementsByClassName('DOW-selected').length == 0) {
        // No days were selected
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

// Clear the Day of Week filter
const clearDOWFilter = () => {
    console.log(document.getElementsByClassName('dayOfWeek'));
    for (day of document.getElementsByClassName('dayOfWeek')) {
        day.classList.remove('DOW-selected');
    }
}

// Changes class of the day of week selector when clicked based on class
const daysOfWeekClick = (dayString) => {
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
    }else{
        details_content_template += `<p>${details.meeting_days} &ensp; ${toAMPM(details.start_time)}-${toAMPM(details.end_time)}<br>`;
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

    // Insert information into the search-details-content section
    document.getElementById('search-details-content').innerHTML = details_content_template;

    let detailsButton = document.getElementById('search-details-add-class');
    detailsButton.style.display = 'block';

    
    

    switch (formatCode) {
        case 0:
            // Format for click from search results
            if (courses[details.id] != undefined) {
                // Class already in calendar so don't display option to add again
                detailsButton.style.backgroundColor = 'gray';
                detailsButton.onclick = function() {alert('Class is already in the calendar')};
                        
            } else if ((details.meeting_days == null) || (details.start_time == null) || (details.end_time == null)) { 
                // Meeting times unknown so can't add to calendar
                detailsButton.style.backgroundColor = 'gray';
                detailsButton.onclick = function() {alert('Cannot add class because its meeting time is TBA')};
            }else {
                // Attach onclick event to add class to calendar
                detailsButton.innerHTML = 'Add class to schedule'
                // Meeting times known so can add to calendar
                detailsButton.onclick = function() {addCourse()};
                detailsButton.style.backgroundColor = '#4e2a84';
                // Determine if class has overlap or could be added
                determineOverlap(details);
            }
            break;
        case 1:
            // Format for click from calendar view
            detailsButton.innerHTML = 'Remove class from schedule'
            detailsButton.style.backgroundColor = '#4e2a84';
            detailsButton.onclick = function() {removeCourse(details.id)}
            break;
    }

    
    // Display the modal
    document.getElementById('search-details-modal').style.display='block';
}


// Determines if this class has overlap with any class currently in the calendar
const determineOverlap = (details) => {
    let detailsButton = document.getElementById('search-details-add-class');
    let newStartPos = getPositionCal(details.start_time);
    let newEndPos = getPositionCal(details.end_time);

    // Check if there is overlap
    for (course of Object.values(courses)) {
        if ((newEndPos >= course['startPos']) && (course['endPos'] >= newStartPos)) {
            for (day of course['days']) {
                for (let i = 0; i < details.meeting_days.length; i++) {
                    if (details.meeting_days.substring(i, i+2) == day) {
                        console.log('COURSES: ');
                        console.log(courses);
                        console.log('CURRENT DAY: ' + day);
                        console.log('DAYSTRING: ' + details.meeting_days);
                        // Found overlap: change button functionality
                        detailsButton.style.backgroundColor = 'gray';
                        detailsButton.onclick = function() {alert('Cannot add class because it conflicts with a class already in the calendar')};
                        return;
                    }
                }
            }
        }
    }

    // Didn't find overlap so will have regular functionality
    detailsButton.style.backgroundColor = '#4e2a84';
    detailsButton.onclick = function() {addCourse()};
    return;
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
const colors = {'rgb(102, 205, 170)':false, 
                'rgb(220, 20, 60)':false, 
                'rgb(255, 140, 0)':false, 
                'rgb(34, 139, 34)':false, 
                'rgb(65, 105, 225)':false, 
                'rgb(143, 188, 143)':false
                };

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
    let classDays = [];

    // Add the template to each day that the class is on
    for (let i = 0; i < desc.meeting_days.length; i+=2){
        // Add 
        if (desc.meeting_days.substring(i, i+2) == 'Mo'){
            document.getElementById('cal-Monday').innerHTML += calTemplate;
            classDays.push('Mo');
        }
        if (desc.meeting_days.substring(i, i+2) == 'Tu'){
            document.getElementById('cal-Tuesday').innerHTML += calTemplate;
            classDays.push('Tu');
        }
        if (desc.meeting_days.substring(i, i+2) == 'We'){
            document.getElementById('cal-Wednesday').innerHTML += calTemplate;
            classDays.push('We');
        }
        if (desc.meeting_days.substring(i, i+2) == 'Th'){
            document.getElementById('cal-Thursday').innerHTML += calTemplate;
            classDays.push('Th');
        }
        if (desc.meeting_days.substring(i, i+2) == 'Fr'){
            document.getElementById('cal-Friday').innerHTML += calTemplate;
            classDays.push('Fr');
        }
    }

    // Add this course to the array holding the courses currently displayed in the calendar
    courses[desc.id] = {'details': desc, 
                        'startPos': getPositionCal(desc.start_time), 
                        'endPos': getPositionCal(desc.end_time),
                        'days': classDays};

    
    console.log('Add class with id:'+ desc.id.toString());   
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
        class='class-cell id${desc.id}'
        onclick='displayCalDetails(${desc.id})'>
        <p>${toAMPM(desc.start_time)} - ${toAMPM(desc.end_time)}</p>
        <p class='cal-class-title'>${desc.subject} ${desc.catalog_num}</p>
    </container>
    `;

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
    for (color of Object.keys(colors)){
        if (!colors[color]){
            colors[color] = true;
            return color;
        }
    }
    // If all colors taken, pick a random one
    return Object.keys(colors)[Math.floor(Math.random() * (Object.keys(colors).length - 1))]
}


const displayCalDetails = (id) => {
    console.log('Display class with id: ' + id);
    getSearchDetails(id, 1);
}

const removeCourse = (courseID) => {
    // Delete the class from the courses dictionary
    delete courses[courseID];
    // Delete the class from the calendar
    removeCalCell(courseID);
    // Hide the search details modal
    document.getElementById('search-details-modal').style.display = 'none';
}

const removeCalCell = (id) => {
    // Removes the class from the calendar
    let calClasses = document.getElementsByClassName('id'+id);
    
    // Free up color for calendar
    let classColor = calClasses[0].style.backgroundColor;
    console.log(classColor);
    colors[classColor] = false;

    // Remove all instances of the class from the calendar
    while (calClasses.length) {
        calClasses[0].remove();
    }
}
