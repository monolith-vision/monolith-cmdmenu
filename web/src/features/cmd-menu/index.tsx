import { useNuiEvent } from '@/lib/hooks';
import { useKeyDown } from '@/lib/keys';
import { useEffect, useRef } from 'react';

import useCommandStore from '@/stores/commands';

import { cn, setTextRange } from '@/lib/utils';

import Results from './components/results';
import Arguments from './components/arguments';
import { ArrowRightToLine } from 'lucide-react';

export default function CommandMenu() {
	const inputRef = useRef<HTMLSpanElement>(null);
	const {
		input,
		commands,
		matchingCommand,
		setCommands,
		setInput,
		setMatchingCommand,
	} = useCommandStore();

	useEffect(() => {
		if (!input.length) return setMatchingCommand(undefined);

		const lowered = input.split(' ')[0].trim().toLowerCase();

		setMatchingCommand(
			commands.find((c) => c.name.toLowerCase().startsWith(lowered)),
		);
	}, [input, commands, setMatchingCommand]);

	useEffect(() => {
		if (!inputRef.current) return;

		inputRef.current.textContent = input;

		if (inputRef.current.childNodes[0])
			setTextRange(inputRef.current.childNodes[0], input.length);
	}, [input, inputRef]);

	useNuiEvent<Command[]>('UpdateCommands', (commands) =>
		setCommands(
			commands.sort((a, b) =>
				a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
			),
		),
	);

	useKeyDown('Tab', (e) => {
		if (
			!matchingCommand ||
			!inputRef.current ||
			e.target !== inputRef.current
		)
			return;

		e.preventDefault();

		inputRef.current.textContent = matchingCommand.name;
		setInput(matchingCommand.name);

		setTextRange(
			inputRef.current.childNodes[0],
			matchingCommand.name.length,
		);
	});

	const focusInput: React.MouseEventHandler<HTMLDivElement> = (e) => {
		if (!inputRef.current || !(e.target as HTMLElement).dataset.focus)
			return;

		inputRef.current.focus();

		if (inputRef.current.childNodes[0])
			setTextRange(inputRef.current.childNodes[0], input.length);
	};

	return (
		<main className="absolute w-[650px] min-h-24 max-h-[600px] bg-background border rounded-xl">
			<div
				data-focus
				className="relative w-full px-4 py-3 h-14 flex items-center border-b"
				onClick={focusInput}
			>
				<span
					data-focus
					contentEditable
					suppressContentEditableWarning
					ref={inputRef}
					className="max-w-full text-sm font-medium text-foreground outline-none"
					onInput={(e) => {
						e.preventDefault();
						setInput(e.currentTarget.textContent ?? '');
					}}
				/>
				<span data-focus className="text-foreground/25">
					{matchingCommand?.name.substring(
						input.split(' ')[0].length,
					) ||
						(!input.length && 'Enter Command')}
				</span>
				<Arguments />
				<span
					className={cn(
						'flex gap-2 items-center px-1.5 py-1 bg-accent/80 rounded-md text-sm text-foreground translate-x-2 ml-auto opacity-0 transition-all duration-300',
						matchingCommand !== undefined &&
							input.split(' ')[0].trim().toLowerCase() !==
								matchingCommand?.name &&
							'opacity-100 translate-x-0',
					)}
				>
					<ArrowRightToLine size={15} />
				</span>
			</div>
			<Results />
		</main>
	);
}
