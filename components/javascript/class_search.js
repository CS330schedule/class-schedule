const baseURL = "http://api.asg.northwestern.edu/courses/?key=eQSCJbgt58PVr9KC"

const getCourses = (paramsDict) => {
    let endpoints = "";
    for (var key in paramsDict) {
        endpoints += `&${key}=${paramsDict[key]}`
    }
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