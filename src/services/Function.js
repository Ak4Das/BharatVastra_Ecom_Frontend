import { useNavigate } from "react-router-dom"
import {
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  fetchMe,
  updateCartItemsInUser,
  updateWishlistItemsInUser,
} from "./FetchRequests"

export async function syncUserAndCreateOrder(obj) {
  const navigate = useNavigate()
  try {
    const { userId, productId, setIsError, action, rejectedRequests } = obj
    const createOrder = await fetchCreateOrderByUserId({ userId, navigate })
    const user = await fetchMe({ navigate })
    if (createOrder?.length && user) {
      const createOrderItems = createOrder[0].products
      const idOfCreateOrderItems = createOrderItems.map((item) => item.id)
      const productsInCart = user.addToCartItems
      const idOfProductsInCart = productsInCart.map((product) => product.id)
      const productsInWishlist = user.addToWishlistItems
      const idOfProductsInWishlist = productsInWishlist.map(
        (product) => product.id,
      )
      const rejectedRequestsName = rejectedRequests.map((req) => req.name)
      if (rejectedRequestsName.includes("user")) {
        const isProductInCreateOrder = idOfCreateOrderItems.find(
          (id) => id === productId,
        )
        if (isProductInCreateOrder) {
          const product = createOrderItems.find((item) => item.id === productId)
          if (action === "cart") {
            const isInCart = idOfProductsInCart.find((id) => id === productId)
            if (isInCart) {
              product.addToCart = true
            } else {
              delete product.addToCart
            }
          }
          if (action === "wishlist") {
            const isInWishlist = idOfProductsInWishlist.find(
              (id) => id === productId,
            )
            if (isInWishlist) {
              product.addToWishList = true
            } else {
              delete product.addToWishList
            }
          }
        }
        const updatedCreateOrder = { products: createOrderItems, userId }
        await fetchCreateOrderByUserIdAndUpdate({
          userId: userId,
          createOrder: updatedCreateOrder,
          setIsError,
          navigate,
        })
      }
      if (rejectedRequestsName.includes("createOrder")) {
        if (action === "cart") {
          const isInCreateOrder = createOrderItems.find(
            (item) => item.id === productId,
          )
          if (!isInCreateOrder.addToCart) {
            const updatedCartItems = productsInCart.filter(
              (product) => product.id !== productId,
            )
            await updateCartItemsInUser({
              items: updatedCartItems,
              setIsError,
              navigate,
            })
          }
        }
        if (action === "wishlist") {
          const isInCreateOrder = createOrderItems.find(
            (item) => item.id === productId,
          )
          if (!isInCreateOrder.addToWishList) {
            const updatedWishlistItems = productsInWishlist.filter(
              (product) => product.id !== productId,
            )
            await updateWishlistItemsInUser({
              items: updatedWishlistItems,
              setIsError,
              navigate,
            })
          }
        }
      }
    }
  } catch (error) {
    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.error(error)
    }
    setIsError(error.message)
  }
}
