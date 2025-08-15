console.log('connected');
function selecttext() {
  const input = document.getElementById('input');
  input.select();
}

function addTask() {
  const input = document.getElementById('input');
  const taskText = input.value.trim();
  if (!taskText) return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, status: "Pending" });
  saveTasks(tasks);

  renderTask({ text: taskText, status: "Pending" });
  input.value = "";
}
const input = document.getElementById('input');
input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTask();
  }
});

document.getElementById('clear-all').addEventListener('click', () => {
  const taskList = document.getElementById('task-ul');
  taskList.innerHTML = ''; 
  localStorage.removeItem('tasks'); 
});

document.getElementById('add-button').addEventListener('click', addTask);



document.getElementById('input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTask();
  }
});


function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    renderTask(task);
  });
}

function renderTask(task, status = 'Pending') {
  const taskList = document.getElementById("task-ul");

  const newTask = document.createElement("li");
  newTask.className = "flex items-center justify-between px-2 py-2 border-b";

  
  const taskContent = document.createElement("span");
  taskContent.className = "flex-grow";
  taskContent.textContent = task.text || task;

  
  const statusButton = document.createElement("button");
  statusButton.className = "flex items-center justify-center w-6 h-6 cursor-pointer";
  statusButton.innerHTML = getStatusIcon(status);
  statusButton.title = status;

  
  const deleteButton = document.createElement("button");
  deleteButton.className = "px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700";
  deleteButton.textContent = "🗑️";

  
  const editButton = document.createElement("button");
  editButton.className = "px-2 py-1 ml-2 text-white bg-blue-500 rounded hover:bg-blue-700";
  editButton.textContent = "✏️";

  
  const saveButton = document.createElement("button");
  saveButton.className = "hidden px-2 py-1 ml-2 text-white bg-green-600 rounded hover:bg-green-800";
  saveButton.textContent = "✔️";

  
  const cancelButton = document.createElement("button");
  cancelButton.className = "hidden px-2 py-1 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700";
  cancelButton.textContent = "❌";

  
  newTask.appendChild(taskContent);
  newTask.appendChild(statusButton);
  newTask.appendChild(deleteButton);
  newTask.appendChild(editButton);
  newTask.appendChild(saveButton);
  newTask.appendChild(cancelButton);
  taskList.appendChild(newTask);

  
  deleteButton.onclick = function () {
    taskList.removeChild(newTask);
    removeTask(task.text || task);
  };

  
  const popup = createStatusPopup(statusButton, status, (newStatus) => {
    statusButton.innerHTML = getStatusIcon(newStatus);
    statusButton.title = newStatus;
    updateTaskStatus(task.text || task, newStatus);
    popup.style.display = 'none';
  });
  document.body.appendChild(popup);

  statusButton.addEventListener('click', (e) => {
    e.stopPropagation();
    positionPopup(statusButton, popup);
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  
  editButton.onclick = () => {
    
    const input = document.createElement("input");
    input.type = "text";
    input.value = taskContent.textContent;
    input.className = "flex-grow px-2 py-1 border border-gray-400 rounded";

    
    newTask.replaceChild(input, taskContent);

    
    statusButton.style.display = "none";
    deleteButton.style.display = "none";
    editButton.style.display = "none";

    
    saveButton.classList.remove("hidden");
    cancelButton.classList.remove("hidden");

    
    input.focus();

    
    saveButton.onclick = () => {
      const newText = input.value.trim();
      if (!newText) return alert("Task cannot be empty.");

      
      taskContent.textContent = newText;
      newTask.replaceChild(taskContent, input);

      
      statusButton.style.display = "";
      deleteButton.style.display = "";
      editButton.style.display = "";


      saveButton.classList.add("hidden");
      cancelButton.classList.add("hidden");


      updateTaskText(task.text || task, newText);


      task.text = newText;
    };

    
    cancelButton.onclick = () => {
      
      newTask.replaceChild(taskContent, input);

      
      statusButton.style.display = "";
      deleteButton.style.display = "";
      editButton.style.display = "";

      
      saveButton.classList.add("hidden");
      cancelButton.classList.add("hidden");
    };
  };
}


function removeTask(taskToRemoveText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter(t => t.text !== taskToRemoveText);
  saveTasks(updatedTasks);
}

window.onload = function () {
  loadTasks();
};

function getStatusIcon(status) {
  switch (status) {
    case 'Pending':
      return `
      <svg class="text-orange-500 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12" y2="16" />
      </svg>`;
    case 'On Hold':
      return `
      <svg class="text-blue-500 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="10 16 14 12 10 8" />
      </svg>`;
    case 'Completed':
      return `
      <svg class="text-green-500 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </svg>`;
    default:
      return '';
  }
}

function createStatusPopup(targetButton, currentStatus, onSelect) {
  const popup = document.createElement('div');
  popup.className = `
    hidden absolute flex p-2 space-x-3
    bg-white border border-gray-300 rounded shadow-lg
    w-40 h-12 z-50
  `;


  const statuses = ['Pending', 'On Hold', 'Completed'];

  statuses.forEach(status => {
    const btn = document.createElement('button');
    btn.innerHTML = getStatusIcon(status);
    btn.title = status;
    btn.className = "flex items-center justify-center w-8 h-8 rounded cursor-pointer hover:bg-gray-200";

    
    if (status === currentStatus) {
      btn.classList.add('ring-2', 'ring-indigo-500');
    }

    btn.onclick = (e) => {
      e.stopPropagation();
      onSelect(status);
    };
    popup.appendChild(btn);
  });

  return popup;
}

function positionPopup(button, popup) {
  const rect = button.getBoundingClientRect();

  
  const top = rect.bottom + window.scrollY + 5;
  const left = rect.left + window.scrollX;

  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
}

function updateTaskStatus(taskText, newStatus) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const idx = tasks.findIndex(t => t.text === taskText);
  if (idx > -1) {
    tasks[idx].status = newStatus;
    saveTasks(tasks);
  }
}
function updateTaskText(oldText, newText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const idx = tasks.findIndex(t => t.text === oldText);
  if (idx > -1) {
    tasks[idx].text = newText;
    saveTasks(tasks);
  }
}
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************
// ************************************




