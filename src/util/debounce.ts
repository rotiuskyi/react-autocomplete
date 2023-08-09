const debounce = <Fn extends (...args: any) => any>(timeout: number, fn: Fn) => {
  let params: Parameters<Fn>;
  let timeoutId = 0;

  return (...args: Parameters<Fn>) => {
    params = args;

    if (!!timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = 0;
    }

    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        fn(...params as []);
        timeoutId = 0;
      }, timeout);
    }
  };
}

export default debounce;
