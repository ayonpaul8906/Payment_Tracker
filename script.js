const students = [
    { name: 'Raima', lastPayment: null },
    { name: 'Khushi', lastPayment: null },
    { name: 'Sonaxi', lastPayment: null },
    { name: 'Piyush', lastPayment: null }
];

const tableBody = document.getElementById('paymentTableBody');
const paymentForm = document.getElementById('paymentForm');
const currentStudentName = document.getElementById('currentStudentName');
let selectedStudent = null;

const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

// Load students from localStorage or fallback to default
function loadStudents() {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
        return JSON.parse(storedStudents);
    }
    return students;
}

// Save students to localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Populate initial student records from stored data
function populateStudents() {
    const studentsData = loadStudents();
    tableBody.innerHTML = ''; // Clear existing rows
    studentsData.forEach(student => addStudentRow(student));
}

function addStudentRow(student) {
    const row = tableBody.insertRow();
    row.innerHTML = `
        <td><button onclick="selectStudent('${student.name}')" class="edit-btn">${student.name}</button></td>
        <td class="amount">${student.lastPayment ? student.lastPayment.amount : 'N/A'}</td>
        <td class="month">${student.lastPayment ? student.lastPayment.month : 'N/A'}</td>
        <td class="date">${student.lastPayment ? student.lastPayment.date : 'N/A'}</td>
        <td class="actions">
            <button onclick="deletePayment('${student.name}')" class="delete-btn">Delete</button>
        </td>
    `;
    row.dataset.name = student.name;
}

function selectStudent(name) {
    selectedStudent = students.find(student => student.name === name);
    currentStudentName.textContent = name;
    document.getElementById('paymentFormSection').style.display = 'block';
}

paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selectedStudent) return;

    const amount = document.getElementById('amount').value;
    const monthInput = document.getElementById('month').value;
    const date = document.getElementById('date').value;

    // Extract the month name
    const [year, month] = monthInput.split("-");
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Update selected student's last payment details
    selectedStudent.lastPayment = { amount, month: monthName, date };

    // Update the table row with the latest payment information
    const row = Array.from(tableBody.rows).find(row => row.dataset.name === selectedStudent.name);
    if (row) {
        row.querySelector('.amount').textContent = amount;
        row.querySelector('.month').textContent = monthName;
        row.querySelector('.date').textContent = date;
    }

    saveStudents(); // Save data to localStorage
    paymentForm.reset();
    selectedStudent = null;
    currentStudentName.textContent = 'Student';
    document.getElementById('paymentFormSection').style.display = 'none';
});

function deletePayment(name) {
    const student = students.find(student => student.name === name);
    if (student) {
        student.lastPayment = null;

        // Update the table row to clear the payment information
        const row = Array.from(tableBody.rows).find(row => row.dataset.name === name);
        if (row) {
            row.querySelector('.amount').textContent = 'N/A';
            row.querySelector('.month').textContent = 'N/A';
            row.querySelector('.date').textContent = 'N/A';
        }

        saveStudents(); // Save updated data to localStorage
    }
}

// Initialize the page by loading student data from localStorage
window.onload = function () {
    populateStudents();
};
