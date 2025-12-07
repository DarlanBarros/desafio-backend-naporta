import { DomainError } from "./domain-error.js";

export class InvalidCredentialError extends DomainError {
  statusCode = 401;

  constructor() {
    super("Invalid credentials.");
  }
}
