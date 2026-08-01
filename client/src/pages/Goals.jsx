import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import ProgressBar from "../components/common/ProgressBar.jsx";
import Spinner from "../components/common/Spinner.jsx";
import { goalService } from "../services/goalService.js";

const GOAL_TYPES = ["study", "coding", "reading", "custom"];

// Goals page — create/track Daily Study, Coding, Reading, and Custom goals.
export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "study", targetMinutes: 30 });

  const loadGoals = () => goalService.getGoals().then(({ data }) => setGoals(data));

  useEffect(() => {
    loadGoals().finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await goalService.createGoal(form);
      toast.success("Goal created");
      setShowForm(false);
      setForm({ title: "", type: "study", targetMinutes: 30 });
      loadGoals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create goal");
    }
  };

  const handleDelete = async (id) => {
    await goalService.deleteGoal(id);
    toast.success("Goal removed");
    loadGoals();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Goals</h1>
        <Button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5">
          <Plus size={16} /> New Goal
        </Button>
      </div>

      {showForm && (
        <Card title="Create a Goal">
          <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
            <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {GOAL_TYPES.map((t) => (
                  <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <Input label="Target (minutes/day)" type="number" min={1} required value={form.targetMinutes} onChange={(e) => setForm({ ...form, targetMinutes: Number(e.target.value) })} />
            <Button type="submit" className="sm:col-span-3">Save Goal</Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 && <p className="text-sm text-gray-400">No goals yet — create one to start tracking progress.</p>}
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.progressMinutes / goal.targetMinutes) * 100));
          return (
            <Card key={goal._id}>
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{goal.title}</p>
                  <p className="text-xs text-gray-400 capitalize">{goal.type} goal</p>
                </div>
                <button onClick={() => handleDelete(goal._id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
              <ProgressBar percent={percent} complete={goal.isComplete} />
              <p className="mt-2 text-xs text-gray-500">
                {goal.progressMinutes} / {goal.targetMinutes} min {goal.isComplete && "🎉 Complete!"}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
