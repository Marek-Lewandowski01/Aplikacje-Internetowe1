document.getElementById('search-todo').addEventListener('input', (event) => {
  const searchTerm = event.target.value.toLowerCase();
  todo.filterTasks(searchTerm);
});

document.getElementById('task-name').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    document.getElementById('save-task').click();
  }
});

document.addEventListener('click', (event) => {
  const editingElement = document.querySelector('.editing');
  if (editingElement && !editingElement.contains(event.target)) {
    todo.exitEditMode();
  }
});

class Todo {
  constructor() {
    this.tasks = this.loadTasks();
    this.filteredTasks = [];
    this.filterTasks('');
  }

  draw() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    this.filteredTasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.dataset.index = index;
      const highlightedName = this.highlightText(task.name, document.getElementById('search-todo').value);
      li.innerHTML = `
        <input type="checkbox">
        <span class="task-name">${highlightedName}</span>
        <span>${task.date}</span>
        <button class="delete-task">Usuń</button>
      `;
      li.querySelector('.delete-task').addEventListener('click', () => {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.filterTasks(document.getElementById('search-todo').value.toLowerCase());
      });
      li.querySelector('.task-name').addEventListener('click', (e) => {
        e.stopPropagation();
        this.editTask(index);
      });
      todoList.appendChild(li);
    });
  }

  filterTasks(searchTerm) {
    if (searchTerm.length < 2) {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.name.toLowerCase().includes(searchTerm));
    }
    this.draw();
  }

  highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  editTask(index) {
    const currentEditing = document.querySelector('.editing');
    if (currentEditing) {
      this.exitEditMode();
    }

    const taskElement = document.querySelector(`[data-index="${index}"]`);
    const taskName = this.tasks[index].name;
    const taskDate = this.tasks[index].date;
    taskElement.classList.add('editing');
    taskElement.innerHTML = `
      <input type="text" value="${taskName}">
      <input type="date" value="${taskDate}">
      <button class="delete-task">Usuń</button>
    `;
    taskElement.querySelector('.delete-task').addEventListener('click', () => {
      this.tasks.splice(index, 1);
      this.saveTasks();
      this.filterTasks(document.getElementById('search-todo').value.toLowerCase());
    });
  }

  exitEditMode() {
    const editingElement = document.querySelector('.editing');
    if (editingElement) {
      const inputName = editingElement.querySelector('input[type="text"]');
      const inputDate = editingElement.querySelector('input[type="date"]');
      const newValueName = inputName.value;
      const newValueDate = inputDate.value;
      const index = editingElement.dataset.index;
      this.tasks[index].name = newValueName;
      this.tasks[index].date = newValueDate;
      editingElement.classList.remove('editing');
      this.saveTasks();
      this.draw();
    }
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }
}

const todo = new Todo();

document.getElementById('save-task').addEventListener('click', saveTask);

function saveTask() {
  const taskName = document.getElementById('task-name').value;
  const taskDate = document.getElementById('task-date').value;
  const today = new Date().toISOString().split('T')[0];

  if (taskName.length < 3 || taskName.length > 255) {
    alert('Nazwa zadania musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.');
    return;
  }

  if (!taskDate || taskDate <= today) {
    alert('Data musi być ustawiona i w przyszłości.');
    return;
  }

  if (taskName && taskDate > today) {
    todo.tasks.push({ name: taskName, date: taskDate });
    todo.saveTasks();
    todo.filterTasks(document.getElementById('search-todo').value.toLowerCase());
    document.getElementById('task-name').value = '';
    document.getElementById('task-date').value = '';
  }
}
