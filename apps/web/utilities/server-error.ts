export const serverError = (e: unknown) => {
  let message = "An unknown error occurred";

  if (e instanceof Error && e.message) {
    message = e.message;
  }

  return {
    status: "error",
    message: message,
  };
};
