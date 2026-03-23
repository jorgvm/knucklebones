import QRCode from "qrcode";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = query.url;

  if (!url || typeof url !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing url parameter",
    });
  }

  const svg = await QRCode.toString(url, { type: "svg" });

  setResponseHeader(event, "Content-Type", "image/svg+xml");
  setResponseHeader(event, "Cache-Control", "public, max-age=3600");

  return svg;
});
