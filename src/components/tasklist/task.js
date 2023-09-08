export default class Task {
  constructor(text, category, id) {
    if (id) {
      this.id = id;
    } else {
      this.id = Math.floor(performance.now());
    }
    this.text = text;
    this.category = category;
  }
}
