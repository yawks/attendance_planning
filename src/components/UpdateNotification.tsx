import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';

export function UpdateNotification() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error:', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Une nouvelle version est disponible.
          </p>
          <div className="ml-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateServiceWorker(true)}
            >
              Recharger
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={close}
            >
              &times;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
