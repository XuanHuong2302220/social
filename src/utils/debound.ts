export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    return (...args: Parameters<T>): void => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), delay);
    };
  };
  