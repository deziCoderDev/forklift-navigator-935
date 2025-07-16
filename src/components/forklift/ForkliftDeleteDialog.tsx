
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Forklift } from '@/types';
import { Trash2 } from 'lucide-react';

interface ForkliftDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forklift: Forklift | null;
  onConfirmDelete: () => void;
}

const ForkliftDeleteDialog: React.FC<ForkliftDeleteDialogProps> = ({
  open,
  onOpenChange,
  forklift,
  onConfirmDelete
}) => {
  const handleConfirm = () => {
    onConfirmDelete();
    onOpenChange(false);
  };

  if (!forklift) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-900 border-slate-700">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-slate-100">
                Excluir Empilhadeira
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-slate-400 text-base leading-relaxed">
            Tem certeza que deseja excluir a empilhadeira{' '}
            <span className="font-bold text-slate-200">{forklift.id}</span>{' '}
            ({forklift.modelo})?
            <br />
            <br />
            <span className="text-red-400 font-medium">
              Esta ação não pode ser desfeita.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600 hover:text-white">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ForkliftDeleteDialog;
