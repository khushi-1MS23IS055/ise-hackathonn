// New file: src/pages/Login.tsx
// Minimal login page. Uses 'name' as username (same as Register).
// On successful auth navigates to /planner/:userId

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authenticateUser } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { User as UserIcon, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { username, password } = form;
    if (!username.trim() || !password) {
      toast({ title: 'Error', description: 'Please provide username and password', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    const user = authenticateUser(username.trim(), password);
    if (!user) {
      toast({ title: 'Login failed', description: 'Invalid username or password', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    toast({ title: 'Welcome back!', description: `Hello ${user.name}` });
    setIsSubmitting(false);

    // Redirect to the user's planner
    navigate(`/planner/${user.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserIcon className="h-5 w-5 text-primary" />Login</CardTitle>
              <CardDescription>Sign in with your username and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" placeholder="Your name" value={form.username} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;