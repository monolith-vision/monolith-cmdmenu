import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function setTextRange(node: Node, offset: number) {
	if (!node) return;

	const selection = window.getSelection();

	if (!selection) return;

	const range = document.createRange();

	range.setStart(node, offset);
	range.collapse(true);

	selection.removeAllRanges();
	selection.addRange(range);
}
