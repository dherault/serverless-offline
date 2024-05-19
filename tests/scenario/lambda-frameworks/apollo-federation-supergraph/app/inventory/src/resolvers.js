import data from "./data.js"

export default {
  Product: {
    delivery(product) {
      const delivery = data.deliveries.find(({ id }) => id === product.id)

      if (delivery) {
        return delivery
      }

      throw new Error("Delivery not found.")
    },
  },
}
