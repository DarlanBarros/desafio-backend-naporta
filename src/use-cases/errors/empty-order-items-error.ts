export class EmptyOrderItemsError extends Error {
  constructor() {
    super("Você precisa enviar ao menos um item.");
  }
}
