import { useState, useCallback } from 'react';
import { gapi } from 'gapi-script';

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const SHEET_NAME = 'Presences';

export interface PresenceData {
  weekNumber: string;
  date: string;
  userEmail: string;
  presence: 'Yes' | 'No';
  rawRow: number; // Keep track of the original row index for updates
}

export function useGoogleSheets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getPresences = useCallback(async (weekNumber: string): Promise<PresenceData[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:D`,
      });

      const rows = response.result.values || [];
      const data = rows
        .map((row, index) => ({
          weekNumber: row[0],
          date: row[1],
          userEmail: row[2],
          presence: row[3],
          rawRow: index + 1, // Sheets are 1-indexed
        }))
        .filter(item => item.weekNumber === weekNumber);

      return data;
    } catch (err: any) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const setPresence = useCallback(async (
    date: string,
    userEmail: string,
    weekNumber: string,
    isPresent: boolean
  ) => {
    setLoading(true);
    setError(null);
    try {
      // First, get all data to check if the entry exists
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:D`,
      });

      const rows = response.result.values || [];
      const existingRowIndex = rows.findIndex(
        row => row[1] === date && row[2] === userEmail
      );

      const presenceValue = isPresent ? 'Yes' : 'No';

      if (existingRowIndex !== -1) {
        // Row exists, update it
        const rowToUpdate = existingRowIndex + 1;
        await gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!D${rowToUpdate}`,
          valueInputOption: 'RAW',
          resource: {
            values: [[presenceValue]],
          },
        });
      } else {
        // Row does not exist, append it
        await gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A:D`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: [[weekNumber, date, userEmail, presenceValue]],
          },
        });
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, getPresences, setPresence };
}
