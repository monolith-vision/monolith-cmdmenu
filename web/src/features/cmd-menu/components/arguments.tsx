import { cn } from '@/lib/utils';
import useCommandStore from '@/stores/commands';

export default function Arguments() {
	const { input, matchingCommand } = useCommandStore();
	const visible =
		input.split(' ')[0].trim().toLowerCase() === matchingCommand?.name;

	return (
		<div className="flex items-center gap-2 ml-3">
			{matchingCommand?.arguments?.map((argument, i) => (
				<div
					key={argument.name}
					className={cn(
						'relative flex flex-col opacity-0 transition-opacity',
						visible && 'opacity-100',
					)}
					style={{
						transitionDelay: `${25 * i}ms`,
					}}
				>
					<span
						data-argument
						className="px-1 w-fit min-w-12 bg-foreground/10 border rounded-sm text-xs text-foreground outline-none"
						contentEditable
					></span>
					<span className="absolute text-[9px] text-foreground/25 bottom-0 translate-y-4">
						{argument.name}
					</span>
				</div>
			))}
		</div>
	);
}
