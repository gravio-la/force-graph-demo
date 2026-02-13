import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { GraphFile } from "@/store/graphStore";

export interface ConfirmDeleteGraphModalProps {
  graph: GraphFile;
  onConfirm: () => void;
}

export const ConfirmDeleteGraphModal = NiceModal.create<ConfirmDeleteGraphModalProps>(() => {
  const modal = useModal();
  const { graph, onConfirm } = modal.args ?? { graph: null, onConfirm: () => {} };

  const handleConfirm = () => {
    onConfirm();
    modal.hide();
    setTimeout(() => modal.remove(), 200);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      modal.hide();
      setTimeout(() => modal.remove(), 200);
    }
  };

  if (!graph) return null;

  return (
    <Dialog open={modal.visible} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Delete graph</DialogTitle>
          <DialogDescription>
            Remove &quot;{graph.metadata?.name ?? "Unknown"}&quot; from local storage? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
