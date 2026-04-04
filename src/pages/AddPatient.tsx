import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { UserPlus, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AddPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    dob: '',
  });

  const token = localStorage.getItem('token');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.password) {
      setError('Name, email and password are required!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName: form.full_name,
          email: form.email,
          password: form.password,
          role: 'user',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToast('Patient added successfully!');
        setTimeout(() => navigate('/psychiatrist/patients'), 1500);
      } else {
        setError(data.message || 'Failed to add patient');
      }
    } catch (e) {
      setError('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="psychiatrist" onLogout={handleLogout} />

      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✅ {toast}
        </div>
      )}

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <button onClick={() => navigate('/psychiatrist/patients')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              Add New Patient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">Full Name *</label>
              <input name="full_name" value={form.full_name} onChange={handleChange}
                placeholder="Patient's full name"
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="patient@email.com"
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="Set a temporary password"
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Date of Birth</label>
                <input name="dob" type="date" value={form.dob} onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? 'Adding...' : 'Add Patient'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/psychiatrist/patients')}>
                Cancel
              </Button>
            </div>

          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddPatient;
