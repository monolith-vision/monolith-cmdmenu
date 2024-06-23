import { CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Choices({
	selected,
	choices,
	setSelected,
}: {
	selected: number;
	choices: CommandArgumentChoice[];
	setSelected: React.Dispatch<React.SetStateAction<number>>;
}) {
	return (
		<>
			{choices.map((choice, index) => (
				<button
					key={choice.value}
					className={cn(
						'relative flex items-center justify-start p-2 rounded-lg z-0 opacity-50 transition-all',
						'before:absolute before:bg-accent/40 before:inset-[99px] before:-z-[1] before:rounded-[inherit] before:duration-300 before:border before:border-border before:opacity-0',
						selected === index &&
							'before:inset-0 before:opacity-100 opacity-100',
					)}
					onClick={() => setSelected(index)}
				>
					<span className="text-sm text-foreground">
						{choice.label}
					</span>
					<span
						className={cn(
							'flex gap-2 items-center px-1.5 py-1 bg-accent/80 rounded-md text-sm text-foreground translate-x-2 ml-auto opacity-0 transition-all duration-300',
							selected === index && 'opacity-100 translate-x-0',
						)}
					>
						Select
						<CornerDownLeft size={14} />
					</span>
				</button>
			))}
		</>
	);
}
