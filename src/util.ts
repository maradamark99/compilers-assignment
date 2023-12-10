
export function extractSymbols(matrix: string[][]) {
  const startSymbol = matrix[1][0];
  const endSymbol = matrix[0][matrix[0].length - 1];

  const terminalSymbols = new Map(
    matrix[0]
      .filter((e) => e !== '')
      .map((e, i) => [e, i + 1])
  );

  const nonTerminalSymbols = new Map(
    matrix.map((e) => e[0])
      .filter((e) => e !== '')
      .map((e, i) => [e, i + 1])
  );

  return {
    startSymbol,
    endSymbol,
    terminalSymbols,
    nonTerminalSymbols,
  };
}

export async function readContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result?.toString() || '';
      resolve(text);
    };

    reader.onerror = () => {
      reject(new Error('An error occured, while reading the file'));
    };

    reader.readAsText(file);
  });
}

export function parseCSV(text: string): string[][] {
  return text
    .split('\n')
    .map((e) => e.split(','));
}

