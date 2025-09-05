import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { getDaysInWeek, toISODateString } from '@/lib/date-utils';

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const SHEET_NAME = 'Presences';

export type PresenceValue = 'Bureau' | 'Maison' | 'Off';

export interface PresenceData {
  weekNumber: string;
  date: string;
  userEmail: string;
  userName: string;
  isContractHolder: boolean;
  presence: PresenceValue | string;
  rawRow: number;
}

export function useGoogleSheets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { token, user } = useAuth();

  const getPresences = useCallback(async (weekNumber: string): Promise<PresenceData[]> => {
    if (!token) return [];
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:F`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rows = response.data.values || [];
      const data = rows
        .map((row: string[], index: number) => ({
          weekNumber: row[0],
          date: row[1],
          userEmail: row[2],
          userName: row[3],
          isContractHolder: row[4] === 'TRUE',
          presence: row[5],
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
    presenceValue: PresenceValue,
    isContractHolder: boolean
  ) => {
    if (!token || !user) return;
    setLoading(true);
    setError(null);
    try {
      const readResponse = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:F`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rows = readResponse.data.values || [];
      const existingRowIndex = rows.findIndex(
        (row: string[]) => row[1] === date && row[2] === user.email
      );

      if (existingRowIndex !== -1) {
        const rowToUpdate = existingRowIndex + 1;
        await axios.put(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!F${rowToUpdate}`,
          { values: [[presenceValue]] },
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { valueInputOption: 'RAW' },
          }
        );
      } else {
        await axios.post(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:F:append`,
          { values: [[weekNumber, date, user.email, user.name, isContractHolder ? 'TRUE' : 'FALSE', presenceValue]] },
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

  const setContractHolderStatus = useCallback(async (weekId: string, status: boolean) => {
    if (!token || !user) return;
    setLoading(true);
    setError(null);
    try {
      const days = getDaysInWeek(weekId);

      const readResponse = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:F`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const rows = readResponse.data.values || [];

      const promises = days.map(day => {
        const dateString = toISODateString(day);
        const existingRowIndex = rows.findIndex(
          (row: string[]) => row[1] === dateString && row[2] === user.email
        );

        if (existingRowIndex !== -1) {
          const rowToUpdate = existingRowIndex + 1;
          return axios.put(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!E${rowToUpdate}`,
            { values: [[status ? 'TRUE' : 'FALSE']] },
            { headers: { Authorization: `Bearer ${token}` }, params: { valueInputOption: 'RAW' } }
          );
        } else {
          return axios.post(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:F:append`,
            { values: [[weekId, dateString, user.email, user.name, status ? 'TRUE' : 'FALSE', '']] },
            { headers: { Authorization: `Bearer ${token}` }, params: { valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS' } }
          );
        }
      });
      await Promise.all(promises);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  return { loading, error, getPresences, setPresence, setContractHolderStatus };
}
