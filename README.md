# Brutus.nu


## Problem & Related Work
Each quarter, Northwestern students must go through the tumultuous process of deciding which classes they are going to take for the next term. For many, this requires referencing several different websites in order to figure out not only which classes are offered next quarter, but also the descriptions and required prerequisites for each course. Currently there are several websites, such as CAESAR, serif.nu, and department websites, that each provide some of this information, but there is no single website where all of this information is easily accessible all at once. This results in many students, especially underclassmen with little knowledge of the typical structure and sequence of courses, spending an undue amount of time and stress figuring out by themselves which courses they should be taking.

Thus, the goal of Brutus.nu is to provide a concise tool that streamlines the course registration process. In developing our design concept, we wanted to implement the ability to select and display courses in a visual calendar representation like serif.nu while also providing additional information about prerequisites, typical course order, and CTEC course evaluations. We intended the website to act as a digital advisor, offering students personalized resources to find the best course options for an upcoming quarter in a given subject or field based on what prerequisites they have satisfied already.


## User Research
In conducting user research, we hoped to find what students found difficult in deciding on courses and registering for them.

Our research approach was to observe users mock-registering for a class, then interview them about their thoughts on the course registration process.

Users need to have CAESAR to work as expected and have more scheduling options. During interviews, we found it surprising how many students did not know of CAESAR functionalities that would have helped with some issues they were facing, such as searching by class time or department. Some students also did not know of other registration resources that were available to them, such as serif.nu and the department course listings. When designing the layout of Brutus.nu, it would be imperative to make sure that all the information that is needed by the user is presented in such a way that is intuitive, concise, and appealing. A key area of innovation we found was in the presentation of information, specifically what information is present and how it is presented visually.

We envisioned three types of people using our platform: one who is unaware of many resources available to find information about courses, one who is aiming to achieve many things and trying to take many courses as efficiently as possible, and one who is just trying to find whatever works.


## Paper Prototyping
https://drive.google.com/open?id=1FYgPBHNfmug0V_ZNX9Yl0htmt-qQnRWM

In this prototype, people were generally able to use this, but were not able to use our platform as fully as we envisioned. People did not notice that there was a requirements tab to look at when deciding what classes to take, people wanted to select multiple subjects at once, and for some, the users did things where the behavior of what should happen was undetermined, such as the “search by days” feature, where if the days chosen would be exclusively those days or if it should be any days that include the selected days.

Based off of these observations, we believed that it was imperative that we design the interface such that everything that is available should be very clear in a way that was intuitive and uncluttered.


## High-Fidelity Prototyping
### Account Management
![Login Screen]() ![Create Account Screen]()

For the first component, we implemented the login and signup functionality for the prototype. We chose to do this for two reasons. Firstly, we weren’t able to start on the key search feature of our platform yet, the class search interactive data filter because we had to wait for our API key request to be approved and distributed through the Northwestern ASG course data API that we chose to use. Secondly, we wanted to start working on the personalized account section early as we saw that as the key way to distinguish ourselves from serif.nu and other similar products. By implementing the account features early, we were able to get an early implementation of our major requirements section up and running to show it to our users in testing and get their feedback on the overall benefit this feature would provide. In all, this component served the purpose of facilitating the task of searching and managing the major requirements on the sidebar of the page.

### Class Search
![Class Search Image]()

For the second component, we implemented the class search interactive data filter. As this feature is the core functionality of what our site must provide, we thought it would be crucial to have an implementation working as soon as possible so that we would have as much time as possible to get feedback and iterate on its design. To build the backend of this component we used Northwestern ASG’s course data API in order to get the class data for each quarter. Using this API, the component we implemented is able to search through this API and provide detailed and well-formatted information on every class offered in a given quarter. This component facilitates the task of searching through the classes offered in the coming quarter so that users can gather information about the possible classes they could take.

### Calendar
![Calendar Image]()

The final major component we implemented was the interactive calendar, which enables users to build out their schedule visually in conjunction with the textual information in the class search component. The calendar enables users to add, remove, and view classes in their schedule visually as they decide which classes they want to take for the next quarter.


### Reflection
In the time we had, we created a course planning website that can search through and display information on courses offered at Northwestern, and then facilitate the creation of schedules through the interactive calendar. Additionally, the site displays the requirements of the users major so that they can more easily know which classes they need to take in order to fulfill their major.

If we were given more time, we would try to implement the following:
* Multiple calendars and overlapping courses
* Scrape up-to-date class information
* More search filter options
* Expand prerequisites and requirements functionalities
* Use NU’s login passport system
    * Could allow us to use CTEC information
