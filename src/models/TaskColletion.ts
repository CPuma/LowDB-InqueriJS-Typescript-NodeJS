import { TaskItem } from "./TaskItem";

type TTaskCounts = {
  total: number;
  incomplete: number;
};

interface ITaskCollection {
  nextID: number;
  taskMap: Map<number, TaskItem>;
  userName: string;
  taskItems: TaskItem[];
  addTask(task: string): number;
  getTaskById(id: number): TaskItem | undefined;
  markComplete(id: number, complete: boolean): void;
  removeComplete(): void;
  getTaskCounts(): TTaskCounts;
  getTaskItems(includeComplete: boolean): TaskItem[];
}

export class TaskCollection implements ITaskCollection {
  taskMap = new Map<number, TaskItem>();
  nextID: number = 1;
  constructor(public userName: string, public taskItems: TaskItem[] = []) {
    //   De los TaskItems . Crearemos  el TASK MAP tomando el id y todo el item
    taskItems.forEach(item => this.taskMap.set(item.id, item));
  }

  //   Devuelve el indice de la nueva Tarea
  addTask(task: string): number {
    // Si ya Existe una Tarea con el siguiente ID . aumentara en 1. Hasta que ya no exista mas Tareas
    while (this.getTaskById(this.nextID)) {
      this.nextID++;
    }
    // Creamos TaskItem y lo agregamos a TaskMAp
    this.taskMap.set(this.nextID, new TaskItem(this.nextID, task));
    return this.nextID;
  }
  getTaskById(id: number): TaskItem | undefined {
    return this.taskMap.get(id);
  }
  markComplete(id: number, complete: boolean): void {
    const taskItem = this.getTaskById(id);
    if (taskItem) {
      taskItem.complete = complete;
    }
  }
  removeComplete(): void {
    this.taskMap.forEach(item => {
      if (item.complete) {
        // Si ya se completo .. lo removemos del MAP
        this.taskMap.delete(item.id);
      }
    });
  }

  getTaskItems(includeComplete: boolean): TaskItem[] {
    return [...this.taskMap.values()].filter(
      task => includeComplete || !task.complete
    );
  }
  getTaskCounts(): TTaskCounts {
    return {
      total: this.taskMap.size,
      incomplete: this.getTaskItems(false).length
    };
  }
}
