import { DomainError } from "./domain-error.js";

export class OrderNotFoundError extends DomainError {
  statusCode = 404;

  constructor() {
    super("Order not found.");
  }
}
