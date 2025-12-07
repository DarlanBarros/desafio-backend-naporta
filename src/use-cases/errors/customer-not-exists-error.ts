import { DomainError } from "./domain-error.js";

export class CustomerNotExistsError extends DomainError {
  statusCode = 404;

  constructor() {
    super("Customer not found.");
  }
}
