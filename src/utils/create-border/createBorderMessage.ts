export function createBorderedMessage(lines: string[]): string {
    const maxLength = Math.max(...lines.map(line => line.length));
    const border = '─'.repeat(maxLength + 2);
  
    const borderedLines = lines.map(line => `│ ${line.padEnd(maxLength)} │`);
    return [
      `┌${border}┐`,
      ...borderedLines,
      `└${border}┘`,
    ].join('\n');
  }
  