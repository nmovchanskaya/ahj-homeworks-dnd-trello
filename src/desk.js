import TaskWidget from './components/tasklist/taskWidget';
import Task from './components/tasklist/task';

export default class Desk {
  constructor(containerName) {
    this.containerName = containerName;
    this.taskWidgetTodo = new TaskWidget('todo', 'To do');
    this.taskWidgetInprogress = new TaskWidget('inprogress', 'In progress');
    this.taskWidgetDone = new TaskWidget('done', 'Done');

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  bindToDOM() {
    this.container = document.querySelector(this.containerName);
    this.taskWidgetTodo.bindToDOM();
    this.taskWidgetInprogress.bindToDOM();
    this.taskWidgetDone.bindToDOM();
  }

  // return tasks inside the container
  getTasks(container, type) {
    const taskElems = Array.from(container.querySelectorAll('.task'));
    const tasks = [];
    taskElems.forEach((item) => {
      const txt = item.innerText.trim();
      tasks.push(new Task(txt.substring(0, txt.length - 2), type, Number(item.dataset.id)));
    });

    return tasks;
  }

  // update widget with the tasks
  updateWidgets(tasks, type) {
    if (type === 'todo') {
      this.taskWidgetTodo.update(tasks);
    } else if (type === 'inprogress') {
      this.taskWidgetInprogress.update(tasks);
    } else if (type === 'done') {
      this.taskWidgetDone.update(tasks);
    }
  }

  onMouseUp(e) {
    const mouseUpItem = e.target;
    const taskQty = e.target.querySelectorAll('.task').length;

    if (mouseUpItem.className === 'task') {
      const taskContainer = mouseUpItem.parentElement;

      taskContainer.insertBefore(this.actualElement, mouseUpItem);

      // update lists of tasks in memory
      const container = document.querySelector(`.task__container_${this.actualType}`);

      const tasks = this.getTasks(container, this.actualType);
      this.updateWidgets(tasks, this.actualType);

      // if we move task to another column - update it also
      if (taskContainer.dataset.type !== container.dataset.type) {
        const tasksTo = this.getTasks(taskContainer, taskContainer.dataset.type);
        this.updateWidgets(tasksTo, taskContainer.dataset.type);
      }

      if (this.taskWithSpace) {
        this.taskWithSpace.style.borderTop = 0;
      }

      this.actualElement.classList.remove('dragged');
      this.actualElement = undefined;

      document.documentElement.removeEventListener('mouseup', this.onMouseUp);
      document.documentElement.removeEventListener('mousemove', this.onMouseMove);
    }
    else if ((e.target.classList.contains('column')
      || e.target.classList.contains('column_title')
      || e.target.classList.contains('task__button_add'))
      && taskQty === 0) {
      // if we don't have any elements in target column - create first

      // find task container inside target column
      let taskContainer;
      if (e.target.classList.contains('column')) {
        taskContainer = e.target.querySelector('.task__container');
      } else {
        taskContainer = e.target.closest('div.column').querySelector('.task__container');
      }
      taskContainer.insertBefore(this.actualElement, null);

      const container = document.querySelector(`.task__container_${this.actualType}`);

      const tasks = this.getTasks(container, this.actualType);
      this.updateWidgets(tasks, this.actualType);

      const tasksTo = this.getTasks(taskContainer, taskContainer.dataset.type);
      this.updateWidgets(tasksTo, taskContainer.dataset.type);

      this.actualElement.classList.remove('dragged');
      this.actualElement = undefined;

      document.documentElement.removeEventListener('mouseup', this.onMouseUp);
      document.documentElement.removeEventListener('mousemove', this.onMouseMove);
    } else {
      // if we did mouse up in another place
      this.actualElement.classList.remove('dragged');
      this.actualElement = undefined;

      document.documentElement.removeEventListener('mouseup', this.onMouseUp);
      document.documentElement.removeEventListener('mousemove', this.onMouseMove);
    }
  }

  onMouseMove(e) {
    this.actualElement.style.top = `${e.clientY}px`;
    this.actualElement.style.left = `${e.clientX - this.shiftX}px`;

    // create space for the moving element
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.createEmptySpace(e), 200);
  }

  // create empty space before current task
  createEmptySpace(e) {
    if (this.taskWithSpace) {
      this.taskWithSpace.style.borderTop = 0;
    }

    if (this.actualElement) {
      if (e.target.className === 'task') {
        e.target.style.borderTop = `${this.actualElement.offsetHeight}px solid lightgray`;
        // e.target.style.transition = `border 0.5s`;
        this.taskWithSpace = e.target;
      }
    }
  }

  onMouseDown(e) {
    e.preventDefault();

    if (e.target.className === 'task') {
      this.actualElement = e.target;
      this.actualType = e.target.parentElement.dataset.type;

      this.actualElement.style.width = `${this.actualElement.offsetWidth}px`;
      this.actualElement.classList.add('dragged');
      this.shiftX = e.offsetX;

      document.documentElement.addEventListener('mouseup', this.onMouseUp);
      document.documentElement.addEventListener('mousemove', this.onMouseMove);
    }
  }

  renderContent() {
    this.taskWidgetTodo.renderContent();
    this.taskWidgetInprogress.renderContent();
    this.taskWidgetDone.renderContent();

    this.taskWidgetTodo.taskContainer.addEventListener('mousedown', this.onMouseDown);
    this.taskWidgetInprogress.taskContainer.addEventListener('mousedown', this.onMouseDown);
    this.taskWidgetDone.taskContainer.addEventListener('mousedown', this.onMouseDown);
  }
}
