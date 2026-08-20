import TaskCard from './TaskCard';
import '../styles/list.css';

function ListView({ tasks, pendingIds, onToggle, onEdit, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className="task-list__item">
          <TaskCard
            task={task}
            isPending={pendingIds.includes(task._id)}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            showStatus
          />
        </li>
      ))}
    </ul>
  );
}

export default ListView;
