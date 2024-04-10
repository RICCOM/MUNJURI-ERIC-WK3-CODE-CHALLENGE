// Your code here
document.addEventListener('DOMContentLoaded', () => {
    // Fetch films data from the server
    fetch("http://localhost:3000/films")
        .then(res => res.json())
        .then(data => {

            let titleList = document.querySelector("ul#films");
            
            titleList.querySelector("li").remove();
            
            data.forEach((item) => {
                
                let list = document.createElement("li");
                list.textContent = `${item.title} `;
                list.className = "film item";
                list.dataset.id = item.id; 
                titleList.appendChild(list);

                let btn = document.createElement("button");
                btn.textContent = " X";
                list.appendChild(btn);

                // Event listener to delete the film
                btn.addEventListener("click", (e) => {
                    e.target.parentNode.remove();
                    
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
            function displayMovie(movieId) {
                fetch(`http://localhost:3000/films/${movieId}`)
                    .then(res => res.json())
                    .then(data => {
                        // Display movie details on the page
                        let title = document.querySelector("#title");
                        title.textContent = data.title;

                        let runtime = document.querySelector("#runtime");
                        runtime.textContent = `${data.runtime} minutes`;

                        let description = document.querySelector("#film-info");
                        description.textContent = data.description;

                        let showtime = document.querySelector("#showtime");
                        showtime.textContent = data.showtime;

                        let remTickets = document.querySelector("#ticket-num");
                        let result = data.capacity - data.tickets_sold;
                        remTickets.textContent = result;

                        let image = document.querySelector("#poster");
                        image.src = data.poster;
                        image.alt = data.title;

                        let buyTicketBtn = document.querySelector("button#buy-ticket");
                        // Check if tickets are available or sold out
                        if (result === 0) {
                            buyTicketBtn.textContent = "Sold Out";
                            buyTicketBtn.disabled = true;
                        } else {
                            buyTicketBtn.textContent = "Buy Ticket";
                            buyTicketBtn.disabled = false;
                        }

                        // Event listener for Buy Ticket button
                        buyTicketBtn.addEventListener("click", () => {
                            if (result > 0) {
                                data.tickets_sold++;
                                result = data.capacity - data.tickets_sold;
                                remTickets.textContent = result;
                                updatePayment(data, data.id);
                                newTickets({
                                    film_id: data.id,
                                    number_of_tickets: 1
                                });
                                if (result === 0) {
                                    buyTicketBtn.textContent = "Sold Out";
                                    buyTicketBtn.disabled = true;
                                    let soldOutFilm = titleList.querySelector("li");
                                    soldOutFilm.className = "sold out film item";
                                }
                            } else {
                                buyTicketBtn.textContent = "Sold Out";
                                buyTicketBtn.disabled = true;
                            }
                        });
                    })
                    .catch(error => console.error(error));
            }

            // Event listener for clicking on a movie title
            titleList.addEventListener("click", (event) => {
                if (event.target.classList.contains("film")) {
                    const movieId = event.target.dataset.id;
                    displayMovie(movieId);
                }
            });

            displayMovie(1);
        });

    // Updating payment details
    function updatePayment(sold, id) {
        fetch(`http://localhost:3000/films/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
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

    // Adding new tickets function
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
