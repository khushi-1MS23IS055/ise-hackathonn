// Replace existing src/pages/Register.tsx with this updated file.
// Changes: adds password input and redirects to /login after saving user.
// UI otherwise unchanged.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveUser, generateId, getUsers } from '@/lib/storage';
import { User } from '@/types/health';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { UserPlus, ArrowRight, User as UserIcon, Scale, Ruler, Heart, Calendar } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    healthConditions: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Please enter your name', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);

    if (isNaN(age) || age < 1 || age > 150) {
      toast({ title: 'Error', description: 'Please enter a valid age', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(weight) || weight < 20 || weight > 500) {
      toast({ title: 'Error', description: 'Please enter a valid weight (20-500 kg)', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(height) || height < 50 || height > 300) {
      toast({ title: 'Error', description: 'Please enter a valid height (50-300 cm)', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast({ title: 'Error', description: 'Please enter a password (min 6 characters)', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    const user: User = {
      id: generateId(),
      name: formData.name.trim(),
      age,
      weight,
      height,
      healthConditions: formData.healthConditions.trim(),
      createdAt: new Date().toISOString(),
      password: formData.password, // saved locally (not secure)
    };

    saveUser(user);
    toast({ title: 'Success!', description: 'Your profile has been created. Please log in.' });

    // Redirect to login page (user will enter username & password)
    navigate(`/login`);
  };

  const existingUsers = getUsers();

  return (  
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Create Your Profile</h1>
            <p className="text-muted-foreground">
              Enter your details to get a personalized health plan
            </p>
          </div>

          {/* Existing Users Notice */}
          {existingUsers.length > 0 && (
            <Card variant="glass" className="mb-6">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> You have {existingUsers.length} existing profile(s). 
                  Creating a new profile will add to your profiles. 
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-sm" 
                    onClick={() => navigate('/planner')}
                  >
                    View existing planners →
                  </Button>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Registration Form */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                This information helps us create a personalized plan for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Age
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleChange}
                    min={1}
                    max={150}
                  />
                </div>

                {/* Weight & Height */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 70"
                      value={formData.weight}
                      onChange={handleChange}
                      min={20}
                      max={500}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 175"
                      value={formData.height}
                      onChange={handleChange}
                      min={50}
                      max={300}
                    />
                  </div>
                </div>

                {/* Health Conditions */}
                <div className="space-y-2">
                  <Label htmlFor="healthConditions" className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    Health Conditions (optional)
                  </Label>
                  <Textarea
                    id="healthConditions"
                    name="healthConditions"
                    placeholder="List any health conditions, allergies, or medical history..."
                    value={formData.healthConditions}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps us tailor your plan. Leave empty if none.
                  </p>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Choose a password (min 6 chars)"
                    value={formData.password}
                    onChange={handleChange}
                    maxLength={100}
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Profile...' : 'Continue to Health Goals'}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;