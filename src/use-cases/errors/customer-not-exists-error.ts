export class CustomerNotExistsError extends Error {
  constructor() {
    super("Cliente não existente.");
  }
}
