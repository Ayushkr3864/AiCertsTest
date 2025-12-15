import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
const navigate = useNavigate()
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://aicertstest.onrender.com/admin/login`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const res_data = await res.json()
    if (res.ok) {
      navigate("/")
      alert("login successfull")
    }
    console.log(res_data);
    console.log(res);
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Admin Login
        </h1>
        <p className="text-slate-400 text-center mb-6">
          Sign in to access admin dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <div className="relative mt-1">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <div className="relative mt-1">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold shadow-lg"
          >
            Login as Admin
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Admin Panel
          </p>
        </div>
      </motion.div>
    </div>
  );
}
