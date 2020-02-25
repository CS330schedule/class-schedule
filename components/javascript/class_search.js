const baseURL = "http://api.asg.northwestern.edu/courses/?key=eQSCJbgt58PVr9KC"

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

const showCourses = (courses) => {
    for (course of courses) {
        document.getElementById('search-results').innerHTML += `
        <div id='search-card'>
            <h1>${course.title}</h1>
            <p>${course.subject} ${course.catalog_num}</p>
            <p>${course.instructor}</p>
            <p>${course.meeting_days}  ${course.start_time}-${course.end_time}</p>
        </div>
        `;
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
        checkboxes.style.display = "block";
    }
    else {
        checkboxes.style.display = "none";
    }
}