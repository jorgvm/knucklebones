/**
 *  Vibrate phone
 */
export const vibrate = (pattern: number | number[] = 200): boolean => {
  if (typeof navigator === "undefined") return false;
  if (!("vibrate" in navigator)) return false;

  return navigator.vibrate(pattern);
};
