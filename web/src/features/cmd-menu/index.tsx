import { useNuiEvent } from '@/lib/hooks';
import { useKeyDown } from '@/lib/keys';
import { useEffect, useRef, useState } from 'react';

import useCommandStore from '@/stores/commands';
import usePlayerStore from '@/stores/players';

import { fetchNui } from '@/lib';
import { cn, setTextRange } from '@/lib/utils';

import Results from './components/results';
import Argument from './components/argument';
import { ArrowRightToLine } from 'lucide-react';
import { CSSTransition } from 'react-transition-group';

export default function CommandMenu() {
	const inputRef = useRef<HTMLSpanElement>(null);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const [display, toggleDisplay] = useState(false);
	const {
		input,
		commands,
		commandValues,
		matchingCommand,
		setInput,
		setCommands,
		setCommandValues,
		setMatchingCommand,
		setFocusedArgument,
	} = useCommandStore();

	const { setPlayers } = usePlayerStore();

	const isInputMatching =
		input.split(' ')[0].trim().toLowerCase() === matchingCommand?.name;

	useEffect(() => {
		setCommandValues([]);
	}, [matchingCommand, setCommandValues]);

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

	useEffect(() => {
		if (display) return;

		setTimeout(() => {
			setInput('');
			setCommandValues([]);
			setMatchingCommand(undefined);
			setFocusedArgument(undefined);
		}, 500);
	}, [
		display,
		setInput,
		setCommandValues,
		setMatchingCommand,
		setFocusedArgument,
	]);

	useNuiEvent<boolean>('ToggleMenu', toggleDisplay);

	useNuiEvent<Command[]>('UpdateCommands', (commands) =>
		setCommands(
			commands.sort((a, b) =>
				a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
			),
		),
	);

	useNuiEvent<Player[]>('UpdatePlayers', setPlayers);

	const focusInput: React.MouseEventHandler<HTMLDivElement> = (e) => {
		if (!inputRef.current || !(e.target as HTMLElement).dataset.focus)
			return;

		inputRef.current.focus();

		if (inputRef.current.childNodes[0])
			setTextRange(inputRef.current.childNodes[0], input.length);
	};

	const focusElement = (index: number) => {
		const elements = document.querySelectorAll('[data-argument]');
		const inputEl = inputRef.current;

		if (inputEl && index === -1) {
			inputEl.focus();
			setTextRange(inputEl.childNodes[0], input.length);
			return;
		}

		if (!elements[index]) return;

		const element = elements[index] as HTMLElement;

		element.focus();
		setTextRange(element.childNodes[0], element.textContent?.length ?? -1);
	};

	useKeyDown('Tab', (e) => {
		if (!matchingCommand || !inputRef.current) return;

		e.preventDefault();

		if (inputRef.current.textContent === matchingCommand.name) {
			const elements = document.querySelectorAll('[data-argument]');
			const totalElements = elements.length;

			let nextIndex = (focusedIndex + 1) % (totalElements + 1);
			if (nextIndex === totalElements) nextIndex = -1;

			setFocusedIndex(nextIndex);
			focusElement(nextIndex);

			return;
		}

		inputRef.current.textContent = matchingCommand.name;
		setInput(matchingCommand.name);

		setTextRange(
			inputRef.current.childNodes[0],
			matchingCommand.name.length,
		);
	});

	useKeyDown('Enter', (e) => {
		e.preventDefault();

		if (
			!matchingCommand ||
			!matchingCommand.arguments ||
			input !== matchingCommand.name ||
			((document.activeElement as HTMLElement).dataset.argument &&
				!e.shiftKey)
		)
			return;

		for (let index = 0; index < matchingCommand.arguments.length; index++) {
			const argument = matchingCommand.arguments[index];

			if (argument.required && !commandValues[index]) return;
		}

		const command = `${matchingCommand.name} ${commandValues.join(' ')}`;

		fetchNui('submit', {
			command,
		}).then(() => toggleDisplay(false));
	});

	return (
		<div className="absolute translate-y-1/4 w-[650px] h-[350px]">
			<CSSTransition
				in={display}
				timeout={500}
				classNames="cmd-menu"
				unmountOnExit
			>
				<main className="w-[650px] min-h-24 max-h-[350px] bg-background border rounded-xl">
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
						<span
							data-focus
							className="text-sm font-medium text-foreground/25"
						>
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
			</CSSTransition>
		</div>
	);
}
