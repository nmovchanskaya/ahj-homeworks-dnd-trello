import TaskWidget from './components/tasklist/taskWidget';
import Task from './components/tasklist/task';

export default class Desk {
  constructor(containerName) {
    this.containerName = containerName;
    this.taskWidgetTodo = new TaskWidget('todo', 'To do');
    this.taskWidgetInprogress = new TaskWidget('inprogress', 'In progress');
    this.taskWidgetDone = new TaskWidget('done', 'Done');

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  bindToDOM() {
    this.container = document.querySelector(this.containerName);
    this.taskWidgetTodo.bindToDOM();
    this.taskWidgetInprogress.bindToDOM();
    this.taskWidgetDone.bindToDOM();
  }

  onMouseUp(e) {
    //if (this.emptyDiv) {
    //  this.emptyDiv.remove();
    //}
    const mouseUpItem = e.target;

    if (mouseUpItem.className === 'task') {
      const taskContainer = mouseUpItem.parentElement;

      console.log(mouseUpItem);
      console.log(taskContainer);
      taskContainer.insertBefore(this.actualElement, mouseUpItem);

      // update lists of tasks in memory
      const container = document.querySelector(`.task__container_${this.actualType}`);
      const taskElems = Array.from(container.querySelectorAll('.task'));
      const tasks = [];
      taskElems.forEach((item) => {
        const txt = item.innerText.trim();
        tasks.push(new Task(txt.substring(0, txt.length - 2), this.actualType, Number(item.dataset.id)));
      });

      if (this.actualType === 'todo') {
        this.taskWidgetTodo.update(tasks);
      } else if (this.actualType === 'inprogress') {
        this.taskWidgetInprogress.update(tasks);
      } else if (this.actualType === 'done') {
        this.taskWidgetDone.update(tasks);
      }

      // if we move task to another column - update it also
      if (taskContainer.dataset.type !== container.dataset.type) {
        const taskElemsTo = Array.from(taskContainer.querySelectorAll('.task'));
        const tasksTo = [];
        taskElemsTo.forEach((item) => {
          tasksTo.push(new Task(item.textContent.trim(), taskContainer.dataset.type, item.dataset.id));
        });

        if (taskContainer.dataset.type === 'todo') {
          this.taskWidgetTodo.update(tasksTo);
        } else if (taskContainer.dataset.type === 'inprogress') {
          this.taskWidgetInprogress.update(tasksTo);
        } else if (taskContainer.dataset.type === 'done') {
          this.taskWidgetDone.update(tasksTo);
        }
      }

      this.taskWithSpace.style.borderTop = 0;

      this.actualElement.classList.remove('dragged');
      this.actualElement = undefined;

      document.documentElement.removeEventListener('mouseup', this.onMouseUp);
      document.documentElement.removeEventListener('mouseover', this.onMouseOver);
    }
  }

  onMouseOver(e) {
    this.actualElement.style.top = `${e.clientY}px`;
    this.actualElement.style.left = `${e.clientX}px`;

    // create space for the moving element
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.createEmptySpace(e), 200);
  }

  createEmptySpace(e) {
    //if (this.emptyDiv) {
    //  this.emptyDiv.remove();
    //}
    if (this.taskWithSpace) {
      this.taskWithSpace.style.borderTop = 0;
    }

    if (e.target.className === 'task') {
      //const parent = e.target.parentElement;
      e.target.style.borderTop = `${this.actualElement.offsetHeight}px solid lightgray`;
      this.taskWithSpace = e.target;
      //this.emptyDiv = document.createElement('div');
      //this.emptyDiv.style.height = `${this.actualElement.offsetHeight}px`;
      //console.log(this.emptyDiv);
      //console.log(e.target);
      //console.log(parent);
      //parent.insertBefore(this.emptyDiv, e.target);
    }
  }

  onMouseDown(e) {
    e.preventDefault();

    if (e.target.className === 'task') {
      this.actualElement = e.target;
      this.actualType = e.target.parentElement.dataset.type;

      this.actualElement.classList.add('dragged');

      document.documentElement.addEventListener('mouseup', this.onMouseUp);
      document.documentElement.addEventListener('mouseover', this.onMouseOver);
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
