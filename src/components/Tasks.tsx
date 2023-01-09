import { useEffect, useState } from 'react';
import { ClipboardText, PlusCircle, Trash } from 'phosphor-react';
import styles from './Tasks.module.css';

interface ITasks {
  id: number;
  title: string;
  completed: boolean;
}

export default function Tasks() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState(Array<ITasks>);

  const localTasks = JSON.parse(localStorage.getItem('tasks')!);
  if (!localTasks) localStorage.setItem('tasks', JSON.stringify(tasks));

  function handleCreateNewTask(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();

    setNewTask(event.currentTarget.value);
  }

  function handleAddNewTask(event: React.FormEvent<HTMLButtonElement>) {
    event?.preventDefault();

    const newTaskObject = {
      id: new Date().getTime(),
      title: newTask,
      completed: false,
    }

    setTasks([...tasks, newTaskObject]);
    setNewTask('');
  }

  function handleCheckTask(event: React.FormEvent<HTMLInputElement>) {
    const { checked } = event.currentTarget;

    const newTasks = tasks.map(task => {
      if (task.id === Number(event.currentTarget.id)) {
        task.completed = checked;
      }
      return task;
    });

    setTasks(newTasks);
  }

  function getConcluedTasks() {
    return tasks.filter(task => task.completed).length;
  }

  function handleDeleteTask(event: React.FormEvent) {
    const newTasks = tasks.filter(task => {
      return task.id !== Number(event.currentTarget.id)
    });

    setTasks(newTasks);
  }

  useEffect(() => {
    const localTasks = JSON.parse(localStorage.getItem('tasks')!);
    if (localTasks.length > 0) setTasks(localTasks);
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks])

  return (
    <>
      <form className={styles.form}>
        <div className={styles.content}>
          <input
            value={newTask}
            className={styles.input}
            type="text"
            placeholder="Adicione uma nova tarefa"
            onChange={handleCreateNewTask}
          />
          <button
            className={styles.button}
            type='submit'
            onClick={handleAddNewTask}
            disabled={newTask === ''}
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
              {tasks.length === 0 ? '0' : `${getConcluedTasks()} de ${tasks.length}`}
            </span>
          </span>
        </div>
        <div className={styles.taskList}>
          {tasks.length !== 0 ? tasks.map(task => (
            <div key={task.id} className={styles.taskContent}>
              <div className={styles.task}>
                <label htmlFor={task.id.toString()}>
                  <input
                    id={task.id.toString()}
                    type="checkbox"
                    defaultChecked={task.completed}
                    onChange={handleCheckTask}
                  />
                  <span className={styles.taskTitle}>{task.title}</span>
                </label>
              </div>
              <Trash
                id={task.id.toString()}
                size={20}
                className={styles.trash}
                onClick={handleDeleteTask}
              />
            </div>
          )) :
            <div className={styles.emptyContent}>
              <ClipboardText size={72} className={styles.emptyImage} />
              <p className={styles.parag1}>Você ainda não tem tarefas cadastradas</p>
              <p className={styles.parag2}>Crie tarefas e organize seus itens a fazer</p>
            </div>
          }
        </div>
      </main>
    </>
  )
}
