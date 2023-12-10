import './App.css';
import { useEffect, useReducer, useState } from 'react';
import { Table } from './Table';
import { Stack } from './Stack';
import { useAnalyzer } from './useAnalyzer';
import { extractSymbols, parseCSV, readContent } from './util';
import { FileInput } from './FileInput';

export type MatrixAction =
	| { type: 'FILL'; value: string[][] }
	| { operation: 'ADD' | 'REMOVE'; type: 'ROW' | 'COLUMN' }
	| { type: 'CELL'; i: number; j: number; value: string };

const DEFAULT_RULES = [
	['', '+', '*', '(', ')', 'i', '#'],
	['E', '', '', 'TD;1', '', 'TD;1', ''],
	['D', '+TD;2', '', '', 'eps;3', '', 'eps;3'],
	['T', '', '', 'FG;4', '', 'FG;4', ''],
	['G', 'eps;6', '*FG;5', '', 'eps;6', '', 'eps;6'],
	['F', '', '', '(E);7', '', 'i;8', ''],
	['+', 'pop', '', '', '', '', ''],
	['*', '', 'pop', '', '', '', ''],
	['(', '', '', 'pop', '', '', ''],
	[')', '', '', '', 'pop', '', ''],
	['i', '', '', '', '', 'pop', ''],
	['#', '', '', '', '', '', 'accepted'],
];

function reducer(state: string[][], action: MatrixAction): string[][] {
	switch (action.type) {
		case 'COLUMN':
			return state.map((row) =>
				action.operation === 'ADD' ? [...row, ''] : row.slice(0, -1)
			);
		case 'ROW':
			return action.operation === 'ADD'
				? [...state, Array(state[0].length).fill('')]
				: state.slice(0, -1);
		case 'CELL':
			const newState = [...state];
			newState[action.i][action.j] = action.value;
			return newState;
		case 'FILL':
			return action.value;
		default:
			return state;
	}
}

function App() {
	const [matrix, dispatch] = useReducer(reducer, DEFAULT_RULES);
	const { startSymbol, endSymbol } = extractSymbols(matrix);
	const [file, setFile] = useState<File>();
	const [isStarted, setIsStarted] = useState(false);
	const [stack, setStack] = useState<string[]>([endSymbol, startSymbol]);
	const [input, setInput] = useState('');
	const { analyze, cleanedInput, currentCell, result, ruleSequenceNumbers } =
		useAnalyzer(matrix, input, stack, setStack);

	useEffect(() => {
		if (file) {
			readContent(file!).then((text) => {
				const parsedContent = parseCSV(text);
				dispatch({
					type: 'FILL',
					value: parsedContent,
				});
			});
		} else {
			dispatch({
				type: 'FILL',
				value: DEFAULT_RULES,
			});
		}
	}, [file]);

	return (
		<div className="flex items-center gap-32">
			<div className="flex flex-col items-center gap-6">
				<div className="flex-col mt-10">
					<div className="flex">
						{ruleSequenceNumbers &&
							ruleSequenceNumbers.map((e) => (
								<div key={e} className="text-3xl">
									{e}
								</div>
							))}
					</div>
					{stack && (
						<Stack
							className="w-72 mt-6 flex justify-center"
							stack={stack}
						/>
					)}
				</div>
				<div>
					{result ? (
						<div
							className={
								'text-4xl ' +
								(result === 'accepted'
									? 'text-green-500'
									: 'text-red-500')
							}
						>
							{result.toUpperCase()}
						</div>
					) : isStarted ? (
						<h1 className="text-5xl">{cleanedInput.split('')}</h1>
					) : (
						<div className="flex">
							<input
								className="h-12 w-72 border border-black rounded-lg p-4 text-black font-medium focus:outline-none"
								placeholder="Enter input here..."
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
							/>
						</div>
					)}
				</div>
				<div>
					<button
						hidden={isStarted}
						disabled={isStarted}
						className="border bg-blue-500 text-white rounded-lg px-4 py-2 font-medium focus:outline-none"
						onClick={() => {
							setIsStarted(true);
							analyze();
						}}
					>
						Start
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-8">
				<FileInput
					isStarted={false}
					file={file}
					setFile={setFile}
					allowedFileTypes={new Set(['text/csv'])}
				/>

				<Table
					isStarted={isStarted}
					values={matrix}
					dispatch={dispatch}
					currentCell={currentCell}
				/>
			</div>
		</div>
	);
}

export default App;
