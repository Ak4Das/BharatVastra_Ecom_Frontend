import {
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  fetchUserById,
} from "./FetchRequests"

export async function syncUserAndCreateOrder(userId, setIsError) {
  try {
    const createOrder = await fetchCreateOrderByUserId(userId)
    const user = await fetchUserById(userId)
    if (createOrder?.length && user) {
      const createOrderItems = createOrder[0].products
      const productsInCart = user.addToCartItems
      const idOfProductsInCart = productsInCart.map((product) => product.id)
      const productsInWishlist = user.addToWishlistItems
      const idOfProductsInWishlist = productsInWishlist.map(
        (product) => product.id,
      )
      const updatedCreateOrderItems = createOrderItems.map((item) => {
        const isInCart = idOfProductsInCart.find((id) => item.id === id)
        if (isInCart) {
          item.addToCart = true
        } else {
          delete item.addToCart
        }
        const isInWishlist = idOfProductsInWishlist.find((id) => item.id === id)
        if (isInWishlist) {
          item.addToWishList = true
        } else {
          delete item.addToWishList
        }
        return item
      })
      const updatedCreateOrder = { products: updatedCreateOrderItems, userId }
      await fetchCreateOrderByUserIdAndUpdate(
        userId,
        updatedCreateOrder,
        undefined,
        setIsError,
      )
    }
  } catch (error) {
    console.error(error)
    setIsError(error.message)
  }
}
