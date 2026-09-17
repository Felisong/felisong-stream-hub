let baseUrl = "http://localhost:3000";
export async function createNewReward(title, cost, details) {
  const body = {
    title: title,
    cost: cost,
  };
  console.log(`before the fetch`);
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

  return await res.json();
}

// create refundReward fetch here.
export async function refundReward(currentEvent) {
  console.log(`current reward: `, currentEvent);
  const rewardId = currentEvent.reward.id;
  const redemptionId = currentEvent.redemptionId;

  // details can be any information depending on reward.
  const res = await fetch(baseUrl + "/projects/cats/refund-reward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rewardId, redemptionId }),
  });
  if (!res.ok) {
    console.error("error: ", res);
  }
  return await res.json();
}

// send chat message
export async function sendChatMessage(message) {
  console.log(`current message: `, message);
  console.log(`before the fetch`);
  // details can be any information depending on reward.
  const res = await fetch(baseUrl + "/projects/cats/send-chat-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    console.error("error: ", res);
  }
  return await res.json();
}
