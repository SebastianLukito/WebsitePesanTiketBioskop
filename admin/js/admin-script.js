document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplay('films');
    fetchAndDisplay('cinemas');
    fetchAndDisplay('schedules');
    fetchAndDisplay('tickets');

    document.getElementById('filmForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitData('films');
    });

    document.getElementById('cinemaForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitData('cinemas');
    });

    document.getElementById('scheduleForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitData('schedules');
    });

    document.getElementById('ticketForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitData('tickets');
    });
});

// General function to fetch and display data
function fetchAndDisplay(table) {
    fetch(`http://localhost:3000/${table}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById(`${table}Table`).getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear the table first
            data.forEach(item => {
                let row = tableBody.insertRow();
                for (let key in item) {
                    let cell = row.insertCell();
                    cell.textContent = item[key];
                }
                let actionCell = row.insertCell();
                actionCell.innerHTML = `<button onclick="editItem('${table}', ${item.id})">Edit</button>
                                        <button onclick="deleteItem('${table}', ${item.id})">Delete</button>`;
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to handle data submission for all forms
function submitData(table) {
    const form = document.getElementById(`${table}Form`);
    const id = form.querySelector('input[type="hidden"]').value;
    const formData = new FormData(form);
    let data = {};
    formData.forEach((value, key) => data[key] = value);

    const url = `http://localhost:3000/${table}` + (id ? `/${id}` : '');
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        fetchAndDisplay(table);
        form.reset(); // Reset the form after successful submission
        form.querySelector('input[type="hidden"]').value = ''; // Clear hidden ID field
    })
    .catch(error => console.error('Error submitting data:', error));
}

// Function to load data into forms for editing
function editItem(table, id) {
    const url = `http://localhost:3000/${table}/${id}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const form = document.getElementById(`${table}Form`);
            for (let key in data) {
                if (form.elements[key]) {
                    form.elements[key].value = data[key];
                }
            }
            form.querySelector('input[type="hidden"]').value = id; // Set the hidden ID field for updates
        })
        .catch(error => console.error('Error loading item:', error));
}

// Function to delete items
function deleteItem(table, id) {
    const url = `http://localhost:3000/${table}/${id}`;

    fetch(url, { method: 'DELETE' })
        .then(response => response.json())
        .then(() => {
            fetchAndDisplay(table);
        })
        .catch(error => console.error('Error deleting item:', error));
}
