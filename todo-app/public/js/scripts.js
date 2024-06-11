document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');


  async function fetchTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();

    if (tasks.length === 0) {
      taskList.innerHTML = '<p>Все задачи выполнены</p>';
    } else {
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="task">
            <span class="task-text" data-id="${task._id}">${task.title}</span>
          </div>
          <div class="task-actions">
            <select class="task-status" data-id="${task._id}">
              <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
            <button class="task-delete" data-id="${task._id}">Delete</button>
          </div>
      `;

        if (task.status === 'Completed') {
          li.querySelector('.task-text').classList.add('line-through');
          li.style.backgroundColor = 'green';
        } else {
          li.style.backgroundColor = 'yellow';
        }

        taskList.appendChild(li);
      });
    }
  }

  // Добавляем обработчик события для кнопок "Delete"
  taskList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('task-delete')) {
      const id = event.target.getAttribute('data-id');
      await fetch(`/tasks/${id}`, {
        method: 'DELETE',
      });
      fetchTasks();
      showNotificationDelete();
    }
  });

  // Добавляем обработчик события для изменения статуса задачи
  taskList.addEventListener('change', async (event) => {
    if (event.target.classList.contains('task-status')) {
      const id = event.target.getAttribute('data-id');
      const status = event.target.value;
      await fetch(`/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchTasks();
    }
  });

  // Добавляем обработчик события для отправки формы с новой задачей
  taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    taskForm.reset();
    fetchTasks();
    showNotificationAdd();
  });


  // Добавляем обработчик события для открытия модального окна

  function showNotificationDelete() {
    const notification = document.getElementById('notification_delete');
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000); // Уведомление исчезнет через 3 секунды
  }

  // Добавляем обработчик события для открытия модального окна
  function showNotificationEdit() {
    const notification = document.getElementById('notification_edit');
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000); // Уведомление исчезнет через 3 секунды
  }

  // Добавляем обработчик события для открытия модального окна
  function showNotificationAdd() {
    const notification = document.getElementById('notification_add');
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000); // Уведомление исчезнет через 3 секунды
  }

  // Добавляем обработчик события для редактирования задачи
  taskList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('task-text')) {
      const id = event.target.getAttribute('data-id');
      const content = event.target.textContent; // Получаем содержимое узла
      const input = document.createElement('input');
      input.type = 'text';
      input.value = content;
      input.classList.add('task-input');
      event.target.parentNode.replaceChild(input, event.target);

      input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
          const newContent = input.value;
          await fetch(`/tasks/title/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newContent }),
          });
          console.log(newContent);
          location.reload(); // Перезагрузить страницу после обновления задачи
          showNotificationEdit();
        }
      });
    }
  });


  // Вызываем функцию для загрузки задач при загрузке страницы
  fetchTasks();
});
