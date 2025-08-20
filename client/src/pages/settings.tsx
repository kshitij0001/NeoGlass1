import { useState } from "react";
import { StickyMotivationBar } from "@/components/layout/sticky-motivation-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings as SettingsIcon, Upload, Download, Trash2, Calendar, Bell, Volume2, Target, Palette, RotateCcw } from "lucide-react";
import { useStore } from "@/store";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";


export default function Settings() {
  const {
    settings,
    customColors,
    updateTheme,
    updateNeetDate,
    updateNotifications,
    updateSoundEnabled,
    updateDailyGoal,
    updateAutoSnooze,
    updateSubjectColor,
    updateDifficultyColor,
    updateCardColor,
    updateEventTypeColor,
    resetColorsToDefault,
    exportData,
    importData,
    resetAllData
  } = useStore();

  const { toast } = useToast();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExport = async () => {
    try {
      const blob = await exportData();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neet-backup-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      await importData(selectedFile);
      toast({
        title: "Import Successful",
        description: "Your data has been imported successfully.",
      });
      setIsImportOpen(false);
      setSelectedFile(null);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  const handleReset = async () => {
    try {
      await resetAllData();
      toast({
        title: "Reset Successful",
        description: "All data has been reset to defaults.",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Suggestive colors based on the provided palettes (fixed duplicates)
  const suggestiveColors = [
    ["#fbf8cc", "#fde4cf", "#ffcfd2", "#f1c0e8", "#cfbaf0", "#a3c4f3", "#90dbf4", "#8eecf5", "#98f5e1", "#b9fbc0"],
    ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#fffffc"],
    ["#e4dde3", "#ffd1ad", "#fbc5c8", "#f5a3c0", "#99ced6", "#ffd4b0", "#f6d6ff", "#8b9ed4", "#c1baea"],
    ["#f9c8da", "#fbdadc", "#fff1e6", "#bee1e6", "#edece8", "#e3e7f2", "#f6cbcb", "#cddafd"],
    ["#ffe09e", "#fff394", "#fbff94", "#eeff8f", "#e1ff94", "#cfff91", "#c0ff8c", "#9dff8a", "#94ffaf", "#a6fff2"]
  ];

  // Flattened list of all suggestive colors for a general picker
  const allSuggestiveColors = suggestiveColors.flat();

  return (
    <div className="min-h-screen">
      <StickyMotivationBar />
      <div className="max-w-sm mx-auto main-content min-h-screen pb-20">
        <div className="p-4">
          <div className="flex items-center mb-6">
            <SettingsIcon className="h-6 w-6 mr-3 text-brutal-black dark:text-white" />
            <h1 className="text-2xl font-black text-brutal-black dark:text-white">Settings</h1>
          </div>



          {/* NEET Date Settings */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-4">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              NEET Exam Date
            </h3>
            <div>
              <Label className="text-sm font-bold text-brutal-black dark:text-white">Target Date</Label>
              <Input
                type="datetime-local"
                value={settings.neetDate.slice(0, 16)}
                onChange={(e) => updateNeetDate(e.target.value + ":00.000Z")}
                className="border-3 border-brutal-black dark:border-white mt-2"
                data-testid="neet-date-input"
              />
            </div>
          </Card>

          {/* Appearance Settings */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-4">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Appearance
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-bold text-brutal-black dark:text-white">Theme</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark mode</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">Light</span>
                <Switch
                  checked={settings.theme === 'dark'}
                  onCheckedChange={(checked) => updateTheme(checked ? 'dark' : 'light')}
                  data-testid="theme-switch"
                />
                <span className="text-sm font-bold">Dark</span>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-4">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-bold text-brutal-black dark:text-white">Push Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about reviews</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={updateNotifications}
                  data-testid="notifications-switch"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-bold text-brutal-black dark:text-white flex items-center">
                    <Volume2 className="h-4 w-4 mr-1" />
                    Sound Effects
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Play sounds for actions</p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={updateSoundEnabled}
                  data-testid="sound-switch"
                />
              </div>
            </div>
          </Card>

          {/* Study Settings */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-4">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Study Goals
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="font-bold text-brutal-black dark:text-white">Daily Review Goal</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Number of reviews per day</p>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.dailyGoal}
                  onChange={(e) => updateDailyGoal(parseInt(e.target.value) || 20)}
                  className="border-3 border-brutal-black dark:border-white"
                  data-testid="daily-goal-input"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-bold text-brutal-black dark:text-white">Auto-Snooze</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically snooze overwhelming reviews</p>
                </div>
                <Switch
                  checked={settings.autoSnooze}
                  onCheckedChange={updateAutoSnooze}
                  data-testid="auto-snooze-switch"
                />
              </div>
            </div>
          </Card>

          {/* Color Customization */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-brutal-black dark:text-white flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Color Customization
              </h3>
              <Button
                onClick={resetColorsToDefault}
                variant="outline"
                size="sm"
                className="border-2 border-brutal-black dark:border-white"
                data-testid="reset-colors-btn"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>

            <div className="space-y-6">
              {/* Subject Colors */}
              <div>
                <h4 className="font-bold text-brutal-black dark:text-white mb-3">Subject Colors</h4>
                <div className="space-y-3">
                  {Object.entries(customColors.subjects).map(([subject, color]) => (
                    <ColorPicker
                      key={subject}
                      label={subject}
                      value={color}
                      onChange={(newColor) => updateSubjectColor(subject as keyof typeof customColors.subjects, newColor)}
                      presetColors={[
                        '#e9897e', '#f3d9df', '#95D2B3', '#0EA5E9', '#F472B6', '#15a154',
                        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'
                      ]}
                    />
                  ))}
                </div>
              </div>

              {/* Difficulty Colors */}
              <div>
                <h4 className="font-bold text-brutal-black dark:text-white mb-3">Difficulty Colors</h4>
                <div className="space-y-3">
                  {Object.entries(customColors.difficulties).map(([difficulty, color]) => (
                    <ColorPicker
                      key={difficulty}
                      label={difficulty}
                      value={color}
                      onChange={(newColor) => updateDifficultyColor(difficulty as keyof typeof customColors.difficulties, newColor)}
                      presetColors={[
                        '#22c55e', '#84cc16', '#65a30d', '#eab308', '#f59e0b', '#f97316',
                        '#ef4444', '#dc2626', '#b91c1c', '#10b981', '#059669', '#fbbf24'
                      ]}
                    />
                  ))}
                </div>
              </div>

              {/* Card Colors */}
              <div>
                <h4 className="font-bold text-brutal-black dark:text-white mb-3">Card Colors</h4>
                <div className="space-y-3">
                  {Object.entries(customColors.cards).map(([cardName, color]) => {
                    const displayName = cardName === 'averageScore' ? 'Average Score' :
                                       cardName === 'totalTests' ? 'Total Tests' :
                                       cardName === 'overallProgress' ? 'Overall Progress' :
                                       cardName === 'dayStreak' ? 'Day Streak' :
                                       cardName.charAt(0).toUpperCase() + cardName.slice(1);
                    return (
                      <ColorPicker
                        key={cardName}
                        label={displayName}
                        value={color}
                        onChange={(newColor) => updateCardColor(cardName as keyof typeof customColors.cards, newColor)}
                        presetColors={allSuggestiveColors}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Event Type Colors */}
              <div>
                <h4 className="font-bold text-brutal-black dark:text-white mb-3">Event Type Colors</h4>
                <div className="space-y-3">
                  {Object.entries(customColors.eventTypes).map(([eventType, color]) => {
                    const displayName = eventType.charAt(0).toUpperCase() + eventType.slice(1);
                    return (
                      <ColorPicker
                        key={eventType}
                        label={displayName}
                        value={color}
                        onChange={(newColor) => updateEventTypeColor(eventType, newColor)}
                        presetColors={allSuggestiveColors}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 These colors will be applied throughout the app for subjects, difficulty indicators, and various cards and event types.
                </p>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-4">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4">Data Management</h3>
            <div className="space-y-3">
              <Button
                onClick={handleExport}
                className="w-full neobrutalist-btn bg-mustard hover:bg-mustard/90 text-brutal-black justify-start"
                data-testid="export-btn"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>

              <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 w-full neobrutalist-btn bg-electric-blue hover:bg-electric-blue/90 justify-start text-[#363d49]"
                    data-testid="import-btn"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-morphism border-4 border-brutal-black dark:border-white rounded-3xl max-w-sm mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black text-brutal-black dark:text-white">
                      Import Data
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-bold text-brutal-black dark:text-white">Select Backup File</Label>
                      <Input
                        type="file"
                        accept=".json"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="border-3 border-brutal-black dark:border-white mt-2"
                        data-testid="import-file-input"
                      />
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ Importing will replace all current data. Make sure to export your current data first!
                      </p>
                    </div>
                    <Button
                      onClick={handleImport}
                      disabled={!selectedFile}
                      className="w-full neobrutalist-btn bg-electric-blue hover:bg-electric-blue/90 text-white font-bold"
                      data-testid="confirm-import-btn"
                    >
                      Import Data
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full neobrutalist-btn bg-red-500 hover:bg-red-600 text-white justify-start"
                    data-testid="reset-data-btn"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-morphism border-4 border-brutal-black dark:border-white rounded-3xl max-w-sm mx-4">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black text-brutal-black dark:text-white">
                      Reset All Data
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-brutal-black dark:text-white">
                      This will permanently delete all your reviews, progress, tests, and settings.
                      This action cannot be undone. Are you sure you want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="neobrutalist-btn border-brutal-black dark:border-white">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      className="neobrutalist-btn bg-red-500 hover:bg-red-600 text-white"
                      data-testid="confirm-reset-btn"
                    >
                      Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>

          {/* App Info */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4">About</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>NEET 2026 Study Companion</strong></p>
              <p>Version 0.7.15</p>
              <p>Built with ❤️ for My Bunny 🐰</p>
              <p className="text-xs mt-4">
                This app uses spaced repetition intervals: [4, 7, 14, 28, 40] days to optimize your learning.
              </p>
              <div className="mt-4 text-center">
                <div className="font-mono text-xs">
                  {'•'.repeat(useStore.getState().getStreakRestoresRemaining())}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}