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

const showCourses = (response) => {
    console.log(response);
}