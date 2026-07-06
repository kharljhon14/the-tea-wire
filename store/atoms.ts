import { atom } from 'jotai';

interface DialogPostState {
  id?: string;
  isOpen: boolean;
}

export const dialogPostAtom = atom<DialogPostState>({
  id: undefined,
  isOpen: false
});

export const setDialogOpenAtom = atom(null, (_, set, isOpen: boolean, id?: string) => {
  set(dialogPostAtom, { id, isOpen });
});
