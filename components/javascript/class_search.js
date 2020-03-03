


// URLs for use in fetches
const corsAnywhereURL = "https://cors-anywhere.herokuapp.com/"
const baseSubjectURL = "http://api.asg.northwestern.edu/subjects/?key=eQSCJbgt58PVr9KC&term=";
const baseCourseURL = "http://api.asg.northwestern.edu/courses/?key=eQSCJbgt58PVr9KC";
const baseDetailsURL = "http://api.asg.northwestern.edu/courses/details/?key=eQSCJbgt58PVr9KC&id="

// Code for the current course term
const currentTerm = 4760;  // Fall 2019 is most recent data in the API

let currentSearchData = [];
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
        r.onclick = function(){getSearchDetails(course_id);}
    }
}
///////////////////////////


///// Handles displaying the search details modal when click on search result /////
// Retrieve search details from the server
const getSearchDetails = (course_id) => {
    fetch(corsAnywhereURL + baseDetailsURL+course_id)
        .then(response => response.json())
        .then(displaySearchDetails);
}

// Populate and display the search details modal
const displaySearchDetails = (dataFromServer) => {
    console.log(dataFromServer);
    currentCourseData = dataFromServer[0];
    let details = dataFromServer[0];
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

    console.log(details_content_template);
    // Insert information into the search-details-content section
    document.getElementById('search-details-content').innerHTML = details_content_template;
    // Attach onclick event to add class to calendar
    document.getElementById('search-details-add-class').onclick = function() {addCourse(details.id)};
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



const addCourse = (courseID) => {
    addCourseToCal(currentCourseData);
    console.log('Add course with ID: ' + courseID);
    document.getElementById('search-details-modal').style.display='none';
}


const timeToNum = {
    '08:00': 1,'08:30': 2,'09:00': 3,'09:30': 4,'10:00': 5,'10:30': 6,'11:00': 7,'11:30': 8,'12:00': 9,'12:30': 10,'13:00': 11,
    '13:30': 12,'14:00': 13,'14:30': 14,'15:00': 15,'15:30': 16,'16:00': 17,'16:30': 18,'17:00': 19,'17:30': 20,'18:00': 21,
    '18:30': 22,'19:00': 23,'19:30': 24,'20:00': 25,'20:30':26,'21:00':27,'21:30':28
};

const endTimeToNum = {
    '08:50': 3,'09:20': 4,'09:50': 5,'10:20': 6,'10:50': 7,'11:20': 8,'11:50': 9,'12:20': 10,'12:50': 11,
    '13:20': 12,'13:50': 13,'14:20': 14,'14:50': 15,'15:20': 16,'15:50': 17,'16:20': 18,'16:50': 19,'17:20': 20,'17:50': 21,
    '18:20': 22,'18:20': 23,'19:20': 24,'19:50': 25,'20:20':26,'20:50':27,'21:20':28
}

const courses = {}; // id of course: description of course

const addCourseToCal = (desc) => {
    courses[desc.id] = desc
    //courses.push(desc.id, desc);
    createCalCell(desc);
}

const removeCourse = (desc) => {
    courses.delete(desc.id);
    removeCalCell(desc.id);
}

const createCalCell = (desc) => { // need to add the document.whatever stuff
    console.log(desc);
    if (desc.start_time == null){ // should do something about this
        console.log('yup')
        return;
    }

    console.log('1');

    // if it was removed before
    document.getElementsByTagName('head')[0].innerHTML += `
    <style>
    .${desc.id} {
        display:block;
    }
    </style>
    `;

    console.log('2');
    // makes a class-cell
    // change background color, location not perfect
    let template = `
    <div style='background-color:blue; height:calc(((100% - 30px) / 30) * (${endTimeToNum[desc.end_time]} - ${timeToNum[desc.start_time]})); position:absolute; top:calc((((100% - 25px) / 30) * ${timeToNum[desc.start_time]}) + 5px)'; left:0; right:0; class='class-cell' id=${desc.id}>
        <p>${desc.start_time} - ${desc.end_time}</p>
        <p>${desc.subject} ${desc.catalog_num}</p>
    </div>
    `;

    // gets which days to put in
    let days = [];
    for (let i = 0; i < desc.meeting_days.length; i+=2){
        if (desc.meeting_days.substring(i, i+2) == 'Mo'){
            days.push('cal-Monday');
        }
        if (desc.meeting_days.substring(i, i+2) == 'Tu'){
            days.push('cal-Tuesday');
        }
        if (desc.meeting_days.substring(i, i+2) == 'We'){
            days.push('cal-Wednesday');
        }
        if (desc.meeting_days.substring(i, i+2) == 'Th'){
            days.push('cal-Thursday');
        }
        if (desc.meeting_days.substring(i, i+2) == 'Fr'){
            days.push('cal-Friday');
        }
    }
    console.log('5');
    for (let i = 0; i < days.length; i++){
        document.getElementById(days[i]).innerHTML += template;
    }
}

const removeCalCell = (id) => {
    // DOES NOT REMOVE THE HTML. it sets it to display:none
    document.getElementsByTagName('head')[0].innerHTML += `
    <style>
    .${id} {
        display:none;
    }
    </style>
    `;
}
