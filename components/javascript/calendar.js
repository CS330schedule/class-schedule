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
    <div style='background-color:blue; height:calc(((100% - 30px) / 30) * (${endTimeToNum[desc.end_time]} - ${timeToNum[desc.start_time]})); position:absolute; top:calc((((100% - 25px) / 30) * ${timeToNum[desc.start_time]}) + 5px)'; left:0; right:0; class='class-cell' id=${desc.id}>
        <p>${desc.start_time} - ${desc.end_time}</p>
        <p>${desc.subject} ${desc.catalog_num}</p>
    </div>
    `;
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
