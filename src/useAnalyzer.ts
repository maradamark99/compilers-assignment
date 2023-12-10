import { useEffect, useRef, useState } from "react";
import { extractSymbols } from "./util";

export type CurrentCell = { row: number, column: number };

export function useAnalyzer(
    matrix: string[][],
    input: string,
    stack: string[],
    setStack: React.Dispatch<React.SetStateAction<string[]>>
) {
    const { endSymbol, terminalSymbols, nonTerminalSymbols } = extractSymbols(matrix);
    const [cleanedInput, setCleanedInput] = useState(input + "#");
    const [currentCell, setCurrentCell] = useState<CurrentCell>({ row: 0, column: 0 }); 
    const [result, setResult] = useState<"rejected" | "accepted" | undefined>();
    const stackRef = useRef(stack);
    let index = 0;

    useEffect(() => {
        stackRef.current = stack;
    }, [stack])


    useEffect(() => {
        setCleanedInput(input
            .replace(/\s/g, '')
            .replace(/[0-9]+/g, 'i') + endSymbol);
    }, [input])


    function analyze() {
        function processInput() {
            const currentChar = cleanedInput[index];
            if (!terminalSymbols?.has(currentChar)) {
                setResult('rejected');
                return;
            }

            const topOfStack = stackRef.current[stackRef.current.length - 1];
            const column = terminalSymbols.get(currentChar);
            const row = nonTerminalSymbols?.get(topOfStack);
            setCurrentCell({ row: row ?? 0, column: column ?? 0 });
            const cell = matrix[row ?? 0][column ?? 0];

            if (cell === 'accepted') {
                setResult('accepted');
                setStack([]);
                setCleanedInput('');
                return;
            }

            if (cell.length < 1) {
                setResult('rejected');
                return;
            }
            setStack(stackRef.current.slice(0, -1));
            const cleanedCell = cell.split(';')[0];
            if (cleanedCell === 'pop') {
                index++;
                setCleanedInput((prev) => prev.slice(1));
            }
            else if(cleanedCell !== 'eps') {
                cleanedCell.split('').reverse().forEach((e) => {
                    setStack((s) => [...s, e]);
                });
            }

            setTimeout(() => {
                processInput();
            }, 1500);
        }
        processInput();
    }

    return { analyze, cleanedInput, currentCell, result };
}