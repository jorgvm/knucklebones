/**
 * Helper function to wait for a specific amount of time
 */
export const waitFor = async (time: number) => {
  return new Promise((res) => setTimeout(res, time));
};
