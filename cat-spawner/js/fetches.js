let baseUrl = "http://localhost:3000";
export async function createNewReward(title, cost, details) {
  const body = {
    title: title,
    cost: cost,
  };
  // details can be any information depending on reward.
  if (details) body[details] = details;
  console.log(`got to fetches.js`, body);

  const res = await fetch(baseUrl + "/projects/create-reward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(res);
  }
  const response = await res.json();
  console.log(`res: `, response);
  return response;
}
