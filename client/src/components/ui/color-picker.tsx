
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  presetColors?: string[];
}

export function ColorPicker({ value, onChange, label, presetColors = [] }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const handleHexChange = (hex: string) => {
    setHexInput(hex);
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      onChange(hex);
    }
  };

  const handlePresetClick = (color: string) => {
    setHexInput(color);
    onChange(color);
    setIsOpen(false);
  };

  const defaultPresets = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
  ];

  const colorsToShow = presetColors.length > 0 ? presetColors : defaultPresets;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-bold text-brutal-black dark:text-white">{label}</Label>
      <div className="flex gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-10 h-10 rounded-lg border-2 border-brutal-black dark:border-white cursor-pointer"
            style={{ backgroundColor: value }}
            onClick={() => setIsOpen(!isOpen)}
          />
          <Input
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#000000"
            className="border-2 border-brutal-black dark:border-white"
            maxLength={7}
          />
        </div>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-2 border-brutal-black dark:border-white"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 glass-morphism border-2 border-brutal-black dark:border-white">
            <div className="grid grid-cols-6 gap-2">
              {colorsToShow.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-brutal-black dark:hover:border-white transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => handlePresetClick(color)}
                  title={color}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
