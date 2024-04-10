// Your code here
document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch movie data from the server
    fetch("http://localhost:3000/films")
        .then(res => res.json())
        .then(data => {
            let titleList = document.querySelector("ul#films");
            titleList.querySelector("li").remove();
            // Loop through each movie and create list items in the movie list
            data.forEach((item) => {
                let list = document.createElement("li");
                list.textContent = `${item.title} `;
                list.className = "film item";
                titleList.appendChild(list);
                let btn = document.createElement("button");
                btn.textContent = " X";
                list.appendChild(btn);
                // Event listener for delete button
                btn.addEventListener("click", (e) => {
                    e.target.parentNode.remove();
                    // DELETE request to remove movie from server
                    fetch(`http://localhost:3000/films/${item.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                    })
                        .then(res => res.json())
                        .then(data => console.log(data))
                        .catch(error => {
                            alert("DELETE ERROR");
                            console.log(error.message);
                        });
                });
            });
            // Function to display movie details based on ID
            function displayMovieDetails(movieId) {
                // GET request to obtain movie details from the server
                fetch(`http://localhost:3000/films/${movieId}`)
                    .then(res => res.json())
                    .then(data => {
                        // Display movie details
                        let title = document.querySelector("#title");
                        let movieTitle = document.createElement("p");
                        movieTitle.textContent = data.title;
                        title.textContent = "";
                        title.appendChild(movieTitle);
                        let runtime = document.querySelector("#runtime");
                        let runtimeMovie = document.createElement("p");
                        runtimeMovie.textContent = `${data.runtime} minutes`;
                        runtime.textContent = "";
                        runtime.appendChild(runtimeMovie);
                        let description = document.querySelector("#film-info");
                        let desMovie = document.createElement("p");
                        desMovie.textContent = data.description;
                        description.textContent = "";
                        description.appendChild(desMovie);
                        let showtime = document.querySelector("#showtime");
                        let showtimeMovie = document.createElement("p");
                        showtimeMovie.textContent = data.showtime;
                        showtime.textContent = "";
                        showtime.appendChild(showtimeMovie);
                        let remTickets = document.querySelector("#ticket-num");
                        let result = data.capacity - data.tickets_sold;
                        remTickets.textContent = result;
                        let image = document.querySelector("#poster");
                        image.src = data.poster;
                        image.alt = data.title;
                        // Update Buy Ticket button text and disable it if sold out
                        let buyBtn = document.querySelector("button#buy-ticket");
                        if (result === 0) {
                            buyBtn.textContent = "Sold Out";
                            buyBtn.disabled = true;
                            let soldOutFilm = titleList.querySelector("li");
                            soldOutFilm.className = "sold out film item";
                        }
                        else {
                            buyBtn.textContent = "Buy Ticket";
                            buyBtn.disabled = false;
                        }
                        // Event listener for Buy Ticket button
                        buyBtn.addEventListener("click", () => {
                            if (result > 0) {
                                data.tickets_sold += 1;
                                result = data.capacity - data.tickets_sold;
                                remTickets.textContent = result;
                                // Update tickets sold on server
                                updatePayment(data, data.id);
                                newTickets({
                                    film_id: data.id,
                                    number_of_tickets: result
                                });
                            }
                            else {
                                buyBtn.textContent = "Sold Out";
                                buyBtn.disabled = true;
                                let soldOutFilm = titleList.querySelector("li");
                                soldOutFilm.className = "sold out film item";
                            }
                        });
                    });
            }

            // Event listener for clicking on a movie title
            titleList.addEventListener("click", (event) => {
                if (event.target.classList.contains("film")) {
                    const movieId = event.target.dataset.id;
                    displayMovieDetails(movieId);
                }
            });

            // Display the details of the first movie initially
            displayMovieDetails(1);
        });

    // Function to update tickets sold on server
    function updatePayment(sold, id) {
        fetch(`http://localhost:3000/films/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(sold)
        })
            .then(res => res.json())
            .then(movie => {
                console.log(movie);
            })
            .catch((error) => {
                alert("ERROR");
                console.log(error.message);
            });
    }

    // Function to add new tickets to server
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
            .catch(function (error) {
                alert("ERROR");
                console.log(error.message);
            });
    }
});
