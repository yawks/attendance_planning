import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleSheets, PresenceValue } from '@/hooks/useGoogleSheets';
import { getWeekId, getDaysInWeek, toISODateString } from '@/lib/date-utils';
import { WeekSelector } from '@/components/WeekSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Home } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function MyPresencesPage() {
  const { user } = useAuth();
  const { getPresences, setPresence, loading } = useGoogleSheets();
  const [weekId, setWeekId] = useState(getWeekId());
  const [presences, setPresences] = useState<Map<string, PresenceValue>>(new Map());

  useEffect(() => {
    if (user?.email) {
      getPresences(weekId).then(data => {
        const userPresences = data.filter(p => p.userEmail === user.email);
        const presenceMap = new Map<string, PresenceValue>();
        userPresences.forEach(p => {
          if (p.presence === 'Bureau' || p.presence === 'Maison') {
            presenceMap.set(p.date, p.presence);
          }
        });
        setPresences(presenceMap);
      });
    }
  }, [weekId, user, getPresences]);

  const handlePresenceChange = (date: string, value: PresenceValue) => {
    if (!user?.email) return;

    const newPresences = new Map(presences);
    // If the same button is clicked again, we can treat it as clearing the selection
    if (newPresences.get(date) === value) {
      // This part is tricky with the user's "no third state" rule.
      // For now, let's assume clicking again does nothing, you must pick one or the other.
      // A better UX would be to clear, but let's stick to the request.
      // Re-selecting is the only way to change.
    }
    newPresences.set(date, value);
    setPresences(newPresences);

    setPresence(date, weekId, value);
  };

  const days = getDaysInWeek(weekId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes présences</CardTitle>
      </CardHeader>
      <CardContent>
        <WeekSelector weekId={weekId} setWeekId={setWeekId} />
        {loading && <div className="text-center p-4">Chargement...</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mt-4">
          {days.map(day => {
            const dateString = toISODateString(day);
            const currentPresence = presences.get(dateString);
            return (
              <div key={dateString} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex flex-col gap-2">
                <div className="text-center">
                  <p className="font-semibold capitalize">{format(day, 'eee', { locale: fr })}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{format(day, 'd/MM', { locale: fr })}</p>
                </div>
                <div className="flex flex-col gap-2 mt-2 flex-grow">
                  <Button
                    variant={currentPresence === 'Bureau' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handlePresenceChange(dateString, 'Bureau')}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Bureau
                  </Button>
                  <Button
                    variant={currentPresence === 'Maison' ? 'default' : 'outline'}
                    className={cn(
                      "w-full",
                      currentPresence === 'Maison' && "bg-slate-700 dark:bg-slate-600"
                    )}
                    onClick={() => handlePresenceChange(dateString, 'Maison')}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Maison
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
