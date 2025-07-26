import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  LucideBrain,
  LucideClipboardCheck,
  LucideHeart,
  LucideMoon,
} from 'lucide-react';
import {Link} from 'react-router';

const pages = [
  {
    title: 'Daily Pain Check-In',
    icon: <LucideHeart className="text-rose-500" size={32} />,
    link: '/pain-scale',
    description: 'Track your daily pain levels to monitor recovery.',
  },
  {
    title: 'Daily Sleep Check-In',
    icon: <LucideMoon className="text-indigo-500" size={32} />,
    link: '/sleep-scale',
    description: 'Reflect on your sleep quality and patterns.',
  },
  {
    title: 'Daily Stress Check-In',
    icon: <LucideBrain className="text-yellow-500" size={32} />,
    link: '/stress-scale',
    description: 'Monitor stress and mental wellbeing daily.',
  },
  {
    title: 'Daily Habit Builder',
    icon: <LucideClipboardCheck className="text-emerald-500" size={32} />,
    link: '/daily-habit-builder',
    description: 'Build consistent habits to support back recovery.',
  },
];

export default function Home() {
  return (
    <main className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* <img src={logo} width={100} className="m-auto mb-5" /> */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Welcome Back
      </h1>

      <p className="text-center text-muted-foreground mb-10 text-sm md:text-base">
        Choose a check-in or habit builder to support your recovery journey.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {pages.map(({title, link, description, icon}) => (
          <Card key={title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              {icon}
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">{description}</p>
              <Button asChild>
                <Link to={link}>Go to {title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
