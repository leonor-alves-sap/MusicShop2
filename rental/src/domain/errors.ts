class InsufficientFundsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InsufficientFundsError";
  }
}

class NoStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoStockError";
  }
}

export { InsufficientFundsError, NoStockError };
