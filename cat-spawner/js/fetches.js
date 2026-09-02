let baseUrl = "http://localhost:3000";
export async function createNewReward(title, cost, details) {
  const body = {
    title: title,
    cost: cost,
  };
  // details can be any information depending on reward.
  if (details) body[details] = details;
  console.log(`got to fetches.js`, body);

  const res = await fetch(baseUrl + "/projects/cats/create-reward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(res);
  }

  return await res.json();;
}

// create refundReward fetch here.
export async function refundReward(rewardId) {
  // details can be any information depending on reward.
  const res = await fetch(baseUrl + "/projects/cats/refund-reward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rewardId),
  });
  if (!res.ok) {
    console.error(res);
  }
  console.log(`res: `, response);
  return await res.json();
}
