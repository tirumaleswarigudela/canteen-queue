async function joinQueue() {

    const name = document.getElementById("name").value;
    const food = document.getElementById("food").value;

    if (name === "" || food === "") {
        alert("Please enter your name and food");
        return;
    }

    const response = await fetch("/api/queue", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            food: food
        })
    });

    const data = await response.json();

    document.getElementById("result").innerHTML =
        "🎟️ Your Queue Number: " + data.queueNumber;

    document.getElementById("name").value = "";
    document.getElementById("food").value = "";

    loadQueue();
}

async function loadQueue() {

    const response = await fetch("/api/queue");

    const queue = await response.json();

    const list = document.getElementById("queueList");

    list.innerHTML = "";

    if (queue.length === 0) {
        list.innerHTML = "<p>No one is waiting.</p>";
        return;
    }

    queue.forEach(person => {

        const div = document.createElement("div");

        div.className = "queue-item";

        div.innerHTML =
            "🎟️ Queue " +
            person.id +
            " - " +
            person.name +
            " - " +
            person.food;

        list.appendChild(div);
    });
}

loadQueue();