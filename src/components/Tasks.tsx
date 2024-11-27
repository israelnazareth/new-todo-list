import { useEffect, useState } from 'react';
import { ClipboardText, PlusCircle, Trash } from 'phosphor-react';
import styles from './Tasks.module.css';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface ITasks {
  id: number;
  title: string;
  completed: boolean;
}

export default function Tasks() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState(Array<ITasks>);

  const localTasks = JSON.parse(localStorage.getItem("tasks")!);
  if (!localTasks) localStorage.setItem("tasks", JSON.stringify(tasks));

  function handleNewTaskChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();

    setNewTask(event.currentTarget.value);
  }

  function handleCreateNewTask(event: React.FormEvent<HTMLButtonElement>) {
    event?.preventDefault();

    const newTaskObject = {
      id: new Date().getTime(),
      title: newTask.trim(),
      completed: false,
    };

    setTasks([...tasks, newTaskObject]);
    setNewTask("");
  }

  function handleCheckTask(event: React.FormEvent<HTMLInputElement>) {
    const { checked } = event.currentTarget;

    const newTasks = tasks.map((task) => {
      if (task.id === Number(event.currentTarget.id)) {
        task.completed = checked;
      }
      return task;
    });

    setTasks(newTasks);
  }

  function getConcluedTasks() {
    return tasks.filter((task) => task.completed).length;
  }

  function handleDeleteTask(event: React.FormEvent) {
    const newTasks = tasks.filter((task) => {
      return task.id !== Number(event.currentTarget.id);
    });

    setTasks(newTasks);
  }

  useEffect(() => {
    const localTasks = JSON.parse(localStorage.getItem("tasks")!);
    if (localTasks.length > 0) setTasks(localTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const isTaskEmpty = newTask.trim() === "";

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  return (
    <>
      <form className={styles.form}>
        <div className={styles.content}>
          <input
            value={newTask}
            className={styles.input}
            type="text"
            placeholder="Adicione uma nova tarefa"
            onChange={handleNewTaskChange}
          />
          <button
            className={styles.button}
            type="submit"
            onClick={handleCreateNewTask}
            disabled={isTaskEmpty}
          >
            Criar
            <PlusCircle size={20} />
          </button>
        </div>
      </form>
      <main className={styles.main}>
        <div className={styles.infos}>
          <span className={styles.infoCreated}>
            Tarefas criadas
            <span className={styles.infoNumbers}>{tasks.length}</span>
          </span>
          <span className={styles.infoCompleted}>
            Concluídas
            <span className={styles.infoNumbers}>
              {tasks.length === 0
                ? "0"
                : `${getConcluedTasks()} de ${tasks.length}`}
            </span>
          </span>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks" type="list" direction="vertical">
            {(provided) => (
              <div
                className={styles.taskList}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.length !== 0 ? (
                  tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          key={task.id}
                          className={styles.taskContent}
                          id={task.id.toString()}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className={styles.task}>
                            <label htmlFor={task.id.toString()}>
                              <input
                                id={task.id.toString()}
                                type="checkbox"
                                defaultChecked={task.completed}
                                onChange={handleCheckTask}
                              />
                              <span className={styles.taskTitle}>
                                {task.title}
                              </span>
                            </label>
                          </div>
                          <div className={styles.trash}>
                            <Trash
                              id={task.id.toString()}
                              size={20}
                              onClick={handleDeleteTask}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className={styles.emptyContent}>
                    <ClipboardText size={72} className={styles.emptyImage} />
                    <p className={styles.parag1}>
                      Você ainda não tem tarefas cadastradas
                    </p>
                    <p className={styles.parag2}>
                      Crie tarefas e organize seus itens a fazer
                    </p>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>
    </>
  );
}
