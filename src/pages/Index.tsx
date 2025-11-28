import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Target, Calendar, Droplets, Pill, Apple, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';

const features = [
  {
    icon: Target,
    title: 'Set Your Goals',
    description: 'Define your daily calorie target, exercise time, and water intake goals.',
    color: 'bg-health-green/10 text-health-green',
  },
  {
    icon: Apple,
    title: 'Personalized Meals',
    description: 'Get meal suggestions tailored to your calorie goals for every meal.',
    color: 'bg-health-orange/10 text-health-orange',
  },
  {
    icon: Calendar,
    title: 'Weekly Exercise Plan',
    description: 'Receive a complete 7-day exercise schedule based on your fitness level.',
    color: 'bg-health-teal/10 text-health-teal',
  },
  {
    icon: Pill,
    title: 'Medicine Reminders',
    description: 'Track your medicines with scheduled reminders throughout the day.',
    color: 'bg-health-pink/10 text-health-pink',
  },
  {
    icon: Droplets,
    title: 'Hydration Schedule',
    description: 'Stay hydrated with a daily water intake plan divided across the day.',
    color: 'bg-health-blue/10 text-health-blue',
  },
  {
    icon: Sparkles,
    title: 'Daily Health Tips',
    description: 'Get personalized tips and advice to improve your overall wellness.',
    color: 'bg-health-yellow/10 text-health-orange',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 lg:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-health-teal/10 blur-3xl" />
        </div>
        
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Heart className="h-4 w-4" />
              Your Personal Health Companion
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Smart Personal{' '}
              <span className="text-gradient">Health Planner</span>
            </h1>
            
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              Transform your health journey with personalized weekly plans. 
              Set your goals, and we'll create a complete schedule for exercise, 
              meals, hydration, and medicine reminders.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <Link to="/register">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/planner">View My Planner</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/50 bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need for a Healthier Life
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our comprehensive health planner covers all aspects of your daily wellness routine.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="elevated"
                className="group cursor-default hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} transition-transform group-hover:scale-110`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <Card variant="gradient" className="overflow-hidden">
            <div className="gradient-hero p-8 sm:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="mb-4 text-2xl font-bold text-primary-foreground sm:text-3xl">
                  Ready to Start Your Health Journey?
                </h2>
                <p className="mb-8 text-primary-foreground/90">
                  Create your profile and get your personalized weekly health plan in minutes.
                </p>
                <Button asChild variant="secondary" size="lg" className="shadow-soft-lg">
                  <Link to="/register">
                    Create Your Profile
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 px-4 py-8">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm">Smart Personal Health Planner</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Your health data is stored locally on your device.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
