export async function createNewReward(title, cost, details) {
  const body = {
    title: title,
    cost: cost,
  };
  if (details) body[details] = details;

  const res = await fetch("http://localhost:3000/create-reward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  });
  return res.json();
}
