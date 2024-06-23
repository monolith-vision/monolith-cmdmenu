import { useNuiEvent } from '@/lib/hooks';
import { useKeyDown } from '@/lib/keys';
import { useEffect, useRef } from 'react';

import useCommandStore from '@/stores/commands';

import { cn, setTextRange } from '@/lib/utils';

import Results from './components/results';
import Argument from './components/argument';
import { ArrowRightToLine } from 'lucide-react';

export default function CommandMenu() {
	const inputRef = useRef<HTMLSpanElement>(null);
	const {
		input,
		commands,
		matchingCommand,
		setInput,
		setCommands,
		setMatchingCommand,
		setCommandValues,
	} = useCommandStore();

	const isInputMatching =
		input.split(' ')[0].trim().toLowerCase() === matchingCommand?.name;

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

	useEffect(() => {
		if (matchingCommand && matchingCommand.arguments)
			setCommandValues(
				Array(matchingCommand.arguments.length).fill(null),
			);
	}, [setCommandValues, matchingCommand]);

	useNuiEvent<Command[]>('UpdateCommands', (commands) =>
		setCommands(
			commands.sort((a, b) =>
				a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
			),
		),
	);

	const getFocusedIndex = (
		elements: NodeListOf<Element>,
		focusedElement: HTMLElement,
	): number => {
		let focusedIndex = -1;

		elements.forEach(
			(element, index) =>
				element === focusedElement && (focusedIndex = index),
		);

		return focusedIndex;
	};

	const focusInput: React.MouseEventHandler<HTMLDivElement> = (e) => {
		if (!inputRef.current || !(e.target as HTMLElement).dataset.focus)
			return;

		inputRef.current.focus();

		if (inputRef.current.childNodes[0])
			setTextRange(inputRef.current.childNodes[0], input.length);
	};

	useKeyDown('Tab', (e) => {
		if (
			!matchingCommand ||
			!inputRef.current ||
			(e.target !== inputRef.current &&
				!(e.target as HTMLElement).dataset.argument)
		)
			return;

		e.preventDefault();

		if (inputRef.current.textContent === matchingCommand.name) {
			const elements = document.querySelectorAll('[data-argument]');
			const focusedElement = document.activeElement as HTMLElement;
			const focusedIndex = getFocusedIndex(elements, focusedElement);
			let rangeElement = inputRef.current;

			const nextItem = elements.item(
				focusedIndex + 1,
			) as HTMLElement | null;

			if (
				!focusedElement ||
				!focusedElement.dataset.argument ||
				focusedIndex === -1
			)
				rangeElement = elements.item(0) as HTMLElement;
			else if (nextItem) rangeElement = nextItem;

			rangeElement.focus();
			setTextRange(
				rangeElement.childNodes[0],
				rangeElement.textContent?.length ?? -1,
			);

			return;
		}

		inputRef.current.textContent = matchingCommand.name;
		setInput(matchingCommand.name);

		setTextRange(
			inputRef.current.childNodes[0],
			matchingCommand.name.length,
		);
	});

	return (
		<main className="absolute w-[650px] min-h-24 max-h-[600px] bg-background border rounded-xl">
			<div
				data-focus
				className="relative w-full px-4 py-3 h-14 flex items-center border-b"
				onClick={focusInput}
			>
				<span
					ref={inputRef}
					data-focus
					contentEditable
					suppressContentEditableWarning
					className="max-w-full text-sm font-medium text-foreground outline-none"
					onInput={(e) => {
						e.preventDefault();
						setInput(e.currentTarget.textContent ?? '');
					}}
				/>
				<span data-focus className="text-foreground/25">
					{matchingCommand?.name.substring(
						input.split(' ')[0].trim().length,
					) ||
						(!input.length && 'Enter Command')}
				</span>
				<div className="flex items-center gap-2 ml-3">
					{matchingCommand?.arguments?.map((argument, i) => (
						<Argument
							key={i}
							index={i}
							{...argument}
							visible={isInputMatching}
						/>
					))}
				</div>
				<span
					className={cn(
						'flex gap-2 items-center px-1.5 py-1 bg-accent/80 rounded-md text-sm text-foreground translate-x-2 ml-auto opacity-0 transition-all duration-300',
						isInputMatching && 'opacity-100 translate-x-0',
					)}
				>
					<ArrowRightToLine size={15} />
				</span>
			</div>
			<Results />
		</main>
	);
}
