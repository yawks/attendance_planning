import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const SHEET_NAME = 'Presences';

export interface PresenceData {
  weekNumber: string;
  date: string;
  userEmail: string;
  presence: 'Yes' | 'No';
  rawRow: number;
}

export function useGoogleSheets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useAuth();

  const getPresences = useCallback(async (weekNumber: string): Promise<PresenceData[]> => {
    if (!token) {
      setError(new Error("Authentication token is missing for reading data."));
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:D`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rows = response.data.values || [];
      const data = rows
        .map((row: string[], index: number) => ({
          weekNumber: row[0],
          date: row[1],
          userEmail: row[2],
          presence: row[3],
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
    userEmail: string,
    weekNumber: string,
    isPresent: boolean
  ) => {
    if (!token) {
      setError(new Error("Authentication token is missing for writing data."));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const readResponse = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:D`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rows = readResponse.data.values || [];
      const existingRowIndex = rows.findIndex(
        (row: string[]) => row[1] === date && row[2] === userEmail
      );

      const presenceValue = isPresent ? 'Yes' : 'No';

      if (existingRowIndex !== -1) {
        const rowToUpdate = existingRowIndex + 1;
        await axios.put(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!D${rowToUpdate}`,
          { values: [[presenceValue]] },
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { valueInputOption: 'RAW' }
          }
        );
      } else {
        await axios.post(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:D:append`,
          { values: [[weekNumber, date, userEmail, presenceValue]] },
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
  }, [token]);

  return { loading, error, getPresences, setPresence };
}
