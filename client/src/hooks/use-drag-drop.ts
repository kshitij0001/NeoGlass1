
export interface DragDropItem {
  id: string;
  type: 'review' | 'event';
  data: any;
}

export interface DragDropHandlers {
  onDragStart: (item: DragDropItem) => void;
  onDragEnd: () => void;
  onDrop: (item: DragDropItem, targetDate: string) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export function useDragDrop(handlers: DragDropHandlers) {
  const handleDragStart = (e: React.DragEvent, item: DragDropItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
    handlers.onDragStart(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    handlers.onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    if (itemData) {
      const item: DragDropItem = JSON.parse(itemData);
      handlers.onDrop(item, targetDate);
    }
    handlers.onDragEnd();
  };

  const handleDragEnd = () => {
    handlers.onDragEnd();
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
