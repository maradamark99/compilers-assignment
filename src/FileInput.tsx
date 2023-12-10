import { useRef } from 'react';

export function FileInput({
	isStarted,
	file,
	allowedFileTypes,
	setFile,
}: {
	isStarted: boolean;
	file: File | undefined;
	allowedFileTypes: Set<String>;
	setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	async function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			const file = e.target.files[0];
			if (!allowedFileTypes.has(file.type)) {
				alert('Allowed types: ' + [...allowedFileTypes].join(', '));
				return;
			}
			setFile(file);
		}
	}

	return (
		<div className="flex justify-center">
			<input
				ref={inputRef}
				hidden={isStarted}
				disabled={isStarted}
				type="file"
				onChange={handleOnChange}
			/>
			{file && (
				<svg
					onClick={() => {
						inputRef.current!.value = '';
						setFile(undefined);
					}}
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-5 h-5 cursor-pointer"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			)}
		</div>
	);
}
