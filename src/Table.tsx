import { MatrixAction } from './App';
import { CurrentCell } from './useAnalyzer';

export function Table({
	values,
	className,
	dispatch,
	isStarted,
	currentCell,
}: {
	values: (string | number)[][];
	className?: string;
	dispatch: React.Dispatch<MatrixAction>;
	isStarted: boolean;
	currentCell: CurrentCell;
}) {
	return (
		<div className={className}>
			<div className="flex items-center justify-center">
				<table className="mr-3">
					<tbody className="border border-black ">
						{values.map((row, i) => (
							<tr key={'row' + i} className="border border-black">
								{row.map((cell, j) => (
									<td
										key={'col' + j}
										className="border border-black"
									>
										<input
											disabled={
												isStarted ||
												(i === 0 && j === 0) ||
												(i === values.length - 1 &&
													j === values[0].length - 1)
											}
											className={
												'h-12 w-24 rounded-lgfont-medium focus:outline-none text-center ' +
												(currentCell.row === i &&
												i !== 0 &&
												j !== 0 &&
												currentCell.column === j
													? 'bg-blue-500 text-white'
													: '')
											}
											type="text"
											value={cell}
											onChange={(e) => {
												dispatch({
													type: 'CELL',
													i: i,
													j: j,
													value: e.target.value,
												});
											}}
										/>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
				<div className="flex items-center justify-center gap-3">
					<button
						hidden={isStarted}
						disabled={isStarted}
						className="text-3xl"
						onClick={() =>
							dispatch({
								operation: 'REMOVE',
								type: 'COLUMN',
							})
						}
					>
						-
					</button>
					<button
						hidden={isStarted}
						disabled={isStarted}
						className="text-3xl"
						onClick={() =>
							dispatch({
								operation: 'ADD',
								type: 'COLUMN',
							})
						}
					>
						+
					</button>
				</div>
			</div>
			<div className="flex items-center justify-center gap">
				<div className="flex flex-col ml-4">
					<button
						hidden={isStarted}
						disabled={isStarted}
						className="text-3xl"
						onClick={() =>
							dispatch({
								operation: 'REMOVE',
								type: 'ROW',
							})
						}
					>
						-
					</button>
					<button
						hidden={isStarted}
						disabled={isStarted}
						className="text-3xl"
						onClick={() =>
							dispatch({
								operation: 'ADD',
								type: 'ROW',
							})
						}
					>
						+
					</button>
				</div>
			</div>
		</div>
	);
}
