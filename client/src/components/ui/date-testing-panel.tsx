
import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { DateTesting } from '@/lib/date-testing';

export function DateTestingPanel() {
  const [mockDate, setMockDate] = useState('');
  const [isMocking, setIsMocking] = useState(false);
  const [dateInfo, setDateInfo] = useState(DateTesting.getInfo());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateInfo(DateTesting.getInfo());
      setIsMocking(DateTesting.isMocking());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSetMockDate = () => {
    if (mockDate) {
      try {
        DateTesting.setMockDate(mockDate);
        setIsMocking(true);
      } catch (error) {
        alert('Invalid date format');
      }
    }
  };

  const handleClearMockDate = () => {
    DateTesting.clearMockDate();
    setIsMocking(false);
    setMockDate('');
  };

  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const isoString = date.toISOString().split('T')[0] + 'T' + date.toTimeString().split(' ')[0];
    setMockDate(isoString);
    DateTesting.setMockDate(date);
    setIsMocking(true);
  };

  return (
    <Card className="m-4 border-4 border-red-500 bg-red-50 dark:bg-red-950/20">
      <CardHeader>
        <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
          🧪 DATE TESTING PANEL (REMOVE IN PRODUCTION)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-1">
          <div>Status: {isMocking ? '🔴 MOCKING' : '🟢 REAL TIME'}</div>
          <div>Current Date: {dateInfo.isMocking ? dateInfo.mockDate : dateInfo.realDate}</div>
        </div>

        <div className="space-y-2">
          <Input
            type="datetime-local"
            value={mockDate}
            onChange={(e) => setMockDate(e.target.value)}
            placeholder="YYYY-MM-DDTHH:MM"
            className="border-red-300"
          />
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleSetMockDate} variant="destructive" size="sm">
              Set Mock Date
            </Button>
            <Button onClick={handleClearMockDate} variant="outline" size="sm">
              Clear Mock
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-semibold">Quick Set:</div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setQuickDate(-7)} variant="outline" size="sm">
              -7 days
            </Button>
            <Button onClick={() => setQuickDate(-1)} variant="outline" size="sm">
              Yesterday
            </Button>
            <Button onClick={() => setQuickDate(1)} variant="outline" size="sm">
              Tomorrow
            </Button>
            <Button onClick={() => setQuickDate(7)} variant="outline" size="sm">
              +7 days
            </Button>
            <Button onClick={() => setQuickDate(30)} variant="outline" size="sm">
              +30 days
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
