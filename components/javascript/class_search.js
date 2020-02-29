// URLs for use in fetches
const baseSubjectURL = "http://api.asg.northwestern.edu/subjects/?key=eQSCJbgt58PVr9KC&term=";
const baseCourseURL = "http://api.asg.northwestern.edu/courses/?key=eQSCJbgt58PVr9KC";
const baseDetailsURL = "http://api.asg.northwestern.edu/courses/details/?key=eQSCJbgt58PVr9KC&id="

// Code for the current course term
const currentTerm = 4760;  // Fall 2019 is most recent data in the API

let currentSearchData = [];

///// Load in subjects for the quarter /////
const loadSubjects = () => {
    fetch(baseSubjectURL+currentTerm)
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
const showDayFilter = () => {
    var checkboxes = document.getElementById('days-checkboxes');
    if (document.getElementById('dayFilter').checked) {
        checkboxes.style.display = "inline-block";
    }
    else {
        checkboxes.style.display = "none";
    }
}
const checksToDayString = () => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"]
    let dayString = "";
    for (var day of days) {
        dayCheck = document.getElementById(day)
        if (dayCheck.checked) {
            dayString += dayCheck.value;
        }
    }
    console.log(dayString);
    return dayString;
}
///////////////////////////


///// Load in courses based on search criteria /////
const getCourses = (paramsDict) => {
    let endpoints = "";
    for (var key in paramsDict) {
        if (key != 'meeting_days' || document.getElementById('dayFilter').checked)
        {
            endpoints += `&${key}=${paramsDict[key]}`
        }
    }
    console.log(endpoints);
    fetch(baseCourseURL + endpoints, { mode: 'no-cors' })
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
        if ((course.meeting_days == null) || (course.start_time == null) || (course.end_time == null)){
            // Handle case where meeting times not set
            document.getElementById('search-results').innerHTML += `
            <div id="${course.id}" class='search-card'>
                <h1>${course.subject} ${course.catalog_num}</h1>
                <p>${course.title}</p>
                <p>${course.instructor}</p>
                <p>- Meeting times not provided -</p>
            </div>
            `;
        } else {
            document.getElementById('search-results').innerHTML += `
            <div id='${course.id}' class='search-card'>
                <h1>${course.subject} ${course.catalog_num}</h1>
                <p>${course.title}</p>
                <p>${course.instructor}</p>
                <p>${course.meeting_days}  ${toAMPM(course.start_time)}-${toAMPM(course.end_time)}</p>
            </div>
            `;
        }
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


///// Handles displaying the search detials modal when click on search result /////
// Retrieve search details from the server
const getSearchDetails = (course_id) => {
    fetch(baseDetailsURL + course_id, { mode: 'no-cors' })
        .then(response => response.json())
        .then(displaySearchDetails);
}

// Display the search details in the modal
const displaySearchDetails = (dataFromServer) => {
    console.log(dataFromServer);
    let details = dataFromServer[0];
    document.getElementById('search-details-content').innerHTML=`
        <h1>${details.title}</h1>
        <p>${details.subject} ${details.catalog_num} - Section ${details.section}</p>
        <p>${details.instructor.name}</p>
        <p>${details.meeting_days}  ${toAMPM(details.start_time)}-${toAMPM(details.end_time)}</p>
        <p>${details.room.building_name} ${details.room.name}<p> 
    `;
    document.getElementById('search-details-modal').style.display='block';
}

// Close modal when user clicks outside of search details modal
window.onclick = function(event) {
    if (event.target == document.getElementById('search-details-modal')) {
      event.target.style.display = "none";
    }
}
///////////////////////////