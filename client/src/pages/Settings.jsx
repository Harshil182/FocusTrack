import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Card from "../components/common/Card.jsx";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import Toggle from "../components/common/Toggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { authService } from "../services/authService.js";
import { categoryService } from "../services/categoryService.js";

// Settings page — profile, dark mode, notifications, website categories.
export default function Settings() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [notif, setNotif] = useState(user?.notificationSettings || {});
  const [categories, setCategories] = useState([]);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    categoryService.getCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const saveProfile = async () => {
    try {
      const { user: updated } = await authService.updateProfile({ name, notificationSettings: notif });
      setUser(updated);
      localStorage.setItem("focustrack_user", JSON.stringify(updated));
      toast.success("Settings saved");
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  const toggleCategoryProductive = async (category) => {
    const updated = await categoryService.updateCategory(category._id, { isProductive: !category.isProductive });
    setCategories((prev) => prev.map((c) => (c._id === category._id ? updated.data : c)));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold">Settings</h1>

      <Card title="Profile">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" value={user?.email} disabled />
      </Card>

      <Card title="Appearance">
        <Toggle checked={dark} onChange={setDark} label="Dark Mode" />
      </Card>

      <Card title="Notifications">
        <Toggle checked={!!notif.productivityReminder} onChange={(v) => setNotif({ ...notif, productivityReminder: v })} label="Productivity Reminder" />
        <Toggle checked={!!notif.breakReminder} onChange={(v) => setNotif({ ...notif, breakReminder: v })} label="Break Reminder" />
        <Toggle checked={!!notif.goalCompletion} onChange={(v) => setNotif({ ...notif, goalCompletion: v })} label="Goal Completion Notification" />
      </Card>

      <Card title="Website Categories">
        <div className="space-y-1">
          {categories.map((c) => (
            <Toggle key={c._id} checked={c.isProductive} onChange={() => toggleCategoryProductive(c)} label={c.name} />
          ))}
        </div>
      </Card>

      <Button onClick={saveProfile}>Save Changes</Button>
    </div>
  );
}
