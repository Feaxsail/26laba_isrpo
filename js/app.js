// // Default export
// export default class APIService {
//     constructor(baseURL) {
//         this.baseURL = baseURL;
//     }

//     async fetchData(endpoint) {
//         return `Fetching from ${this.baseURL}${endpoint}`
//     }
// }

// export const API_URL = "https://api.example.com";
// export const TIMEOUT = 5000;

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = "all";
        this.init();
    }

    init() {
        this.renderTasks();
        this.attachEventListeners();
    }

    loadTasks() {
        const savedTasks = localStorage.getItem("tasks");
        return savedTasks ? JSON.parse(savedTasks) : [];
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    addTask(text) {
        if (!text?.trim()) return;
        const task = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
        };
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find((t) => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case "active":
                return this.tasks.filter((t) => !t.completed);
            case "completed":
                return this.tasks.filter((t) => t.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const taskList = document.getElementById("taskList");
        const filteredTasks = this.getFilteredTasks();
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Задач нет</p>';
        } else {
            taskList.innerHTML = filteredTasks.map((task) => `<div class="task-item ${task.completed ? "completed" : ""}">
            <div class="task-content">
            <input
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? "checked" : ""} 
            data-id="${task.id}"> 
            <span class="task-text">${task.text}</span> 
            </div> 
            <button class="task-delete" data-id="${task.id}">Удалить</button> 
            </div>`
        ).join("");
        }
        this.updateStats();
    }

    updateStats() {
        document.getElementById("totalTasks").textContent = this.tasks.length;
        document.getElementById("completedTasks").textContent = this.tasks.filter((t) => t.completed).length;
    }

    attachEventListeners() {
        document.getElementById("addTask").addEventListener("click", () => {
            const input = document.getElementById("taskInput");
            this.addTask(input.value);
            input.value = "";
        });
        
        document.getElementById("taskInput").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.addTask(e.target.value);
                e.target.value = "";
            }
        });

        document.getElementById("taskList").addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            if (e.target.classList.contains("task-checkbox")) {
                this.toggleTask(id);
            } else if (e.target.classList.contains("task-delete")) {
                this.deleteTask(id);
            }
        });

        document.querySelectorAll(".filter-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
                e.target.classList.add("active");
                this.currentFilter = e.target.dataset.filter;
                this.renderTasks();
            });
        });
    }
}

const app = new TaskManager();