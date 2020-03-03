const timeToNum = {
    '08:00': 1,'08:30': 2,'09:00': 3,'09:30': 4,'10:00': 5,'10:30': 6,'11:00': 7,'11:30': 8,'12:00': 9,'12:30': 10,'13:00': 11,
    '13:30': 12,'14:00': 13,'14:30': 14,'15:00': 15,'15:30': 16,'16:00': 17,'16:30': 18,'17:00': 19,'17:30': 20,'18:00': 21,
    '18:30': 22,'19:00': 23,'19:30': 24,'20:00': 25,'20:30':26,'21:00':27,'21:30':28
};



const courses = {}; // id of course: description of course

const addCourse = (desc) => {
    courses.put(desc.id, desc);
    createCalCell(desc);
}

const removeCourse = (desc) => {
    courses.delete(desc.id);
    removeCalCell(desc.id);
}

const createCalCell = (desc) => { // need to add the document.whatever stuff
    if (desc.start_time == null){ // should do something about this
        return;
    }

    // also, there are apparently very few classes that start/end on :15
    let start = '((100% - 30px)/28) * ${timeToNum[desc.start_time]}';
    let end   = '((100% - 30px)/28) * ${timeToNum[desc.end_time]}';

    // if it was removed before
    document.getElementsByTagName('head')[0].innerHTML += `
    <style>
    .${desc.id} {
        display:block;
    }
    </style>
    `;

    // makes a class-cell
    // change background color
    let template = `
    <div style='background-color:blue; height:calc(${end}px-${start}px); width:calc((((100% - 250px) * .6) - 64px) / 5); display:fixed; top:${start}px' class='class-cell' id=${desc.id}>
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