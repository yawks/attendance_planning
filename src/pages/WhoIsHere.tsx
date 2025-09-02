import { useState, useEffect } from 'react';
import { useGoogleSheets, PresenceData } from '@/hooks/useGoogleSheets';
import { getWeekId, getDaysInWeek, toISODateString } from '@/lib/date-utils';
import { WeekSelector } from '@/components/WeekSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type PresencesByDay = Map<string, string[]>;

export function WhoIsHerePage() {
  const { getPresences, loading } = useGoogleSheets();
  const [weekId, setWeekId] = useState(getWeekId());
  const [presencesByDay, setPresencesByDay] = useState<PresencesByDay>(new Map());

  useEffect(() => {
    getPresences(weekId).then(data => {
      const byDay: PresencesByDay = new Map();
      data.forEach(p => {
        if (p.presence === 'Yes') {
          const users = byDay.get(p.date) || [];
          users.push(p.userEmail);
          byDay.set(p.date, users);
        }
      });
      setPresencesByDay(byDay);
    });
  }, [weekId, getPresences]);

  const days = getDaysInWeek(weekId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qui est là cette semaine ?</CardTitle>
        <CardDescription>Récapitulatif des présences pour la semaine sélectionnée.</CardDescription>
      </CardHeader>
      <CardContent>
        <WeekSelector weekId={weekId} setWeekId={setWeekId} />
        {loading && <div className="text-center">Chargement...</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {days.map(day => {
            const dateString = toISODateString(day);
            const presentUsers = presencesByDay.get(dateString) || [];
            return (
              <Card key={dateString} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{format(day, 'eeee', { locale: fr })}</CardTitle>
                  <CardDescription>{format(day, 'd MMMM yyyy', { locale: fr })}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  {presentUsers.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {presentUsers.map(email => (
                        <li key={email} className="truncate">{email}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Personne n'est présent.</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
