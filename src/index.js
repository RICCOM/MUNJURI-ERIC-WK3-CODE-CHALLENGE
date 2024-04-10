// Your code here
document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch all movie titles from the server and display them
    function fetchAndDisplayMovieTitles() {
        fetch("http://localhost:3000/films")
            .then(res => res.json())
            .then(data => {
                displayMovieTitles(data);
                fetchAndDisplayMovieDetails(1); // Fetch details of the first movie
            })
            .catch(error => {
                console.error('Error fetching movie titles:', error);
            });
    }
    // Function to display movie titles
    function displayMovieTitles(titles) {
        const titleList = document.querySelector("ul#films");
        titleList.innerHTML = ""; // Clear existing content
        titles.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.title}`;
            listItem.className = "film item";
            titleList.appendChild(listItem);

            const deleteButton = createDeleteButton(item.id);
            listItem.appendChild(deleteButton);

            // Add click event listener to display movie details when a title is clicked
            listItem.addEventListener('click', () => {
                fetchAndDisplayMovieDetails(item.id);
            });
        });
    }
   // Function to create delete button for each movie
    function createDeleteButton(movieId) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = " X";
        deleteButton.addEventListener("click", () => {
            deleteMovie(movieId);
        });
        return deleteButton;
    }

    // Function to delete a movie
    function deleteMovie(movieId) {
        fetch(`http://localhost:3000/films/${movieId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => {
            alert("DELETE ERROR");
            console.error('Error deleting movie:', error);
        });
    }

    // Function to fetch and display movie details
    function fetchAndDisplayMovieDetails(movieId) {
        fetch(`http://localhost:3000/films/${movieId}`)
            .then(res => res.json())
            .then(data => {
                displayMovieDetails(data);
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
            });
    }

    // Function to display movie details
    function displayMovieDetails(movieData) {
        document.querySelector("#title").textContent = movieData.title;
        document.querySelector("#runtime").textContent = `${movieData.runtime} minutes`;
        document.querySelector("#film-info").textContent = movieData.description;
        document.querySelector("#showtime").textContent = movieData.showtime;
        const remainingTickets = movieData.capacity - movieData.tickets_sold;
        document.querySelector("#ticket-num").textContent = remainingTickets;
        document.querySelector("#poster").src = movieData.poster;
        document.querySelector("#poster").alt = movieData.title;
    }

    // Function to add event listener to "Buy Tickets" button
    function addBuyTicketEventListener(movieData) {
        document.querySelector("button#buy-ticket").addEventListener("click", () => {
            buyTicket(movieData);
        });
    }

    // Function to handle buying tickets
    function buyTicket(movieData) {
        let remainingTickets = movieData.capacity - movieData.tickets_sold;
        if (remainingTickets > 0) {
            movieData.tickets_sold += 1;
            remainingTickets = movieData.capacity - movieData.tickets_sold;
            document.querySelector("span#ticket-num").textContent = remainingTickets;
            newTickets({
                film_id: movieData.id,
                number_of_tickets: remainingTickets
            });
            updatePayment(movieData, movieData.id);
        } else {
            const buyTicketButton = document.querySelector("button#buy-ticket");
            buyTicketButton.textContent = "Sold Out";
            buyTicketButton.disabled = true;
            const soldOutFilm = document.querySelector("ul#films li");
            soldOutFilm.className = "sold out film item";
        }
    }

    // Function to update payment details
    function updatePayment(movieData, id) {
        fetch(`http://localhost:3000/films/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(movieData)
        })
        .then(res => res.json())
        .then(movie => {
            console.log(movie);
        })
        .catch(error => {
            alert("ERROR");
            console.error('Error updating payment:', error);
        });
    }

    // Function to add new tickets
    function newTickets(result) {
        fetch("http://localhost:3000/films", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(result)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            alert("ERROR");
            console.error('Error adding new tickets:', error);
        });
    }

    // Fetch all movie titles when the DOM content is loaded
    fetchAndDisplayMovieTitles();
});
