import inquirer from "inquirer";
import { TaskCollection } from "./models/TaskColletion";
import { tasks } from "./exampleData";
import { JsonTaskCollection } from "./models/JsonTaskCollection";

// _YANO . ahora llamaremos el JSON TASKCOLLECTION para persistir DATOs con LOWDB
// const collection = new TaskCollection("rasec", tasks); // Sin persistencia
const collection = new JsonTaskCollection("rasec", tasks); // con persistencia LOWDB

let showCompleted: boolean = true;

function displayTaskList(): void {
  console.log(
    `${collection.userName}'s Tasks (${
      collection.getTaskCounts().incomplete
    } task to do)`
  );
  collection.getTaskItems(showCompleted).forEach(task => task.printDetails());
}

enum Commands {
  Add = "Add new task",
  Complete = "Complete task",
  Toggle = "Show/Hide Complete",
  Purge = "Remove Complete Tasks",
  Quit = "Quit"
}

async function promptAdd(): Promise<void> {
  console.clear();
  const answer = await inquirer.prompt({
    type: "input",
    name: "add",
    message: "Enter Task"
  });
  if (answer["add"] !== "") {
    collection.addTask(answer["add"]);
  } else {
    console.log("ESTA VACIO");
  }
  await promptUser();
}

async function promptComplete(): Promise<void> {
  console.clear();
  const answers = await inquirer.prompt({
    type: "checkbox",
    name: "Complete",
    message: "Mark Task Complete",
    choices: collection.getTaskItems(showCompleted).map(item => ({
      name: item.task,
      value: item.id,
      checked: item.complete
    }))
  });

  let completedTasks = answers["Complete"] as number[];
  collection
    .getTaskItems(true)
    .forEach(item =>
      collection.markComplete(
        item.id,
        completedTasks.find(id => id === item.id) != undefined
      )
    );
  promptUser();
}

async function promptUser() {
  console.clear();
  displayTaskList();

  const answers = await inquirer.prompt({
    type: "list",
    name: "command",
    message: "Choose Option",
    choices: Object.values(Commands)
  });
  switch (answers["command"]) {
    case Commands.Add:
      await promptAdd();
      break;
    case Commands.Toggle:
      showCompleted = !showCompleted;
      promptUser();
      break;
    case Commands.Complete:
      if (collection.getTaskCounts().incomplete > 0) {
        await promptComplete();
      } else {
        promptUser();
      }
      break;
    case Commands.Purge:
      collection.removeComplete();
      promptUser();
      break;
  }
}

promptUser();
