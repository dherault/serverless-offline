function reply(functionKey) {
  return {
    body: JSON.stringify({ functionKey }),
    headers: {
      "Content-Type": "application/json",
    },
    statusCode: 200,
  }
}

export async function createOrder() {
  return reply("createOrder")
}

export async function cancelOrder() {
  return reply("cancelOrder")
}

export async function archivedBasket() {
  return reply("archivedBasket")
}

export async function basket() {
  return reply("basket")
}
