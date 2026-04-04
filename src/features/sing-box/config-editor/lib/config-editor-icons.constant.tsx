import { Ban, Check, CirclePlus, Copy, FilePenLine, Trash } from "lucide-react";

export const configEditorIcons = {
  add: (
    <CirclePlus
      className="text-chart-2 hover:text-primary transition-colors"
      size={20}
    />
  ),
  delete: (
    <Trash
      className="text-chart-1 hover:text-primary transition-colors"
      size={20}
    />
  ),
  edit: (
    <FilePenLine
      className="text-muted-foreground hover:text-primary transition-colors"
      size={20}
    />
  ),
  copy: (
    <Copy
      className="text-muted-foreground hover:text-primary transition-colors"
      size={20}
    />
  ),
  ok: (
    <Check
      className="text-chart-2 hover:text-primary transition-colors"
      size={20}
    />
  ),
  cancel: (
    <Ban
      className="text-chart-1 hover:text-primary transition-colors"
      size={20}
    />
  ),
};
