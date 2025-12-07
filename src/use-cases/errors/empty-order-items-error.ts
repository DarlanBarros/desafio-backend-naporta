import { DomainError } from "./domain-error.js";

export class EmptyOrderItemsError extends DomainError {
  statusCode = 400;

  constructor() {
    super("The order must contain at least one item.");
  }
}
