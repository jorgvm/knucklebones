export const serverError = (e: unknown): void => {
  let message = "An unknown error occurred";

  if (e instanceof Error && e.message) {
    message = e.message;
  }

  return {
    status: "error",
    message: message,
  };
};
//todo
