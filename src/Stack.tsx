export function Stack({
	className,
	stack,
}: {
	className?: string;
	stack: string[];
}) {
	return (
		<div className={className}>
			<div className={className}>
				<div className="border-l border-r border-b rounded-b-lg border-black w-96 h-80 flex flex-col-reverse">
					{stack.map((e, index) => {
						return (
							<p key={index} className="text-3xl">
								{e}
							</p>
						);
					})}
				</div>
			</div>
		</div>
	);
}
