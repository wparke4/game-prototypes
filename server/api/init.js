export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const username = body?.username || "jlejuwaan";
  const topic = body?.topic;

  return true;
});
