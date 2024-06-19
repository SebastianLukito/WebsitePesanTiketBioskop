document.addEventListener('DOMContentLoaded', function() {
    fetchFilms();
});

function fetchFilms() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(data => {
            const filmList = document.getElementById('filmList');
            filmList.innerHTML = ''; // Clear the list first
            data.forEach(film => {
                const filmCard = document.createElement('div');
                filmCard.className = 'col-md-4 mb-4';
                filmCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${film.judul}</h5>
                            <p class="card-text">Duration: ${film.durasi} minutes</p>
                            <button class="btn btn-neon" onclick="viewFilmDetails(${film.id})">View Details</button>
                        </div>
                    </div>
                `;
                filmList.appendChild(filmCard);
            });
        })
        .catch(error => console.error('Error fetching films:', error));
}

function viewFilmDetails(filmId) {
    fetch(`http://localhost:3000/films/${filmId}`)
        .then(response => response.json())
        .then(film => {
            const filmDetailsSection = document.getElementById('filmDetailsSection');
            const filmDetails = document.getElementById('filmDetails');
            filmDetails.innerHTML = `
                <h3>${film.judul}</h3>
                <p>Duration: ${film.durasi} minutes</p>
                <p>Description: ${film.deskripsi || 'No description available.'}</p>
            `;
            fetchSchedule(filmId);
            filmDetailsSection.classList.remove('d-none');
            document.getElementById('filmListSection').classList.add('d-none');
        })
        .catch(error => console.error('Error fetching film details:', error));
}

function fetchSchedule(filmId) {
    fetch(`http://localhost:3000/schedules?filmId=${filmId}`)
        .then(response => response.json())
        .then(data => {
            const scheduleTableBody = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
            scheduleTableBody.innerHTML = ''; // Clear the table first
            data.forEach(schedule => {
                const row = scheduleTableBody.insertRow();
                row.insertCell(0).textContent = schedule.bioskop_nama;
                row.insertCell(1).textContent = new Date(schedule.waktu_mulai).toLocaleString();
                row.insertCell(2).innerHTML = `<button class="btn btn-neon" onclick="selectSchedule(${schedule.id})">Select</button>`;
            });
        })
        .catch(error => console.error('Error fetching schedule:', error));
}

function selectSchedule(scheduleId) {
    fetch(`http://localhost:3000/schedules/${scheduleId}`)
        .then(response => response.json())
        .then(schedule => {
            // Populate booking form with data
            document.getElementById('cinemaSelect').innerHTML = `<option value="${schedule.bioskop_id}">${schedule.bioskop_nama}</option>`;
            document.getElementById('timeSelect').innerHTML = `<option value="${schedule.waktu_mulai}">${new Date(schedule.waktu_mulai).toLocaleTimeString()}</option>`;
            
            document.getElementById('seatLayout').innerHTML = createSeatLayout();

            document.getElementById('bookingSection').classList.remove('d-none');
            document.getElementById('filmDetailsSection').classList.add('d-none');
        })
        .catch(error => console.error('Error fetching schedule details:', error));
}

function createSeatLayout() {
    const rows = 8;
    const cols = 10;
    let layout = '<div class="screen">Screen</div>';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            layout += `<div class="seat" onclick="selectSeat(this)"></div>`;
        }
    }
    return layout;
}

function selectSeat(seat) {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    selectedSeats.forEach(s => s.classList.remove('selected'));
    seat.classList.add('selected');
}

document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const cinemaId = document.getElementById('cinemaSelect').value;
    const date = document.getElementById('dateSelect').value;
    const time = document.getElementById('timeSelect').value;
    const seat = document.querySelector('.seat.selected') ? 'Row ' + (Math.floor(document.querySelector('.seat.selected').parentElement.children.selectedIndex / 10) + 1) + ', Seat ' + ((document.querySelector('.seat.selected').parentElement.children.selectedIndex % 10) + 1) : '';

    if (!seat) {
        alert('Please select a seat.');
        return;
    }

    const bookingDetails = {
        cinemaId,
        date,
        time,
        seat
    };

    document.getElementById('confirmationDetails').innerHTML = `
        <p>Cinema: ${cinemaId}</p>
        <p>Date: ${date}</p>
        <p>Time: ${new Date(time).toLocaleTimeString()}</p>
        <p>Seat: ${seat}</p>
    `;

    document.getElementById('bookingSection').classList.add('d-none');
    document.getElementById('confirmationSection').classList.remove('d-none');

    // Save booking details for confirmation
    window.bookingDetails = bookingDetails;
});

function goBack() {
    document.getElementById('filmDetailsSection').classList.add('d-none');
    document.getElementById('filmListSection').classList.remove('d-none');
}

function goBackToDetails() {
    document.getElementById('bookingSection').classList.add('d-none');
    document.getElementById('filmDetailsSection').classList.remove('d-none');
}

function goBackToBooking() {
    document.getElementById('confirmationSection').classList.add('d-none');
    document.getElementById('bookingSection').classList.remove('d-none');
}

function confirmBooking() {
    fetch('http://localhost:3000/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(window.bookingDetails)
    })
    .then(response => response.json())
    .then(data => {
        alert('Booking confirmed!');
        generateTicket(window.bookingDetails);
    })
    .catch(error => console.error('Error confirming booking:', error));
}

function generateTicket(details) {
    document.getElementById('confirmationSection').classList.add('d-none');
    document.getElementById('ticketSection').classList.remove('d-none');

    const ticket = document.getElementById('ticket');
    ticket.innerHTML = `
        <div class="details">
            <span class="cinema-name">${details.cinemaId}</span>
            <span>Date: ${details.date}</span>
            <span>Time: ${new Date(details.time).toLocaleTimeString()}</span>
            <span>Seat: ${details.seat}</span>
        </div>
        <div class="qrcode" id="qrcode"></div>
    `;

    // Generate QR Code
    QRCode.toCanvas(document.getElementById('qrcode'), JSON.stringify(details), function (error) {
        if (error) console.error(error);
        console.log('QR code generated!');
    });
}

function goBackToFilms() {
    document.getElementById('ticketSection').classList.add('d-none');
    document.getElementById('filmListSection').classList.remove('d-none');
}
