import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUser, getGoals, getPlan, getUsers, savePlan } from '@/lib/storage';
import { generateWeeklyPlan } from '@/lib/planGenerator';
import { User, HealthGoals, WeeklyPlan, DayPlan } from '@/types/health';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { 
  Calendar, 
  Dumbbell, 
  Apple, 
  Pill, 
  Droplets, 
  Lightbulb, 
  RefreshCw,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  Target,
  Flame,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const dayColors = [
  'border-l-health-green',
  'border-l-health-teal',
  'border-l-health-blue',
  'border-l-health-orange',
  'border-l-health-yellow',
  'border-l-health-pink',
  'border-l-primary',
];

const DayCard = ({ day, index }: { day: DayPlan; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <Card 
      variant="elevated" 
      className={cn(
        'border-l-4 transition-all duration-300',
        dayColors[index],
        isExpanded && 'shadow-glow'
      )}
    >
      <CardHeader 
        className="cursor-pointer pb-2" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            {day.day}
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4 animate-fade-in">
          {/* Exercise */}
          <div className="rounded-lg bg-health-green/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-health-green">
              <Dumbbell className="h-4 w-4" />
              Exercise
            </div>
            <p className="text-sm text-foreground">{day.exercise}</p>
          </div>

          {/* Meals */}
          <div className="rounded-lg bg-health-orange/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-health-orange">
              <Apple className="h-4 w-4" />
              Meals
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="w-20 font-medium text-muted-foreground">Breakfast:</span>
                <span className="text-foreground">{day.meals.breakfast}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 font-medium text-muted-foreground">Lunch:</span>
                <span className="text-foreground">{day.meals.lunch}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 font-medium text-muted-foreground">Dinner:</span>
                <span className="text-foreground">{day.meals.dinner}</span>
              </div>
            </div>
          </div>

          {/* Medicines */}
          {(day.medicines.morning.length > 0 || 
            day.medicines.afternoon.length > 0 || 
            day.medicines.evening.length > 0 || 
            day.medicines.night.length > 0) && (
            <div className="rounded-lg bg-health-pink/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-health-pink">
                <Pill className="h-4 w-4" />
                Medicine Reminders
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                {day.medicines.morning.length > 0 && (
                  <div>
                    <span className="font-medium text-muted-foreground">🌅 Morning:</span>
                    <p className="text-foreground">{day.medicines.morning.join(', ')}</p>
                  </div>
                )}
                {day.medicines.afternoon.length > 0 && (
                  <div>
                    <span className="font-medium text-muted-foreground">☀️ Afternoon:</span>
                    <p className="text-foreground">{day.medicines.afternoon.join(', ')}</p>
                  </div>
                )}
                {day.medicines.evening.length > 0 && (
                  <div>
                    <span className="font-medium text-muted-foreground">🌆 Evening:</span>
                    <p className="text-foreground">{day.medicines.evening.join(', ')}</p>
                  </div>
                )}
                {day.medicines.night.length > 0 && (
                  <div>
                    <span className="font-medium text-muted-foreground">🌙 Night:</span>
                    <p className="text-foreground">{day.medicines.night.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hydration */}
          <div className="rounded-lg bg-health-blue/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-health-blue">
              <Droplets className="h-4 w-4" />
              Hydration Schedule
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium text-muted-foreground">Morning:</span> {day.hydration.morning}</p>
              <p><span className="font-medium text-muted-foreground">Afternoon:</span> {day.hydration.afternoon}</p>
              <p><span className="font-medium text-muted-foreground">Evening:</span> {day.hydration.evening}</p>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-lg bg-health-yellow/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-health-orange">
              <Lightbulb className="h-4 w-4" />
              Health Tips
            </div>
            <ul className="space-y-1 text-sm text-foreground">
              {day.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const UserSelector = ({ 
  users, 
  selectedUserId, 
  onSelect 
}: { 
  users: User[]; 
  selectedUserId: string | null; 
  onSelect: (id: string) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {users.map(user => (
        <Button
          key={user.id}
          variant={selectedUserId === user.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(user.id)}
          className="gap-2"
        >
          <UserIcon className="h-4 w-4" />
          {user.name}
        </Button>
      ))}
    </div>
  );
};

const Planner = () => {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(paramUserId || null);
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<HealthGoals | null>(null);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const allUsers = getUsers();
    setUsers(allUsers);
    
    if (paramUserId) {
      setSelectedUserId(paramUserId);
    } else if (allUsers.length > 0 && !selectedUserId) {
      setSelectedUserId(allUsers[0].id);
    }
  }, [paramUserId]);

  useEffect(() => {
    if (!selectedUserId) return;

    const userData = getUser(selectedUserId);
    const goalsData = getGoals(selectedUserId);
    const planData = getPlan(selectedUserId);

    setUser(userData);
    setGoals(goalsData);
    setPlan(planData);
  }, [selectedUserId]);

  const handleRegenerate = () => {
    if (!goals) return;
    
    setIsRegenerating(true);
    setTimeout(() => {
      const newPlan = generateWeeklyPlan(goals);
      savePlan(newPlan);
      setPlan(newPlan);
      setIsRegenerating(false);
      toast({ title: 'Success!', description: 'Your weekly plan has been regenerated!' });
    }, 1000);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    navigate(`/planner/${userId}`, { replace: true });
  };

  // No users registered
  if (users.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-foreground">No Plans Yet</h2>
            <p className="mb-8 text-muted-foreground">
              Create your profile and set your health goals to generate your personalized weekly plan.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User selected but no goals/plan
  if (selectedUserId && user && !plan) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-medium text-foreground">Select Profile</h2>
            <UserSelector users={users} selectedUserId={selectedUserId} onSelect={handleUserSelect} />
          </div>
          
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
              <Target className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Hi {user.name}!
            </h2>
            <p className="mb-8 text-muted-foreground">
              You haven't set your health goals yet. Let's create your personalized weekly plan!
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to={`/goals/${selectedUserId}`}>Set My Goals</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* User Selector */}
        {users.length > 1 && (
          <div className="mb-8">
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">Select Profile</h2>
            <UserSelector users={users} selectedUserId={selectedUserId} onSelect={handleUserSelect} />
          </div>
        )}

        {user && goals && plan && (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {user.name}'s Weekly Plan
                  </h1>
                  <p className="text-muted-foreground">
                    Generated on {new Date(plan.generatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/goals/${selectedUserId}`)}
                  >
                    Edit Goals
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="gap-2"
                  >
                    <RefreshCw className={cn('h-4 w-4', isRegenerating && 'animate-spin')} />
                    {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Goals Summary */}
            <Card variant="glass" className="mb-8">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-health-orange" />
                    <span className="text-muted-foreground">Calories:</span>
                    <span className="font-medium text-foreground">{goals.dailyCalories}/day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-health-teal" />
                    <span className="text-muted-foreground">Exercise:</span>
                    <span className="font-medium text-foreground">{goals.exerciseMinutes} min/day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-health-blue" />
                    <span className="text-muted-foreground">Water:</span>
                    <span className="font-medium text-foreground">{goals.waterIntake}L/day</span>
                  </div>
                  {goals.medicines.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-health-pink" />
                      <span className="text-muted-foreground">Medicines:</span>
                      <span className="font-medium text-foreground">{goals.medicines.length}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Plan */}
            <div className="space-y-4">
              {plan.days.map((day, index) => (
                <DayCard key={day.day} day={day} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Planner;
