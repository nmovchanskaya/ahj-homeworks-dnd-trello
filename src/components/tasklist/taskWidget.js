import Task from './task';
import TaskList from './taskList';
import data from './tasks.json';

export default class TaskWidget {
  constructor(taskType, typeName) {
    this.taskType = taskType;
    this.containerName = `column_${taskType}`;
    this.taskList = new TaskList(taskType, typeName);

    this.onAddTask = this.onAddTask.bind(this);
    this.onAddSubmit = this.onAddSubmit.bind(this);
    this.onAddCancel = this.onAddCancel.bind(this);
    this.onClickProduct = this.onClickProduct.bind(this);
  }

  addFormMarkup() {
    return `
        <textarea class="task__add_input" name="task_text" placeholder="Type description of new task" rows="5" cols="25" required></textarea>
        <input type="submit" value="Add task" class="task__add_submit">
        <input type="button" value="Cancel" class="task__add_cancel">
    `;
  }

  bindToDOM() {
    this.container = document.querySelector(`.${this.containerName}`);

    this.container.addEventListener('click', this.onClickProduct);
  }

  bindToDOMAdd() {
    this.addForm = this.container.querySelector('.task__add_form');
    this.addButton = this.container.querySelector('.task__button_add');
    this.taskTextElem = this.addForm.querySelector('[name="task_text"]');

    this.cancelButtonAdd = this.addForm.querySelector('.task__add_cancel');

    this.addButton.addEventListener('click', this.onAddTask);
    this.cancelButtonAdd.addEventListener('click', this.onAddCancel);
    this.addForm.addEventListener('submit', this.onAddSubmit);
  }

  renderTask(task) {
    return `
        <div class="task" data-id="${task.id}">
            ${task.text}
            <div class="task_delete" data-id="${task.id}">x</div>
        </div>
    `;
  }

  renderTasks() {
    const addButton = this.container.querySelector('.task__button_add');
    const div = document.createElement('div');
    div.className = 'task__container';
    div.classList.add(`task__container_${this.taskType}`);
    div.dataset.type = this.taskType;
    this.container.insertBefore(div, addButton);
    this.taskList.tasks.forEach((item) => {
      const elemCode = this.renderTask(item);
      div.insertAdjacentHTML('beforeend', elemCode);
    });
    this.taskContainer = div;
  }

  renderContent() {
    // render list of tasks for this column
    this.renderTasks();

    // render add form
    const addForm = document.createElement('form');
    addForm.className = 'task__add_form';
    addForm.name = `task__add_form_${this.taskType}`;
    addForm.innerHTML = this.addFormMarkup();
    this.container.insertBefore(addForm, null);

    // add listeners
    this.bindToDOMAdd();
  }

  onAddTask(e) {
    this.addForm.classList.toggle('task__add_form_active');
  }

  clearTasks() {
    const tasks = Array.from(this.taskContainer.querySelectorAll('.task'));
    tasks.forEach((item) => {
      item.remove();
    });
  }

  updateTasks() {
    this.taskList.tasks.forEach((item) => {
      const elemCode = this.renderTask(item);
      this.taskContainer.insertAdjacentHTML('beforeend', elemCode);
    });
  }

  onAddSubmit(e) {
    e.preventDefault();

    const text = this.taskTextElem.value.trim();
    this.taskList.add(new Task(text));
    this.taskTextElem.value = '';
    this.addForm.classList.toggle('task__add_form_active');

    // refresh list of tasks
    this.clearTasks();
    this.updateTasks();
  }

  onAddCancel(e) {
    this.taskTextElem.value = '';
    this.addForm.classList.toggle('task__add_form_active');
  }

  onClickProduct(e) {
    if (e.target.className === 'task_delete') {
      this.taskList.remove(Number(e.target.dataset.id));
      e.target.closest('div.task').remove();
    }
  }

  update(tasks) {
    this.taskList.update(tasks);
  }
}
