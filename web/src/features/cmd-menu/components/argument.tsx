import { cn, setTextRange } from '@/lib/utils';

import { useEffect, useRef } from 'react';
import useCommandStore from '@/stores/commands';

export default function Argument({
	name,
	type,
	choices,
	required,
	index,
	visible,
}: {
	index: number;
	visible: boolean;
} & CommandArgument) {
	const { commandValues, setFocusedArgument, setCommandValues } =
		useCommandStore();
	const inputRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!inputRef.current || !commandValues[index]) return;

		const value = `${commandValues[index]}`;

		inputRef.current.textContent = value;

		if (inputRef.current.childNodes[0])
			setTextRange(inputRef.current.childNodes[0], value.length);
	}, [commandValues, inputRef, index]);

	return (
		<div
			key={name}
			className={cn(
				'relative flex flex-col opacity-0 transition-opacity',
				visible && 'opacity-100',
			)}
		>
			<span
				data-argument
				ref={inputRef}
				className="px-1 w-fit min-w-12 bg-foreground/10 border rounded-sm text-xs text-foreground outline-none"
				contentEditable
				onInput={(e) => {
					e.preventDefault();

					const number = Number(e.currentTarget.textContent);

					commandValues[index] =
						type === 'number'
							? number
							: e.currentTarget.textContent;

					setCommandValues([...commandValues]);
				}}
				onFocus={() =>
					setFocusedArgument({
						name,
						type,
						choices,
						required,
					})
				}
				onBlur={() => setFocusedArgument(undefined)}
			/>
			<span
				className={cn(
					'absolute text-[9px] text-foreground/25 bottom-0 translate-y-4',
					required &&
						'after:content-["*"] after:ml-1 after:text-red-600',
				)}
			>
				{name}
			</span>
		</div>
	);
}
