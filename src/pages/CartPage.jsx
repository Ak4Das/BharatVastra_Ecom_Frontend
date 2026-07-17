import { useState, useEffect, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import styles from "../style_modules/pages_modules/CartPage.module.css"
import Header from "../components/Header"
import SearchInPage from "../components/SearchInPage"
import CartPageShimmer from "../shimmers/CartPage.shimmer.jsx"
import Footer from "../components/Footer.jsx"
import Error from "../components/Error.jsx"
import GetUser from "../services/GetClothsData"
import { syncUserAndCreateOrder } from "../services/Function.js"
import {
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  updateWishlistItemsInUser,
  updateCartItemsInUser,
  saveCreateOrder,
  fetchClothById,
} from "../services/FetchRequests.js"

export default function CartPage() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const [search, setSearch] = useState("")
  const [isUpdated, setUpdated] = useState(false)
  const [isRemoveFromCart, setIsRemoveFromCart] = useState(false)
  const [isOrderConfirmed, setConfirmOrder] = useState(false)
  const navigate = useNavigate()

  const { user, setUser } = GetUser()
  const userId = user._id

  const [createOrderInDatabase, setCreateOrderInDatabase] = useState(null)
  const [productsInCart, setProductsInCart] = useState([])
  const [permission, setPermission] = useState("")
  const [data, setData] = useState([])

  const [disableCartBtnId, setDisableCartBtnId] = useState(null)
  const [disableWishlistBtnId, setDisableWishlistBtnId] = useState(null)
  const [disableQuantityBtnId, setDisableQuantityBtnId] = useState(null)

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        if (userId) {
          await fetchCreateOrderByUserId({
            userId,
            setFunction: setCreateOrderInDatabase,
            setIsError,
            navigate,
          })

          if (user?.addToCartItems) {
            const addToCartItemsId = user.addToCartItems.map((item) => item.id)
            const addToCartItems = await Promise.all(
              addToCartItemsId.map((id) =>
                fetchClothById({
                  clothId: id,
                  setIsError,
                  navigate,
                }),
              ),
            )
            setProductsInCart(addToCartItems)
          }
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isUpdated, userId])

  const finalClothsData = useMemo(() => {
    return productsInCart.map((cloth) => {
      const cartItem = user?.addToCartItems?.find(
        (item) => item.id === cloth.id,
      )

      if (cartItem) {
        cloth.addToCart = true
        cloth.quantity = cartItem.quantity ? cartItem.quantity : 1
        cloth.size = cartItem.size ? cartItem.size : ""
      } else {
        delete cloth.addToCart
      }

      const isWishlist = user?.addToWishlistItems?.some(
        (item) => item.id === cloth.id,
      )
      if (isWishlist) {
        cloth.addToWishList = true
      } else {
        delete cloth.addToWishList
      }

      return cloth
    })
  }, [productsInCart, user])

  const uniqueCreateOrderInDatabase = useMemo(() => {
    if (!createOrderInDatabase?.[0]?.products) return []
    return createOrderInDatabase[0].products.reduce((acc, item) => {
      if (!acc.some((obj) => obj.id === item.id)) {
        acc.push(item)
      }
      return acc
    }, [])
  }, [createOrderInDatabase])

  const formattedCreateOrder = useMemo(
    () => ({
      item: uniqueCreateOrderInDatabase,
    }),
    [uniqueCreateOrderInDatabase],
  )

  useEffect(() => {
    async function updateItems() {
      if (!data.length || !createOrderInDatabase) return
      try {
        const createOrderPayload = { products: data, userId }
        if (createOrderInDatabase.length) {
          await fetchCreateOrderByUserIdAndUpdate({
            userId,
            createOrder: createOrderPayload,
            setIsError,
            navigate,
          })
        } else {
          await saveCreateOrder({
            createOrder: createOrderPayload,
            setIsError,
            navigate,
          })
        }
        setUpdated(true)
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }
    updateItems()
  }, [data])

  useEffect(() => {
    if (
      isRemoveFromCart ||
      !createOrderInDatabase ||
      !formattedCreateOrder.item
    ) {
      return
    }

    const idOfProductsInCart = productsInCart.map((product) => product.id)
    const idOfCreateOrderInDatabase = formattedCreateOrder.item.map(
      (product) => product.id,
    )

    if (formattedCreateOrder.item.length) {
      const pass = idOfCreateOrderInDatabase.every((id) =>
        idOfProductsInCart.includes(id),
      )
      const lengthMismatch =
        idOfProductsInCart.length !== idOfCreateOrderInDatabase.length

      if (
        (!pass || lengthMismatch) &&
        permission === "" &&
        productsInCart.length
      ) {
        setPermission("allow")
        setData(productsInCart)
      }
    } else if (permission === "" && productsInCart.length) {
      setPermission("allow")
      setData(productsInCart)
    }
  }, [
    isRemoveFromCart,
    createOrderInDatabase,
    formattedCreateOrder,
    productsInCart,
    permission,
  ])

  useEffect(() => {
    if (isUpdated) {
      setIsRemoveFromCart(false)
      setUpdated(false)
    }
  }, [isUpdated])

  const ProductsInCart =
    user && productsInCart.length && formattedCreateOrder.item
      ? formattedCreateOrder.item
      : []

  const totalOrder = useMemo(() => {
    if (!ProductsInCart) return 0
    return ProductsInCart.reduce((acc, curr) => {
      const discountPercentage = Number(curr.offer.replace("%", ""))
        ? Number(curr.offer.replace("%", ""))
        : Number(curr.discount.replace("%", ""))
      const structuralCost =
        curr.price - (curr.price / 100) * discountPercentage
      const quantityModifier = curr.quantity ? curr.quantity : 1
      return acc + structuralCost * quantityModifier
    }, 0)
  }, [ProductsInCart])

  const deliveryCharge = useMemo(() => {
    if (!ProductsInCart || !ProductsInCart.length) return 0
    const aggregateDeliveryCharges = ProductsInCart.reduce(
      (acc, curr) => acc + (curr.deliveryCharge || 0),
      0,
    )
    return Math.round(aggregateDeliveryCharges / ProductsInCart.length)
  }, [ProductsInCart])

  async function moveToWishlist(e) {
    try {
      e.preventDefault()
      e.stopPropagation()

      const targetProductId = Number(e.target.value)
      const isAlreadyInWishlist = user.addToWishlistItems.some(
        (item) => item.id === targetProductId,
      )

      if (isAlreadyInWishlist) return

      setDisableWishlistBtnId(e.target.value)

      const promises = []

      const updatedWishlist = [
        ...user.addToWishlistItems,
        { id: targetProductId },
      ]

      promises.push({
        name: "user",
        request: updateWishlistItemsInUser({
          items: updatedWishlist,
          setIsError,
          navigate,
        }),
      })

      setUser({ ...user, addToWishlistItems: updatedWishlist })

      const matchedClothsItem = finalClothsData.find(
        (product) => product.id === targetProductId,
      )
      if (matchedClothsItem) {
        matchedClothsItem.addToWishList = true
      }

      if (formattedCreateOrder.item?.length) {
        const structuralItem = formattedCreateOrder.item.find(
          (product) => product.id === targetProductId,
        )
        if (structuralItem) {
          structuralItem.addToWishList = true
        }

        const createOrderPayload = {
          products: formattedCreateOrder.item,
          userId,
        }

        promises.push({
          name: "createOrder",
          request: fetchCreateOrderByUserIdAndUpdate({
            userId,
            createOrder: createOrderPayload,
            setIsError,
            navigate,
          }),
        })
      }

      const results = await Promise.all(promises.map((p) => p.request))
      const indexOfRejectedPromises = []

      results.forEach((res, index) => {
        if (res === undefined) {
          indexOfRejectedPromises.push(index)
        }
      })

      if (indexOfRejectedPromises.length > 0) {
        const rejectedRequests = indexOfRejectedPromises.map(
          (index) => promises[index],
        )
        if (userId) {
          await syncUserAndCreateOrder({
            userId,
            productId: targetProductId,
            setIsError,
            action: "wishlist",
            rejectedRequests,
          })
        }
      } else {
        const btn = e.target
        btn.innerHTML = '<i class="bi bi-check2"></i>'
        btn.style.backgroundColor = "#05a058"
        btn.style.color = "white"

        setTimeout(() => {
          btn.innerHTML = "Added To Wishlist"
          btn.style.backgroundColor = ""
          btn.style.color = ""
        }, 1000)

        setUpdated(true)
        toast.success("Product added to wishlist😊")
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setDisableWishlistBtnId(null)
    }
  }

  const selectSizeFunction = async (e, product, size) => {
    try {
      e.preventDefault()
      e.stopPropagation()

      product.size = size
      const createOrder = {
        products: ProductsInCart,
        userId,
      }
      await fetchCreateOrderByUserIdAndUpdate({
        userId,
        createOrder,
        setIsError,
        navigate,
      })

      const cloth = finalClothsData.find((cloth) => cloth.id === product.id)
      cloth.size = size

      const clothItem = user.addToCartItems.find(
        (item) => item.id === product.id,
      )
      clothItem.size = size
      await updateCartItemsInUser({
        items: user.addToCartItems,
        setIsError,
        navigate,
      })

      setUpdated(true)

      const btn = e.target
      btn.innerHTML = '<i class="bi bi-check2"></i>'
      setTimeout(() => {
        btn.innerHTML = size
        btn.style.backgroundColor = "green"
        btn.style.color = "white"
        const parentElement = btn.parentElement
        const siblings = parentElement.children
        const arrayOfSiblings = [...siblings]
        arrayOfSiblings.forEach((sibling) => {
          if (sibling !== btn) {
            sibling.style.backgroundColor = ""
            sibling.style.color = ""
          }
        })
      }, 500)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  const removeFromCart = async (e, product) => {
    try {
      // To stop Event Bubbling
      e.preventDefault()
      e.stopPropagation()

      setDisableCartBtnId(e.target.value)

      // Update finalClothsData in memory
      const item = finalClothsData.find((Product) => Product.id === product.id)
      if (item) {
        item.addToCart = false
        delete item.quantity
        delete item.size
      }

      // Update user in Database
      const remainingCartItems = user.addToCartItems.filter(
        (item) => item.id !== product.id,
      )
      await updateCartItemsInUser({
        items: remainingCartItems,
        setIsError,
        navigate,
      })
      setUser({ ...user, addToCartItems: remainingCartItems })

      // Update createOrder
      const remainingCreateOrderItems = formattedCreateOrder.item.filter(
        (item) => item.id !== product.id,
      )
      const createOrder = {
        products: remainingCreateOrderItems,
        userId,
      }
      await fetchCreateOrderByUserIdAndUpdate({
        userId,
        createOrder,
        setIsError,
        navigate,
      })

      setIsRemoveFromCart(true)
      setUpdated(true)

      toast.success("Product remove from cart")
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setDisableCartBtnId(null)
    }
  }

  const proceedToOrder = async (e) => {
    try {
      e.preventDefault()
      e.stopPropagation()
      const createOrder = {
        products: formattedCreateOrder.item,
        userId,
      }
      await fetchCreateOrderByUserIdAndUpdate({
        userId,
        createOrder,
        setIsError,
        navigate,
      })
      setConfirmOrder(true)
      setUpdated(true)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  if (isError) {
    return <Error />
  }

  if (!Object.keys(user).length) {
    return
  }

  return (
    <>
      <Header
        position="static"
        top="auto"
        zIndex="auto"
        setSearch={setSearch}
        placeHolder="Search Product"
        page="cartPage"
        userDetails={user}
        search={search}
      />
      <SearchInPage
        margin="ms-3"
        setSearch={setSearch}
        page="cartPage"
        placeHolder="Search Product"
        search={search}
      />
      {loading ? (
        <CartPageShimmer />
      ) : (
        <main className="bg-body-secondary pb-3">
          <div className="container">
            <h3 className="py-4 text-center">My Cart</h3>
            <div
              className={`d-md-flex justify-content-between align-items-start ${styles.cartContainer}`}
            >
              <section className={`${styles.productsInCurt}`}>
                {!!ProductsInCart &&
                  ProductsInCart.map((product) => {
                    return (
                      <div key={product.id} className="row mb-3">
                        <div className="col-sm-12 col-md-12 mb-3">
                          <Link
                            className="text-decoration-none"
                            to={`/productDetails/${product.id}`}
                          >
                            <div
                              className={`card flex-lg-row gap-4 ${styles.productCardInCart} m-auto`}
                            >
                              <img
                                src={product.url}
                                alt="productImage"
                                className={`${styles.imageOnProductCurt}`}
                              />
                              <div className="card-body d-flex flex-column justify-content-between pt-0 pt-lg-2">
                                <div>
                                  <p
                                    className={`lh-sm fs-5 fw-bold m-0 mb-2 ${styles.productNameOnCartPage} overflow-hidden`}
                                  >
                                    {product.name.length > 61
                                      ? product.name.slice(0, 60).concat("...")
                                      : product.name}
                                  </p>
                                  <div>
                                    <span className="fw-bold fs-5">
                                      ₹
                                      {Math.round(
                                        product.price -
                                          (product.price *
                                            (Number(
                                              product.offer.replace("%", ""),
                                            )
                                              ? Number(
                                                  product.offer.replace(
                                                    "%",
                                                    "",
                                                  ),
                                                )
                                              : Number(
                                                  product.discount.replace(
                                                    "%",
                                                    "",
                                                  ),
                                                ))) /
                                            100,
                                      )}
                                    </span>
                                    <span className="text-decoration-line-through ms-2">
                                      ₹{product.price}
                                    </span>
                                  </div>
                                  <p className="fw-bold fs-5 text-body-tertiary">
                                    {Number(product.offer.replace("%", ""))
                                      ? product.offer
                                      : product.discount}{" "}
                                    off
                                  </p>
                                  <div className="mb-2">
                                    <span
                                      className={`fw-bold me-2 ${styles.quantityText}`}
                                    >
                                      Quantity:{" "}
                                    </span>
                                    <div
                                      className={`${styles.quantityBtnContainer} mb-3`}
                                    >
                                      <button
                                        className="rounded-circle border border-1"
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                        }}
                                        onClick={async (e) => {
                                          try {
                                            // To stop Event Bubbling
                                            e.preventDefault()
                                            e.stopPropagation()

                                            setDisableQuantityBtnId(product.id)

                                            let inputElementValue = Number(
                                              e.target.nextElementSibling.value,
                                            )
                                            if (inputElementValue > 1) {
                                              // Update the input element value
                                              e.target.nextElementSibling.value =
                                                --inputElementValue

                                              // Update createOrder in Database
                                              product.quantity = Number(
                                                e.target.nextElementSibling
                                                  .value,
                                              )
                                              const createOrder = {
                                                products: ProductsInCart,
                                                userId,
                                              }
                                              await fetchCreateOrderByUserIdAndUpdate(
                                                {
                                                  userId,
                                                  createOrder,
                                                  setIsError,
                                                  navigate,
                                                },
                                              )

                                              // Update user in Database
                                              const clothItem =
                                                user.addToCartItems.find(
                                                  (item) =>
                                                    item.id === product.id,
                                                )
                                              clothItem.quantity = Number(
                                                e.target.nextElementSibling
                                                  .value,
                                              )
                                              await updateCartItemsInUser({
                                                items: user.addToCartItems,
                                                setIsError,
                                                navigate,
                                              })

                                              // Update finalClothsData in memory
                                              const cloth =
                                                finalClothsData.find(
                                                  (cloth) =>
                                                    cloth.id === product.id,
                                                )
                                              cloth.quantity = Number(
                                                e.target.nextElementSibling
                                                  .value,
                                              )

                                              // To update the variables present in this page
                                              setUpdated(true)
                                            }
                                          } catch (error) {
                                            if (
                                              import.meta.env.VITE_MODE ===
                                              "DEVELOPMENT"
                                            ) {
                                              console.error(error)
                                            }
                                            setIsError(error.message)
                                          } finally {
                                            setDisableQuantityBtnId(null)
                                          }
                                        }}
                                        disabled={
                                          disableQuantityBtnId === product.id
                                        }
                                      >
                                        {" "}
                                        -{" "}
                                      </button>
                                      <input
                                        type="text"
                                        defaultValue={product.quantity || 1}
                                        style={{
                                          width: "30px",
                                          textAlign: "center",
                                        }}
                                        className="mx-2"
                                        onChange={(e) => {
                                          if (Number(e.target.value) >= 0) {
                                            product.quantity = Number(
                                              e.target.value,
                                            )
                                            setUpdated(true)
                                          }
                                        }}
                                      />
                                      <button
                                        className="rounded-circle border border-1"
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                        }}
                                        onClick={async (e) => {
                                          try {
                                            // To stop Event Bubbling
                                            e.preventDefault()
                                            e.stopPropagation()

                                            setDisableQuantityBtnId(product.id)

                                            // Update the input element value
                                            let inputElementValue = Number(
                                              e.target.previousElementSibling
                                                .value,
                                            )
                                            e.target.previousElementSibling.value =
                                              ++inputElementValue

                                            // Update createOrder in Database
                                            product.quantity = Number(
                                              e.target.previousElementSibling
                                                .value,
                                            )
                                            const createOrder = {
                                              products: ProductsInCart,
                                              userId,
                                            }
                                            await fetchCreateOrderByUserIdAndUpdate(
                                              {
                                                userId,
                                                createOrder,
                                                setIsError,
                                                navigate,
                                              },
                                            )

                                            // Update user in Database
                                            const clothItem =
                                              user.addToCartItems.find(
                                                (item) =>
                                                  item.id === product.id,
                                              )
                                            clothItem.quantity = Number(
                                              e.target.previousElementSibling
                                                .value,
                                            )
                                            await updateCartItemsInUser({
                                              items: user.addToCartItems,
                                              setIsError,
                                              navigate,
                                            })

                                            // Update finalClothsData in memory
                                            const cloth = finalClothsData.find(
                                              (cloth) =>
                                                cloth.id === product.id,
                                            )
                                            cloth.quantity = Number(
                                              e.target.previousElementSibling
                                                .value,
                                            )

                                            // To update the variables present in this page
                                            setUpdated(true)
                                          } catch (error) {
                                            if (
                                              import.meta.env.VITE_MODE ===
                                              "DEVELOPMENT"
                                            ) {
                                              console.error(error)
                                            }
                                            setIsError(error.message)
                                          } finally {
                                            setDisableQuantityBtnId(null)
                                          }
                                        }}
                                        disabled={
                                          disableQuantityBtnId === product.id
                                        }
                                      >
                                        {" "}
                                        +{" "}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mb-2">
                                    <span
                                      className={`${styles.sizeText} fw-bold me-1 me-xl-3`}
                                    >
                                      Size:{" "}
                                    </span>
                                    <div
                                      className={`${styles.sizeBtnContainer}`}
                                    >
                                      <button
                                        className="border border-1 me-2 mb-2"
                                        style={{
                                          backgroundColor:
                                            product.size === "S" ? "green" : "",
                                          color:
                                            product.size === "S" ? "white" : "",
                                        }}
                                        onClick={(e) =>
                                          selectSizeFunction(e, product, "S")
                                        }
                                      >
                                        S
                                      </button>
                                      <button
                                        className="border border-1 me-2 mb-2"
                                        style={{
                                          backgroundColor:
                                            product.size === "M" ? "green" : "",
                                          color:
                                            product.size === "M" ? "white" : "",
                                        }}
                                        onClick={(e) =>
                                          selectSizeFunction(e, product, "M")
                                        }
                                      >
                                        M
                                      </button>
                                      <button
                                        className="border border-1 me-2 mb-2"
                                        style={{
                                          backgroundColor:
                                            product.size === "L" ? "green" : "",
                                          color:
                                            product.size === "L" ? "white" : "",
                                        }}
                                        onClick={(e) =>
                                          selectSizeFunction(e, product, "L")
                                        }
                                      >
                                        L
                                      </button>
                                      <button
                                        className="border border-1 me-2 mb-2"
                                        style={{
                                          backgroundColor:
                                            product.size === "XL"
                                              ? "green"
                                              : "",
                                          color:
                                            product.size === "XL"
                                              ? "white"
                                              : "",
                                        }}
                                        onClick={(e) =>
                                          selectSizeFunction(e, product, "XL")
                                        }
                                      >
                                        XL
                                      </button>
                                      <button
                                        className="border border-1 mb-2"
                                        style={{
                                          backgroundColor:
                                            product.size === "XXL"
                                              ? "green"
                                              : "",
                                          color:
                                            product.size === "XXL"
                                              ? "white"
                                              : "",
                                        }}
                                        onClick={(e) =>
                                          selectSizeFunction(e, product, "XXL")
                                        }
                                      >
                                        XXL
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <button
                                    className="btn btn-secondary w-100 my-2"
                                    value={product.id}
                                    onClick={(e) => removeFromCart(e, product)}
                                    disabled={
                                      product.id === Number(disableCartBtnId)
                                    }
                                  >
                                    Remove From Cart
                                  </button>
                                  <button
                                    className="btn btn-outline-secondary w-100"
                                    value={product.id}
                                    onClick={moveToWishlist}
                                    disabled={
                                      product.id ===
                                      Number(disableWishlistBtnId)
                                    }
                                  >
                                    {product.addToWishList
                                      ? "Added To Wishlist"
                                      : "Move To Wishlist"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
              </section>
              <section className={`bg-light px-5 py-4 ${styles.totalBill}`}>
                <h3>Price Details</h3>
                <hr />
                <div>
                  <div className="my-3">
                    <p className="d-inline-block w-50 m-0">Price</p>
                    <p className="d-inline-block w-50 text-end m-0">
                      ₹{Math.round(totalOrder)}
                    </p>
                  </div>
                  <div className="my-3">
                    <p className="d-inline-block w-50 m-0">Delivery Charges</p>
                    <p className="d-inline-block w-50 text-end m-0">
                      ₹{deliveryCharge ? Math.round(deliveryCharge) : 0}
                    </p>
                  </div>
                </div>
                <hr />
                <div>
                  <p className="d-inline-block w-50 m-0">Total Amount</p>
                  <p className="d-inline-block w-50 text-end m-0">
                    ₹
                    {totalOrder && deliveryCharge
                      ? Math.round(totalOrder + deliveryCharge)
                      : 0}
                  </p>
                </div>
                <br />
                {!isOrderConfirmed && user && ProductsInCart.length > 0 && (
                  <button
                    className="btn btn-warning w-100 my-2"
                    onClick={(e) => proceedToOrder(e)}
                  >
                    Proceed to Order
                  </button>
                )}
                {isOrderConfirmed && !user && (
                  <button
                    className="btn btn-primary w-100 my-2"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toast.info("Please login to your account")
                    }}
                  >
                    Place Order
                  </button>
                )}
                {isOrderConfirmed && user && !user.address.length && (
                  <button
                    className="btn btn-primary w-100 my-2"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toast.info("Please add your address")
                    }}
                  >
                    Place Order
                  </button>
                )}
                {isOrderConfirmed && user && user.address.length !== 0 && (
                  <div>
                    {ProductsInCart &&
                    formattedCreateOrder.item.filter((product) => product.size)
                      .length === formattedCreateOrder.item.length ? (
                      <Link
                        to="/paymentMethods"
                        className="btn btn-primary w-100"
                      >
                        Place Order
                      </Link>
                    ) : (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() =>
                          ProductsInCart
                            ? toast.info(
                                "Please select size of all the products present in the cart",
                              )
                            : toast.error("There is no item in cart")
                        }
                      >
                        Place Order
                      </button>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </>
  )
}
