import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const SHEET_NAME = 'Presences';

export type PresenceValue = 'Bureau' | 'Maison';

export interface PresenceData {
  weekNumber: string;
  date: string;
  userEmail: string;
  userName: string;
  presence: PresenceValue | string; // Allow string for initial parsing
  rawRow: number;
}

export function useGoogleSheets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { token, user } = useAuth();

  const getPresences = useCallback(async (weekNumber: string): Promise<PresenceData[]> => {
    if (!token) {
      setError(new Error("Authentication token is missing for reading data."));
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:E`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rows = response.data.values || [];
      const data = rows
        .map((row: string[], index: number) => ({
          weekNumber: row[0],
          date: row[1],
          userEmail: row[2],
          userName: row[3],
          presence: row[4],
          rawRow: index + 1,
        }))
        .filter((item: PresenceData) => item.weekNumber === weekNumber);

      return data;
    } catch (err: any) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  const setPresence = useCallback(async (
    date: string,
    weekNumber: string,
    presenceValue: PresenceValue
  ) => {
    if (!token || !user) {
      setError(new Error("User or token is missing for writing data."));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const readResponse = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:E`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rows = readResponse.data.values || [];
      const existingRowIndex = rows.findIndex(
        (row: string[]) => row[1] === date && row[2] === user.email
      );

      if (existingRowIndex !== -1) {
        const rowToUpdate = existingRowIndex + 1;
        // Update both UserName and Presence, in case the name was missing before
        await axios.put(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!D${rowToUpdate}:E${rowToUpdate}`,
          { values: [[user.name, presenceValue]] },
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { valueInputOption: 'RAW' }
          }
        );
      } else {
        await axios.post(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:E:append`,
          { values: [[weekNumber, date, user.email, user.name, presenceValue]] },
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS' }
          }
        );
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  return { loading, error, getPresences, setPresence };
}
