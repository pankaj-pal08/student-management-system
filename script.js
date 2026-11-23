let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const search = document.getElementById("search");

function getGrade(marks) {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 40) return "D";
    return "F";
}

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

function updateDashboard() {
    document.getElementById("totalStudents").textContent = students.length;

    let total = students.reduce((sum, student) => sum + student.marks, 0);

    let average = students.length
        ? (total / students.length).toFixed(2)
        : 0;

    document.getElementById("averageMarks").textContent = average;
}

function displayStudents(data = students) {
    studentList.innerHTML = "";

    data.forEach((student) => {
        const index = students.indexOf(student);

        const row = document.createElement("tr");

        [student.name, student.roll, student.course,
         student.marks, getGrade(student.marks)].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editStudent(index);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.background = "#dc2626";
        deleteButton.style.marginLeft = "5px";
        deleteButton.onclick = () => deleteStudent(index);

        actions.append(editButton, deleteButton);
        row.appendChild(actions);

        studentList.appendChild(row);
    });

    updateDashboard();
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const course = document.getElementById("course").value.trim();
    const marks = Number(document.getElementById("marks").value);

    if (!name || !roll || !course || marks < 0 || marks > 100) {
        alert("Please enter valid student details.");
        return;
    }

    const duplicate = students.some((student, index) =>
        student.roll.toLowerCase() === roll.toLowerCase() &&
        index !== editIndex
    );

    if (duplicate) {
        alert("This Roll Number already exists!");
        return;
    }

    const student = { name, roll, course, marks };

    if (editIndex === -1) {
        students.push(student);
    } else {
        students[editIndex] = student;
        editIndex = -1;
        document.getElementById("submitBtn").textContent = "Add Student";
    }

    saveData();
    displayStudents();
    form.reset();
});

function editStudent(index) {
    const student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("roll").value = student.roll;
    document.getElementById("course").value = student.course;
    document.getElementById("marks").value = student.marks;

    editIndex = index;
    document.getElementById("submitBtn").textContent = "Update Student";
    document.querySelector(".form-section").scrollIntoView();
}

function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);
        saveData();
        displayStudents();
    }
}

search.addEventListener("input", function() {
    const query = search.value.toLowerCase();

    const filtered = students.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.roll.toLowerCase().includes(query)
    );

    displayStudents(filtered);
});

displayStudents();