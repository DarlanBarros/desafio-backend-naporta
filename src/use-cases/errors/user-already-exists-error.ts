import { DomainError } from "./domain-error.js";

export class UserAlreadyExistsError extends DomainError {
  statusCode = 409;

  constructor() {
    super("Email already exists.");
  }
}
