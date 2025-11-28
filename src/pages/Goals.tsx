import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUser, saveGoals, getGoals, savePlan } from '@/lib/storage';
import { generateWeeklyPlan } from '@/lib/planGenerator';
import { HealthGoals, Medicine } from '@/types/health';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Target, Flame, Clock, Droplets, Pill, Plus, X, ArrowRight, Sparkles, User } from 'lucide-react';

const Goals = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    dailyCalories: '',
    exerciseMinutes: '',
    waterIntake: '',
  });
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    name: '',
    dosage: '',
    timing: 'morning',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate('/register');
      return;
    }
    
    const userData = getUser(userId);
    if (!userData) {
      toast({ title: 'Error', description: 'User not found', variant: 'destructive' });
      navigate('/register');
      return;
    }
    setUser(userData);

    // Load existing goals if any
    const existingGoals = getGoals(userId);
    if (existingGoals) {
      setFormData({
        dailyCalories: existingGoals.dailyCalories.toString(),
        exerciseMinutes: existingGoals.exerciseMinutes.toString(),
        waterIntake: existingGoals.waterIntake.toString(),
      });
      setMedicines(existingGoals.medicines);
    }
  }, [userId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMedicine(prev => ({ ...prev, [name]: value }));
  };

  const handleTimingChange = (value: string) => {
    setNewMedicine(prev => ({ ...prev, timing: value as Medicine['timing'] }));
  };

  const addMedicine = () => {
    if (!newMedicine.name.trim() || !newMedicine.dosage.trim()) {
      toast({ title: 'Error', description: 'Please fill in medicine name and dosage', variant: 'destructive' });
      return;
    }
    setMedicines(prev => [...prev, { ...newMedicine, name: newMedicine.name.trim(), dosage: newMedicine.dosage.trim() }]);
    setNewMedicine({ name: '', dosage: '', timing: 'morning' });
  };

  const removeMedicine = (index: number) => {
    setMedicines(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dailyCalories = parseInt(formData.dailyCalories);
    const exerciseMinutes = parseInt(formData.exerciseMinutes);
    const waterIntake = parseFloat(formData.waterIntake);

    if (isNaN(dailyCalories) || dailyCalories < 500 || dailyCalories > 10000) {
      toast({ title: 'Error', description: 'Please enter valid calories (500-10000)', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(exerciseMinutes) || exerciseMinutes < 5 || exerciseMinutes > 180) {
      toast({ title: 'Error', description: 'Please enter valid exercise time (5-180 minutes)', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(waterIntake) || waterIntake < 0.5 || waterIntake > 10) {
      toast({ title: 'Error', description: 'Please enter valid water intake (0.5-10 liters)', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    const goals: HealthGoals = {
      userId: userId!,
      dailyCalories,
      exerciseMinutes,
      waterIntake,
      medicines,
      createdAt: new Date().toISOString(),
    };

    saveGoals(goals);

    // Generate the weekly plan
    const plan = generateWeeklyPlan(goals);
    savePlan(plan);

    toast({ title: 'Success!', description: 'Your weekly health plan has been generated!' });
    navigate(`/planner/${userId}`);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const timingOptions = [
    { value: 'morning', label: '🌅 Morning' },
    { value: 'afternoon', label: '☀️ Afternoon' },
    { value: 'evening', label: '🌆 Evening' },
    { value: 'night', label: '🌙 Night' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Set Your Health Goals</h1>
            <p className="text-muted-foreground">
              Hi <span className="font-medium text-foreground">{user.name}</span>! 
              Let's define your daily health targets.
            </p>
          </div>

          {/* User Info Card */}
          <Card variant="glass" className="mb-6">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {user.age} years • {user.weight}kg • {user.height}cm
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Goals Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Daily Targets Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-health-orange" />
                  Daily Targets
                </CardTitle>
                <CardDescription>
                  Set your daily health goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Calories */}
                <div className="space-y-2">
                  <Label htmlFor="dailyCalories" className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-health-orange" />
                    Daily Calorie Target
                  </Label>
                  <Input
                    id="dailyCalories"
                    name="dailyCalories"
                    type="number"
                    placeholder="e.g., 2000"
                    value={formData.dailyCalories}
                    onChange={handleChange}
                    min={500}
                    max={10000}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1500-2500 calories based on activity level
                  </p>
                </div>

                {/* Exercise */}
                <div className="space-y-2">
                  <Label htmlFor="exerciseMinutes" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-health-teal" />
                    Daily Exercise Time (minutes)
                  </Label>
                  <Input
                    id="exerciseMinutes"
                    name="exerciseMinutes"
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.exerciseMinutes}
                    onChange={handleChange}
                    min={5}
                    max={180}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 30-60 minutes of moderate activity
                  </p>
                </div>

                {/* Water Intake */}
                <div className="space-y-2">
                  <Label htmlFor="waterIntake" className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-health-blue" />
                    Daily Water Intake (liters)
                  </Label>
                  <Input
                    id="waterIntake"
                    name="waterIntake"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.5"
                    value={formData.waterIntake}
                    onChange={handleChange}
                    min={0.5}
                    max={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 2-3 liters per day
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Medicines Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-health-pink" />
                  Medicine Schedule
                </CardTitle>
                <CardDescription>
                  Add your regular medicines (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Medicine List */}
                {medicines.length > 0 && (
                  <div className="space-y-2">
                    {medicines.map((med, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                      >
                        <div>
                          <p className="font-medium text-foreground">{med.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {med.dosage} • {timingOptions.find(t => t.value === med.timing)?.label}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMedicine(index)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Medicine Form */}
                <div className="rounded-lg border border-dashed border-border p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-1">
                      <Label htmlFor="medicineName" className="text-xs">Medicine Name</Label>
                      <Input
                        id="medicineName"
                        name="name"
                        placeholder="e.g., Vitamin D"
                        value={newMedicine.name}
                        onChange={handleMedicineChange}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="medicineDosage" className="text-xs">Dosage</Label>
                      <Input
                        id="medicineDosage"
                        name="dosage"
                        placeholder="e.g., 1 tablet"
                        value={newMedicine.dosage}
                        onChange={handleMedicineChange}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Timing</Label>
                      <Select value={newMedicine.timing} onValueChange={handleTimingChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timingOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={addMedicine}
                  >
                    <Plus className="h-4 w-4" />
                    Add Medicine
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generating Your Plan...' : 'Generate My Weekly Plan'}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Goals;
