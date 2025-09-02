import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleSheets, PresenceData } from '@/hooks/useGoogleSheets';
import { getWeekId, getDaysInWeek, toISODateString } from '@/lib/date-utils';
import { WeekSelector } from '@/components/WeekSelector';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function MyPresencesPage() {
  const { user } = useAuth();
  const { getPresences, setPresence, loading } = useGoogleSheets();
  const [weekId, setWeekId] = useState(getWeekId());
  const [presences, setPresences] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (user?.email) {
      getPresences(weekId).then(data => {
        const userPresences = data.filter(p => p.userEmail === user.email);
        const presenceMap = new Map<string, boolean>();
        userPresences.forEach(p => {
          presenceMap.set(p.date, p.presence === 'Yes');
        });
        setPresences(presenceMap);
      });
    }
  }, [weekId, user, getPresences]);

  const handlePresenceChange = (date: string, isPresent: boolean) => {
    if (!user?.email) return;

    // Optimistic update
    const newPresences = new Map(presences);
    newPresences.set(date, isPresent);
    setPresences(newPresences);

    setPresence(date, user.email, weekId, isPresent);
  };

  const days = getDaysInWeek(weekId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes présences</CardTitle>
      </CardHeader>
      <CardContent>
        <WeekSelector weekId={weekId} setWeekId={setWeekId} />
        {loading && <div className="text-center">Chargement...</div>}
        <div className="space-y-4 mt-4">
          {days.map(day => {
            const dateString = toISODateString(day);
            const isPresent = presences.get(dateString) || false;
            return (
              <div key={dateString} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-semibold capitalize">{format(day, 'eeee', { locale: fr })}</p>
                  <p className="text-sm text-gray-500">{format(day, 'd MMMM yyyy', { locale: fr })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor={`presence-${dateString}`} className="text-sm">Présent(e)</label>
                  <Checkbox
                    id={`presence-${dateString}`}
                    checked={isPresent}
                    onCheckedChange={(checked) => handlePresenceChange(dateString, !!checked)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
