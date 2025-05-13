const hamburger = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('nav ul');
const nav = document.querySelector('nav');

if (hamburger && nav && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        nav.classList.toggle('responsive');
    });

    navMenu.addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && nav.classList.contains('responsive')) {
            hamburger.classList.remove('open');
            nav.classList.remove('responsive');
        }
    });
}

// Dynamic Footer Content
const currentYearSpan = document.getElementById("currentyear");
const lastModifiedParagraph = document.getElementById("lastModified");

if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

if (lastModifiedParagraph) {
    lastModifiedParagraph.textContent = `Last Modified: ${document.lastModified}`;
}

// Course List Array
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
];

const certificateSection = document.querySelector(".certificate-courses");
const allCoursesButton = document.getElementById("allCourses");
const wddCoursesButton = document.getElementById("wddCourses");
const cseCoursesButton = document.getElementById("cseCourses");
const totalCreditsElement = document.getElementById("totalCredits");

function displayCourses(courseList) {
    console.log("displayCourses called with:", courseList);
    if (!certificateSection) {
        console.warn("certificateSection is null or undefined");
        return;
    }
    certificateSection.innerHTML = "";

    if (courseList && courseList.length > 0) {
        console.log("courseList has courses, displaying them");
        certificateSection.style.display = "grid"; // Show the section
        courseList.forEach(course => {
            const courseCard = document.createElement("div");
            courseCard.classList.add("course-card");
            courseCard.classList.add(course.subject.toLowerCase() + "-course");

            if (course.completed) {
                courseCard.classList.add("completed");
            } else {
                courseCard.classList.add("not-completed");
            }

            const titleHeading = document.createElement("h3");
            titleHeading.textContent = course.title;

            const codeParagraph = document.createElement("p");
            codeParagraph.textContent = `Code: ${course.subject} ${course.number}`;

            const creditsParagraph = document.createElement("p");
            creditsParagraph.textContent = `Credits: ${course.credits}`;

            const descriptionParagraph = document.createElement("p");
            descriptionParagraph.textContent = course.description;

            const technologyParagraph = document.createElement("p");
            technologyParagraph.textContent = `Technology: ${course.technology.join(", ")}`;

            courseCard.appendChild(titleHeading);
            courseCard.appendChild(codeParagraph);
            courseCard.appendChild(creditsParagraph);
            courseCard.appendChild(descriptionParagraph);
            courseCard.appendChild(technologyParagraph);
            certificateSection.appendChild(courseCard);
        });

        updateTotalCredits(courseList);
    } else {
        console.log("courseList is empty, hiding section");
        certificateSection.style.display = "none"; // Hide if no courses
    }
}

function filterCourses(type) {
    let filteredCourses;
    console.log("filterCourses called with type:", type);
    if (type === "WDD") {
        filteredCourses = courses.filter(course => course.subject === "WDD");
    } else if (type === "CSE") {
        filteredCourses = courses.filter(course => course.subject === "CSE");
    } else {
        filteredCourses = [...courses];
    }
    console.log("Filtered courses:", filteredCourses);
    displayCourses(filteredCourses);
}

function updateTotalCredits(courseList) {
    if (totalCreditsElement) {
        const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
        totalCreditsElement.textContent = `Total Credits: ${totalCredits}`;
    }
}

// Event listeners for filter buttons
if (allCoursesButton) {
    allCoursesButton.addEventListener("click", () => {
        console.log("All Courses button clicked");
        filterCourses("All");
    });
}

if (wddCoursesButton) {
    wddCoursesButton.addEventListener("click", () => {
        console.log("WDD Courses button clicked");
        filterCourses("WDD");
    });
}

if (cseCoursesButton) {
    cseCoursesButton.addEventListener("click", () => {
        console.log("CSE Courses button clicked");
        filterCourses("CSE");
    });
}

// Initially hide the certificate section.
if (certificateSection) {
    certificateSection.style.display = "none";
    console.log("Initial display style set to none");
} else {
    console.warn("certificateSection is null on initial load");
}
