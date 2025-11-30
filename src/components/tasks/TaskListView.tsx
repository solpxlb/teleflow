// TaskListView component – displays tasks in a table list view
import React from 'react';
import { Task } from '@/lib/mockData';
import { Calendar, User, Flag, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  selectedTasks: string[];
  onToggleSelect: (taskId: string) => void;
}

const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onTaskClick, selectedTasks, onToggleSelect }) => {
  const priorityColors: Record<Task['priority'], string> = {
    urgent: 'text-rose-500',
    high: 'text-orange-500',
    medium: 'text-amber-500',
    low: 'text-blue-500',
  };

  const statusColors: Record<Task['status'], string> = {
    completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    blocked: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    review: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    todo: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-white border-b border-slate-200">
          <tr>
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                className="rounded border-slate-600 bg-white text-blue-600"
                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                onChange={e => {
                  if (e.target.checked) {
                    tasks.forEach(t => !selectedTasks.includes(t.id) && onToggleSelect(t.id));
                  } else {
                    tasks.forEach(t => selectedTasks.includes(t.id) && onToggleSelect(t.id));
                  }
                }}
              />
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Task</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Status</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Priority</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Assignee</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Due Date</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Progress</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {tasks.map(task => {
            const progress = task.subtasks?.length > 0
              ? Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)
              : task.status === 'completed'
                ? 100
                : 0;
            return (
              <tr
                key={task.id}
                className="hover:bg-white/50 transition-colors cursor-pointer group"
                onClick={() => onTaskClick(task)}
              >
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="rounded border-slate-600 bg-white text-blue-600"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => onToggleSelect(task.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {task.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
                    {task.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Flag className={`w-4 h-4 ${priorityColors[task.priority]}`} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">User {task.assigneeId}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden max-w-[100px]">
                      <div
                        className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : progress > 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600 w-10">{progress}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {tasks.length === 0 && (
        <div className="text-center py-12 text-slate-600">No tasks found</div>
      )}
    </div>
  );
};

export default TaskListView;
