const baseURL = "http://api.asg.northwestern.edu/courses/?key=eQSCJbgt58PVr9KC"
const currentTerm = 4760;  // Fall 2019 is most recent data in API


// Can't use because this loads in 200+ subjects, many of which don't have any classes this quarter despite quarter selector
///// Dynamically load in subjects for the quarter /////

const loadSubjects = () => {
    /*
    fetch("http://api.asg.northwestern.edu/subjects/?key=eQSCJbgt58PVr9KC&term="+currentTerm)
        .then(response => response.json())
        .then(populateSubjects);
    */
}
/*
const populateSubjects = (dataFromServer) => {
    console.log(dataFromServer);
    subjectDropdown = document.getElementById('subject-dropdown');
    for (subject in dataFromServer) {
        let optionTemplate = `<option value=${subject.symbol}>${subject.symbol} - ${subject.name}</option>`;
        subjectDropdown.innerHTML += optionTemplate;
    }
}
*/
///////////////////////////

const getCourses = (paramsDict) => {
    let endpoints = "";
    for (var key in paramsDict) {
        if (key != 'meeting_days' || document.getElementById('dayFilter').checked)
        {
            endpoints += `&${key}=${paramsDict[key]}`
        }
    }
    console.log(endpoints);
    fetch(baseURL + endpoints, { mode: 'no-cors' })
        .then(response => response.json())
        .then(showCourses);
}

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

const showCourses = (courses) => {
    document.getElementById('search-results').innerHTML = ``;
    if (courses.length == 0) {
        document.getElementById('search-results').innerHTML = '<p>No courses found</p>'
    }
    for (course of courses) {
        if ((course.meeting_days == null) || (course.start_time == null) || (course.end_time == null)){
            // Handle case where meeting times not set
            document.getElementById('search-results').innerHTML += `
            <div id='search-card'>
                <h1>${course.subject} ${course.catalog_num}</h1>
                <p>${course.title}</p>
                <p>${course.instructor}</p>
                <p>- Meeting times not provided -</p>
            </div>
            `;
        } else {
            document.getElementById('search-results').innerHTML += `
            <div id='search-card'>
                <h1>${course.subject} ${course.catalog_num}</h1>
                <p>${course.title}</p>
                <p>${course.instructor}</p>
                <p>${course.meeting_days}  ${toAMPM(course.start_time)}-${toAMPM(course.end_time)}</p>
            </div>
            `;
        }
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

const showDayFilter = () => {
    var checkboxes = document.getElementById('days-checkboxes');
    if (document.getElementById('dayFilter').checked) {
        checkboxes.style.display = "inline-block";
    }
    else {
        checkboxes.style.display = "none";
    }
}