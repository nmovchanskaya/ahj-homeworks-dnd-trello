import Task from './task';

export default class TaskList {
  constructor(type, name) {
    this.type = type;
    this.name = name;
    this.tasks = [];
    this.loadFromLocalStorage();
  }

  add(task) {
    this.tasks.push(task);
    this.saveToLocalStorage();
  }

  remove(taskId) {
    this.tasks = this.tasks.filter((item) => item.id !== taskId);
    this.saveToLocalStorage();
  }

  update(tasks) {
    this.tasks = [];
    tasks.forEach((item) => {
      const task = new Task(item.text, this.type, item.id);
      this.tasks.push(task);
    });
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem(`taskList_${this.type}`, JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem(`taskList_${this.type}`));
    if (tasks) {
      tasks.forEach((item) => {
        const task = new Task(item.text, item.category, item.id);
        this.tasks.push(task);
      });
    }
  }
}
