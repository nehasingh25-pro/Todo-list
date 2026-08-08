
let todos = [];

let currentFilter = "all";

async function loadTodos() {
    try {

        const response = await fetch("/.netlify/functions/api/todos");

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message);
        }

        todos = data;

        renderTodos();

    } catch (error) {

        console.log("Error loading todos:", error);

    }
}

const addButton = document.querySelector(".add-btn");

addButton.addEventListener("click", async function () {

    // Task lo
    const task = prompt("Enter your task:");

    if (task === null || task.trim() === "") {
        return;
    }


    // Category lo
    const category = prompt(
        "Enter category: Study, Coding or Personal"
    );

    if (category === null || category.trim() === "") {
        return;
    }


    // Category ko proper format me rakho
    const categoryName =
        category.trim().toLowerCase();


    if (
        categoryName !== "study" &&
        categoryName !== "coding" &&
        categoryName !== "personal"
    ) {

        alert(
            "Please enter only: Study, Coding or Personal"
        );

        return;
    }


    // Capital letter ke saath save karo
    let finalCategory;

    if (categoryName === "study") {
        finalCategory = "Study";
    }

    else if (categoryName === "coding") {
        finalCategory = "Coding";
    }

    else {
        finalCategory = "Personal";
    }


    try {

        const response = await fetch("/.netlify/functions/api/todos", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                title: task,

                category: finalCategory,

                completed: false,

                date: new Date()

            })

        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || data.message
            );

        }


        todos.push(data.todo);

        renderTodos();


    } catch (error) {

        console.log(
            "Error adding todo:",
            error
        );

    }

});



function renderTodos() {

    const oldRows = document.querySelectorAll(".todo-row");

    oldRows.forEach(function (row) {
        row.remove();
    });


   let filteredTodos = todos.filter(function (todo) {

    if (currentFilter === "active") {
        return todo.completed === false;
    }

    if (currentFilter === "completed") {
        return todo.completed === true;
    }

    if (currentFilter === "study") {
        return todo.category === "Study";
    }

    if (currentFilter === "coding") {
        return todo.category === "Coding";
    }

    if (currentFilter === "personal") {
        return todo.category === "Personal";
    }

    return true;

    });
    const searchInput = document.querySelector(".search");

    const searchText = searchInput.value.toLowerCase();


    filteredTodos = filteredTodos.filter(function (todo) {

        return todo.title.toLowerCase().includes(searchText);

    });


    filteredTodos.forEach(function (todo) {

        createTodoElement(todo);

    });


    updateStats();

}
function createTodoElement(todo) {

    const row = document.createElement("div");

    row.className = "todo-row";


    row.innerHTML = `

        <div class="task">

            <input
                type="checkbox"
                class="todo-checkbox"
                ${todo.completed ? "checked" : ""}
            >

            <span class="${todo.completed ? "completed-task" : ""}">
                ${todo.title}
            </span>

        </div>


        <span class="category">
            ${todo.category}
        </span>


        <span class="status ${todo.completed ? "completed" : "pending"}">
            ${todo.completed ? "Completed" : "Pending"}
        </span>


        <span class="date">
            ${todo.date || ""}
        </span>


        <div class="actions">

            <button class="edit-button">
                ✏️
            </button>

            <button class="delete-button">
                🗑️
            </button>

        </div>

    `;


    const checkbox =
        row.querySelector(".todo-checkbox");


    checkbox.addEventListener("change", async function () {

        try {

            const response = await fetch(`/.netlify/functions/api/todos/${todo._id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    completed: checkbox.checked
                })

            });


            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.error || data.message);
            }


            todo.completed = data.todo.completed;

            renderTodos();


        } catch (error) {

            console.log("Error updating todo:", error);

        }

    });
    const deleteButton =
        row.querySelector(".delete-button");


    deleteButton.addEventListener("click", async function () {

        try {

            const response = await fetch(`/.netlify/functions/api/todos/${todo._id}`, {

                method: "DELETE"

            });


            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.error || data.message);
            }


            todos = todos.filter(function (item) {

                return item._id !== todo._id;

            });
            renderTodos();


        } catch (error) {

            console.log("Error deleting todo:", error);

        }

    });
    const editButton =
        row.querySelector(".edit-button");


    editButton.addEventListener("click", async function () {

        const newTask = prompt(
            "Edit your task:",
            todo.title
        );
        if (
            newTask === null ||
            newTask.trim() === ""
        ) {
            return;
        }
        try {

            const response = await fetch(`/.netlify/functions/api/todos/${todo._id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: newTask
                })

            });


            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.error || data.message);
            }


            todo.title = data.todo.title;

            renderTodos();


        } catch (error) {

            console.log("Error editing todo:", error)
        }
     });

    const todoBox = document.querySelector(".todo-box");

    todoBox.appendChild(row);
}
const searchInput =
    document.querySelector(".search");
searchInput.addEventListener("input", function () {
renderTodos();
});
const navButtons =
    document.querySelectorAll(".nav-item");


navButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const text =
            button.innerText.toLowerCase();


       if (text.includes("all tasks")) {
    currentFilter = "all";
}
else if (text.includes("active")) {
    currentFilter = "active";
}
else if (text.includes("completed")) {
    currentFilter = "completed";
}
else if (text.includes("study")) {
    currentFilter = "study";
}
else if (text.includes("coding")) {
    currentFilter = "coding";
}
else if (text.includes("personal")) {
    currentFilter = "personal";
}
else {
    return;
}
navButtons.forEach(function (item) {
     item.classList.remove("active");
     });

        button.classList.add("active");


        renderTodos();

    });

});

function updateStats() {

    const total =
        todos.length;


    const completed =
        todos.filter(function (todo) {

            return todo.completed;

        }).length;
        const pending =
        total - completed;
         const statCards =
        document.querySelectorAll(".stat-card h2");


    if (statCards.length >= 3) {

        statCards[0].innerText = total;

        statCards[1].innerText = pending;

        statCards[2].innerText = completed;

    }

}

loadTodos();

