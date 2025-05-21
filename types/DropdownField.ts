import { Dispatch, SetStateAction } from 'react';

export interface DropdownFieldProps {
    label: string;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>; // Correct type for setState function
    value: string | null;
    setValue: Dispatch<SetStateAction<string | null>>;
    items: { label: string; value: string }[];
    zIndex?: number;
}
