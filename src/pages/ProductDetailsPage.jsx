import styles from "../style_modules/pages_modules/ProductDetails.module.css"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import Header from "../components/Header"
import Footer from "../components/Footer.jsx"
import RatingBar from "../components/RatingBar"
import SearchInPage from "../components/SearchInPage"
import ProductDetailsShimmer from "../shimmers/ProductDetails.shimmer.jsx"
import Error from "../components/Error.jsx"
import { images } from "../assets/images/images.js"

import {
  updateClothById,
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  updateCartItemsInUser,
  updateWishlistItemsInUser,
  saveCreateOrder,
  fetchClothById,
} from "../services/FetchRequests.js"
import GetUser from "../services/GetClothsData"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function ProductDetailsPage() {
  // Refs for DOM Interactions
  const compareContainerRef = useRef(null)
  const qtyInputRef = useRef(null)
  const cbBought2Ref = useRef(null)
  const cbBought3Ref = useRef(null)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const [search, setSearch] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState("")
  const [isUpdated, setUpdated] = useState(false)
  const [time, setTime] = useState("")
  const [isFreeDeliveryAvailable, setFreeDelivery] = useState(false)
  const [expand, setExpand] = useState(false)
  const [showTable1, setShowTable1] = useState(false)
  const [showTable2, setShowTable2] = useState(false)
  const [showTable3, setShowTable3] = useState(false)
  const [showTable4, setShowTable4] = useState(false)
  const [checkBox1Clicked, setCheckBox1Clicked] = useState(false)
  const [checkBox2Clicked, setCheckBox2Clicked] = useState(false)
  const [returnAndExchangePopover, setReturnAndExchangePopover] =
    useState(false)
  const [freeDeliveryPopover, setFreeDeliveryPopover] = useState(false)
  const [payOnDeliveryPopover, setPayOnDeliveryPopover] = useState(false)
  const [secureTransactionPopover, setSecureTransactionPopover] =
    useState(false)
  const [knowMore, setKnowMore] = useState(false)
  const [rawProduct, setRawProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])

  const { id: paramId } = useParams()
  const id = Number(paramId)
  const { user, setUser } = GetUser()
  console.log(user)
  const userId = user._id
  const userExists = user && Object.keys(user).length > 0

  const [createOrderData, setCreateOrderData] = useState(null)

  const camelCaseToTitle = (camelCase) => {
    const wordsArray = []
    const arrayOfLetters = camelCase.split("")
    arrayOfLetters[0] = arrayOfLetters[0].toUpperCase()
    let firstIndex = 0
    let lastIndex = 0

    arrayOfLetters.forEach((letter) => {
      if (letter.toUpperCase() === letter) {
        const word = arrayOfLetters.slice(firstIndex, lastIndex).join("")
        wordsArray.push(word)
        firstIndex = lastIndex
      }
      lastIndex++
    })
    const lastWord = arrayOfLetters.slice(firstIndex).join("")
    wordsArray.push(lastWord)
    return wordsArray.join(" ").trim()
  }

  const setDeliveryDate = () => {
    const today = new Date()
    today.setDate(today.getDate() + 10)
    return `${today.getDate()} ${MONTHS[today.getMonth()]} ${today.getFullYear()}`
  }

  const getFinalClothsData = (clothsData) => {
    if (!userExists) return clothsData
    return clothsData.map((cloth) => {
      const clothCopy = { ...cloth }

      const cartItem = user.addToCartItems?.find(
        (item) => item.id === clothCopy.id,
      )

      if (cartItem) {
        clothCopy.addToCart = true
        clothCopy.quantity = cartItem.quantity || 1
        clothCopy.size = cartItem.size || ""
      } else {
        delete clothCopy.addToCart
      }

      const wishlistItem = user.addToWishlistItems.find(
        (item) => item.id === clothCopy.id,
      )
      if (wishlistItem) {
        clothCopy.addToWishList = true
      } else {
        delete clothCopy.addToWishList
      }
      return clothCopy
    })
  }

  const product = useMemo(() => {
    if (!rawProduct) return null
    const computedProduct = { ...rawProduct }

    if (userExists) {
      const cartItem = user.addToCartItems?.find(
        (item) => item.id === computedProduct.id,
      )
      if (cartItem) {
        computedProduct.addToCart = true
        computedProduct.quantity = cartItem.quantity || 1
        computedProduct.size = cartItem.size || ""
      } else {
        computedProduct.quantity = quantity
        computedProduct.size = size
      }

      const wishItem = user.addToWishlistItems?.find(
        (item) => item.id === computedProduct.id,
      )
      if (wishItem) {
        computedProduct.addToWishList = true
      }
    }
    return computedProduct
  }, [rawProduct, user, quantity, size, userExists])

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    async function fetchCreateOrderData() {
      try {
        if (userId) {
          const result = await fetchCreateOrderByUserId({
            userId,
            setIsError,
            navigate,
          })
          setCreateOrderData(result)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    }
    fetchCreateOrderData()
  }, [userId, isUpdated])

  useEffect(() => {
    async function fetchProductData() {
      try {
        const result = await fetchClothById({
          clothId: id,
          setIsError,
        })
        if (userExists) {
          const finalProduct = getFinalClothsData([result])
          setRawProduct(finalProduct[0])
        } else {
          setRawProduct(result)
        }
        if (result && result.similarProducts) {
          const similarProductIds = result.similarProducts.map((p) => p.id)
          const allSimilarProducts = await Promise.all(
            similarProductIds.map((sid) =>
              fetchClothById({
                clothId: sid,
                setIsError,
                navigate,
              }),
            ),
          )
          if (userExists) {
            const finalSimilarProducts = getFinalClothsData(allSimilarProducts)
            setSimilarProducts(finalSimilarProducts)
          } else {
            setSimilarProducts(allSimilarProducts)
          }
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    }
    fetchProductData()
  }, [id, user])

  useEffect(() => {
    if (cbBought2Ref.current) {
      cbBought2Ref.current.checked = false
    }
    if (cbBought3Ref.current) {
      cbBought3Ref.current.checked = false
    }
  }, [id])

  useEffect(() => {
    async function updateCreateOrderData() {
      try {
        if (product) {
          if (userId) {
            const obj = { products: [product], userId }
            await updateCreateOrder(userId, obj)
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
    updateCreateOrderData()
  }, [product?.id, userId])

  useEffect(() => {
    async function syncChanges() {
      try {
        if (!isUpdated || !product || !userExists) return
        const USER = { ...user }

        const cartItem = USER.addToCartItems?.find(
          (item) => item.id === product.id,
        )

        if (cartItem) {
          if (quantity > 1) {
            cartItem.quantity = quantity
            await updateCartItemsInUser({
              items: USER.addToCartItems,
              setIsError,
              navigate,
            })
            setUser(USER)
            product.quantity = quantity
          }
        } else {
          if (quantity > 1) {
            product.quantity = quantity
          }
        }

        if (size) {
          if (createOrderData && createOrderData[0]) {
            createOrderData[0].products.forEach((item) => (item.size = size))
            product.size = size
            const createOrderObj = {
              products: createOrderData[0].products,
              userId,
            }
            const response = await fetchCreateOrderByUserIdAndUpdate({
              userId: userId,
              createOrder: createOrderObj,
              setIsError,
              navigate,
            })

            setCreateOrderData([response])
          }
        }

        product.freeDelivery = !!isFreeDeliveryAvailable

        if (createOrderData && createOrderData[0]) {
          const filteredItem = createOrderData[0].products.filter(
            (item) => item.id !== product.id,
          )

          filteredItem.forEach((prod) => {
            const cartItem = user.addToCartItems?.find(
              (item) => item.id === prod.id,
            )
            if (cartItem) prod.addToCart = true

            const wishItem = user.addToWishlistItems?.find(
              (item) => item.id === prod.id,
            )
            if (wishItem) prod.addToWishList = true
          })

          filteredItem.push(product)
          const createOrderObj = { products: filteredItem, userId }
          const result = await fetchCreateOrderByUserIdAndUpdate({
            userId: userId,
            createOrder: createOrderObj,
            setIsError,
            navigate,
          })

          setCreateOrderData([result])
        }

        setUpdated(false)
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    }
    userId && syncChanges()
  }, [isUpdated, userId])

  useEffect(() => {
    let timerId = null

    if (product?.freeDelivery) {
      setFreeDelivery(true)
      timerId = setInterval(async () => {
        try {
          const currentTime = new Date()
          const hours = currentTime.getHours()
          const minutes = currentTime.getMinutes()
          const seconds = currentTime.getSeconds()

          setTime(`${23 - hours}:${59 - minutes}:${59 - seconds}`)

          if (hours === 23 && minutes === 59 && seconds === 59) {
            setFreeDelivery(false)
            setUpdated(true)
            const cloth = await fetchClothById({
              clothId: id,
              setIsError,
            })
            cloth.freeDelivery = false
            await updateClothById({
              id: product.id,
              clothData: cloth,
              setIsError,
              navigate,
            })
            clearInterval(timerId)
          }
        } catch (error) {
          if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
            console.error(error)
          }
          setIsError(error.message)
        }
      }, 1000)
    } else {
      setTime("0:0:0")
    }

    return () => {
      if (timerId) clearInterval(timerId)
    }
  }, [product?.freeDelivery, id])

  useEffect(() => {
    setFreeDelivery(false)
  }, [id])

  async function updateCreateOrder(targetId, data) {
    try {
      const response = await fetchCreateOrderByUserId({
        userId,
        setIsError,
        navigate,
      })
      if (response.length) {
        const result = await fetchCreateOrderByUserIdAndUpdate({
          userId: targetId,
          createOrder: data,
          setIsError,
          navigate,
        })

        setCreateOrderData([result])
      } else {
        const result = await saveCreateOrder({
          createOrder: data,
          setIsError,
          navigate,
        })

        setCreateOrderData([result])
      }
      setUpdated(true)
    } catch (error) {
      throw error
    }
  }

  async function increaseCount() {
    try {
      if (!qtyInputRef.current || !userExists) return
      let targetValue = Number(qtyInputRef.current.value) + 1
      qtyInputRef.current.value = targetValue
      const USER = { ...user }

      const clothItem = USER.addToCartItems?.find((item) => item.id === id)
      if (clothItem) {
        clothItem.quantity = targetValue
        await updateCartItemsInUser({
          items: USER.addToCartItems,
          setIsError,
          navigate,
        })
        setUser(USER)
      }

      if (product) product.quantity = targetValue
      setQuantity(targetValue)
      setUpdated(true)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  async function decreaseCount() {
    try {
      if (!qtyInputRef.current || !userExists) return
      let targetValue = Number(qtyInputRef.current.value)

      if (targetValue > 1 && userExists) {
        targetValue--
        qtyInputRef.current.value = targetValue
        const USER = { ...user }

        const clothItem = USER.addToCartItems?.find((item) => item.id === id)
        if (clothItem) {
          clothItem.quantity = targetValue
          await updateCartItemsInUser({
            items: USER.addToCartItems,
            setIsError,
            navigate,
          })
          setUser(USER)
        }

        if (product) product.quantity = targetValue
        setQuantity(targetValue)
        setUpdated(true)
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  async function addToCart(e) {
    try {
      e.preventDefault()
      e.stopPropagation()
      const currentTargetId = Number(e.target.value)
      const USER = { ...user }

      const cartItem = USER.addToCartItems?.find(
        (item) => item.id === currentTargetId,
      )
      if (!cartItem) {
        USER.addToCartItems.push({
          id: currentTargetId,
          quantity: currentTargetId === id ? quantity : 1,
          size: size,
        })
        await updateCartItemsInUser({
          items: USER.addToCartItems,
          setIsError,
          navigate,
        })
        setUser(USER)

        const btn = e.target
        btn.innerHTML = "Added To Cart"
        btn.style.backgroundColor = "#05a058"
        btn.style.color = "white"

        setTimeout(() => {
          btn.innerHTML = "Added To Cart"
          btn.style.backgroundColor = ""
          btn.style.color = ""
        }, 1000)
      }

      setUpdated(true)
      toast.success("Product added to cart😊")
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  async function addToWishlist(e) {
    try {
      e.preventDefault()
      e.stopPropagation()
      const currentTargetId = Number(e.target.value)
      const USER = { ...user }

      const wishItem = USER.addToWishlistItems.find(
        (item) => item.id === currentTargetId,
      )
      if (!wishItem) {
        USER.addToWishlistItems.push({ id: currentTargetId })
        await updateWishlistItemsInUser({
          items: USER.addToWishlistItems,
          setIsError,
          navigate,
        })
        setUser(USER)

        const btn = e.target
        btn.innerHTML = "Added To Wishlist"
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
    }
  }

  async function addToCreateOrderCheckboxHandler(e, productId) {
    try {
      const checked = e.target.checked
      const targetProduct = await fetchClothById({
        clothId: productId,
        setIsError,
      })

      if (!createOrderData || !createOrderData[0]) return
      const isIncluded = createOrderData[0].products.some(
        (item) => item.id === targetProduct.id,
      )

      if (checked) {
        if (!isIncluded) {
          if (size) targetProduct.size = size
          targetProduct.quantity = 1
          createOrderData[0].products.push(targetProduct)
          const createOrderObj = {
            products: createOrderData[0].products,
            userId,
          }
          const result = await fetchCreateOrderByUserIdAndUpdate({
            userId,
            createOrder: createOrderObj,
            setIsError,
            navigate,
          })

          setCreateOrderData([result])
        }
      } else {
        if (isIncluded) {
          const updatedItem = createOrderData[0].products.filter(
            (item) => item.id !== targetProduct.id,
          )
          const createOrderObj = { products: updatedItem, userId }
          const result = await fetchCreateOrderByUserIdAndUpdate({
            userId,
            createOrder: createOrderObj,
            setIsError,
            navigate,
          })

          setCreateOrderData([result])
        }
      }
      setUpdated(true)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  async function handleSize(e, size) {
    try {
      if (userId) {
        setSize(size)

        // Update user in Database
        const USER = { ...user }
        const isClothAddedToCart = USER.addToCartItems?.find(
          (item) => item.id === id,
        )
        if (isClothAddedToCart) {
          isClothAddedToCart.size = size
          await updateCartItemsInUser({
            items: USER.addToCartItems,
            setIsError,
            navigate,
          })
          setUser(USER)
        }

        setUpdated(true)

        // For interactivity
        const btn = e.target
        btn.innerHTML = "✓"
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
      } else {
        toast.info("Please login to your account")
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  function preBtnClicked(e) {
    const element = e.target
    const container = element.parentElement.children[2]
    if (container) {
      const containerWidth = container.getBoundingClientRect().width
      container.scrollLeft += containerWidth
      element.style.opacity = 0
      if (element.nextElementSibling)
        element.nextElementSibling.style.opacity = 1
    }
  }

  function nxtBtnClicked(e) {
    const element = e.target
    const container = element.parentElement.children[2]
    if (container) {
      const containerWidth = container.getBoundingClientRect().width
      container.scrollLeft -= containerWidth
      element.style.opacity = 0
      if (element.previousElementSibling)
        element.previousElementSibling.style.opacity = 1
    }
  }

  function preContentClicked() {
    if (compareContainerRef.current) {
      compareContainerRef.current.scrollLeft -= 210
    }
  }

  function nxtContentClicked() {
    if (compareContainerRef.current) {
      compareContainerRef.current.scrollLeft += 280
    }
  }

  const address =
    userExists &&
    user?.address.length !== 0 &&
    user?.address.find((addr) => addr.selected)

  const additionalInformationKeys = Object.keys(
    product?.productDetails?.additionalInformation || {},
  )

  const itemDetailsKeys = Object.keys(
    product?.productDetails?.itemDetails || {},
  )

  const styleKeys = Object.keys(product?.productDetails?.style || {})

  const topHighlightsKeys = Object.keys(
    product?.productDetails?.topHighlights || {},
  )

  if (isError) {
    return <Error />
  }

  if (!userExists) {
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
        page="productDetails"
        userDetails={user}
        search={search}
      />
      <SearchInPage
        margin="ms-3"
        setSearch={setSearch}
        page="productDetails"
        placeHolder="Search Product"
        search={search}
      />
      {loading || !product || !similarProducts.length ? (
        <ProductDetailsShimmer />
      ) : (
        <main className="bg-body-secondary py-3 px-4 py-sm-5 px-sm-5">
          <div
            className={`bg-light-subtle py-3 px-3 ${styles.productDetailsContainer}`}
          >
            <section
              className={`d-sm-flex gap-sm-4 gap-xl-5 ${styles.productDetailsContainerFirstSection}`}
            >
              <div className={`${styles.productDetailsImage} top-0 start-0`}>
                <img
                  src={product.url}
                  alt="productImage"
                  className={`img-fluid ${styles.productImage}`}
                />
                <div className={`${styles.btnContainer1}`}>
                  {!user && (
                    <button
                      className="btn btn-primary w-100 my-2"
                      onClick={() => toast.info("Please login to your account")}
                    >
                      Buy Now
                    </button>
                  )}
                  {user && !user.address.length && (
                    <button
                      className="btn btn-primary w-100 my-2"
                      onClick={() => toast.info("Please add your address")}
                    >
                      Buy Now
                    </button>
                  )}
                  {user && user.address.length !== 0 && !size && (
                    <button
                      className="btn btn-primary w-100 my-2"
                      onClick={() =>
                        toast.info("Please select the product size")
                      }
                    >
                      Buy Now
                    </button>
                  )}
                  {user && user.address.length !== 0 && size && (
                    <Link
                      to="/paymentMethods"
                      className="btn btn-primary w-100 my-2 text-decoration-none"
                    >
                      Buy Now{" "}
                    </Link>
                  )}
                  <div>
                    {!user ? (
                      <button
                        className="btn btn-secondary w-100 mb-2"
                        onClick={() =>
                          toast.info("Please login to your account")
                        }
                      >
                        {product.addToCart ? "Added To Cart" : "Add To cart"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary w-100 mb-2"
                        value={product.id}
                        onClick={(e) =>
                          userId
                            ? addToCart(e)
                            : toast.info("Please login to your account")
                        }
                      >
                        {product.addToCart ? "Added To Cart" : "Add To cart"}
                      </button>
                    )}
                  </div>
                  <div>
                    {!user ? (
                      <button
                        className="btn btn-outline-secondary w-100 mb-2"
                        onClick={() =>
                          toast.info("Please login to your account")
                        }
                      >
                        {product.addToWishList
                          ? "Added To Wishlist"
                          : "Save To Wishlist"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-secondary w-100 mb-2"
                        style={{ fontSize: "15px" }}
                        value={product.id}
                        onClick={(e) =>
                          userId
                            ? addToWishlist(e)
                            : toast.info("Please login to your account")
                        }
                      >
                        {product.addToWishList
                          ? "Added To Wishlist"
                          : "Save To Wishlist"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="me-md-5">
                <small className="text-primary fw-medium">
                  {product.soldBy}
                </small>
                <p
                  className={`fw-bold lh-sm ${styles.productDescription} mb-1`}
                >
                  {product.newArrival === true && (
                    <span className="badge text-bg-success me-1">New</span>
                  )}
                  {!!Number(product.offer.replace("%", "")) && (
                    <span className="badge text-bg-warning me-1">
                      Diwali Offer
                    </span>
                  )}
                  {product.name}
                </p>
                <div className="d-flex align-items-end">
                  <RatingBar rating={product.rating} />
                  <span
                    className="fw-bold"
                    style={{ fontSize: "15px", marginLeft: "5px" }}
                  >
                    {" "}
                    {product.rating}
                  </span>
                </div>
                <div>
                  <span className="fw-bold fs-5">
                    ₹
                    {Math.round(
                      (
                        product.price -
                        (product.price *
                          (Number(product.offer.replace("%", ""))
                            ? Number(product.offer.replace("%", ""))
                            : Number(product.discount.replace("%", "")))) /
                          100
                      ).toFixed(1),
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
                <div>
                  <span className={`${styles.quantityText} fw-bold me-2`}>
                    Quantity:{" "}
                  </span>
                  <div className={`${styles.quantityBtnContainer} mb-3`}>
                    <button
                      className={`rounded-circle border border-1 ${styles.decrease_count_btn}`}
                      onClick={(e) =>
                        userId
                          ? decreaseCount(e)
                          : toast.info("Please login to your account")
                      }
                    >
                      {" "}
                      -{" "}
                    </button>
                    <input
                      type="text"
                      defaultValue={
                        product.quantity ? product.quantity : quantity
                      }
                      style={{ width: "30px" }}
                      className="mx-2 text-center"
                      ref={qtyInputRef}
                      onChange={async (e) => {
                        try {
                          // Update user in Database
                          const USER = { ...user }
                          const clothItem = USER.addToCartItems.find(
                            (item) => item.id === id,
                          )
                          if (clothItem) {
                            clothItem.quantity = Number(e.target.value)
                            await updateCartItemsInUser({
                              items: USER.addToCartItems,
                              setIsError,
                              navigate,
                            })
                            setUser(USER)
                          }

                          setQuantity(Number(e.target.value))

                          // To update clothsData, createOrder and the variables present in this page
                          setUpdated(true)
                        } catch (error) {
                          if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
                            console.error(error)
                          }
                          setIsError(error.message)
                        }
                      }}
                    />
                    <button
                      className={`rounded-circle border border-1 ${styles.increase_count_btn}`}
                      onClick={(e) =>
                        userId
                          ? increaseCount(e)
                          : toast.info("Please login to your account")
                      }
                    >
                      {" "}
                      +{" "}
                    </button>
                  </div>
                </div>
                <div>
                  <span className={`${styles.sizeText} fw-bold me-3`}>
                    Size:{" "}
                  </span>
                  <div className={`${styles.sizeBtnContainer}`}>
                    <button
                      className="border border-1 me-2 mb-2"
                      onClick={(e) => handleSize(e, "S")}
                    >
                      S
                    </button>
                    <button
                      className="border border-1 me-2 mb-2"
                      onClick={(e) => handleSize(e, "M")}
                    >
                      M
                    </button>
                    <button
                      className="border border-1 me-2 mb-2"
                      onClick={(e) => handleSize(e, "L")}
                    >
                      L
                    </button>
                    <button
                      className="border border-1 me-2 mb-2"
                      onClick={(e) => handleSize(e, "XL")}
                    >
                      XL
                    </button>
                    <button
                      className="border border-1 mb-2"
                      onClick={(e) => handleSize(e, "XXL")}
                    >
                      XXL
                    </button>
                  </div>
                </div>
                <hr />
                <div
                  className={`${styles.orderFeaturesContainerInProductDetailsPage}`}
                >
                  <i
                    className={`${styles.preBtn} bi bi-chevron-left`}
                    onClick={preBtnClicked}
                  ></i>
                  <i
                    className={`${styles.nxtBtn} bi bi-chevron-right`}
                    onClick={nxtBtnClicked}
                  ></i>
                  <div
                    className={`${styles.orderFeaturesInProductDetailsPage} d-flex gap-3 gap-sm-4 gap-md-5 px-sm-4`}
                  >
                    <div
                      className={`d-flex flex-column align-items-center gap-1 ${styles.buyingFeatures} ${styles.returnAndExchange}`}
                      onClick={() => {
                        setReturnAndExchangePopover(
                          returnAndExchangePopover ? false : true,
                        )
                        setFreeDeliveryPopover(false)
                        setPayOnDeliveryPopover(false)
                        setSecureTransactionPopover(false)
                        setKnowMore(false)
                      }}
                    >
                      <img
                        src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-returns._CB562506492_.png"
                        alt="returnProductIcon"
                        className="w-100 img-fluid"
                      />
                      <p
                        className="lh-1 m-0 text-center"
                        style={{ fontSize: "10px" }}
                      >
                        10 days Return & Exchange
                      </p>
                    </div>
                    <div
                      className={`d-flex flex-column align-items-center gap-1 ${styles.buyingFeatures} ${styles.freeDelivery}`}
                      onClick={() => {
                        setFreeDeliveryPopover(
                          freeDeliveryPopover ? false : true,
                        )
                        setReturnAndExchangePopover(false)
                        setPayOnDeliveryPopover(false)
                        setSecureTransactionPopover(false)
                      }}
                    >
                      <img
                        src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/trust_icon_free_shipping_81px._CB562549966_.png"
                        alt="freeDeliveryIcon"
                        className="w-100 img-fluid"
                      />
                      <p
                        className="lh-1 m-0 text-center"
                        style={{ fontSize: "10px" }}
                      >
                        Free Delivery
                      </p>
                    </div>
                    <div
                      className={`d-flex flex-column align-items-center gap-1 ${styles.buyingFeatures} ${styles.payOnDelivery}`}
                      onClick={() => {
                        setPayOnDeliveryPopover(
                          payOnDeliveryPopover ? false : true,
                        )
                        setFreeDeliveryPopover(false)
                        setReturnAndExchangePopover(false)
                        setSecureTransactionPopover(false)
                      }}
                    >
                      <img
                        src={images.cashOnDelivery}
                        alt="cashOnDeliveryIcon"
                        className="bg-body-tertiary p-2 rounded-circle w-100 img-fluid"
                        style={{ width: "80px" }}
                      />
                      <p
                        className="lh-1 m-0 text-center"
                        style={{ fontSize: "10px" }}
                      >
                        Pay on Delivery
                      </p>
                    </div>
                    <div
                      className={`d-flex flex-column align-items-center gap-1 ${styles.buyingFeatures} ${styles.secureTransaction}`}
                      onClick={() => {
                        setSecureTransactionPopover(
                          secureTransactionPopover ? false : true,
                        )
                        setPayOnDeliveryPopover(false)
                        setFreeDeliveryPopover(false)
                        setReturnAndExchangePopover(false)
                      }}
                    >
                      <img
                        src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/Secure-payment._CB650126890_.png"
                        alt="securePaymentIcon"
                        className="w-100 img-fluid"
                      />
                      <p
                        className="lh-1 m-0 text-center"
                        style={{ fontSize: "10px" }}
                      >
                        Secure transaction
                      </p>
                    </div>
                  </div>
                </div>
                <div className="position-relative">
                  {returnAndExchangePopover && (
                    <div className={`popover ${styles.popover}`}>
                      <div
                        className="position-absolute"
                        style={{
                          top: "-14px",
                          left: "37px",
                        }}
                      >
                        <i className="bi bi-chevron-up"></i>
                      </div>
                      <div className="d-flex justify-content-between pb-2 fw-bold">
                        <h6>10 days Return & Exchange</h6>
                        <i
                          className="bi bi-x-lg fs-6"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setReturnAndExchangePopover(false)
                            setKnowMore(false)
                          }}
                        ></i>
                      </div>
                      <table>
                        <thead>
                          <tr className="border-secondary-subtle border-top border-bottom">
                            <th className="py-2">Return Reason</th>
                            <th className="py-2">Return Period</th>
                            <th className="py-2">Return Policy</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-secondary-subtle border-bottom">
                            <td className="py-1">Any other reason</td>
                            <td className="py-1">10 days from delivery</td>
                            <td className="py-1">Full refund</td>
                          </tr>
                          <tr className="border-secondary-subtle border-bottom">
                            <td className="py-1">
                              Size too large, Size too small
                            </td>
                            <td className="py-1">10 days from delivery</td>
                            <td className="py-1">
                              Exchange with a different size or colour
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div
                        className="mt-3 mb-2 text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => setKnowMore(knowMore ? false : true)}
                      >
                        {knowMore ? (
                          <span className="me-1">Know Less</span>
                        ) : (
                          <span className="me-1">Know More</span>
                        )}
                        {knowMore ? (
                          <i className="bi bi-chevron-up"></i>
                        ) : (
                          <i className="bi bi-chevron-down"></i>
                        )}
                      </div>
                      {knowMore && (
                        <div>
                          <h5>Return Instructions</h5>
                          <div className="d-flex gap-3">
                            <img
                              src="https://m.media-amazon.com/images/I/11Sa2OpQXzL.png"
                              style={{ width: "100px" }}
                              alt="return"
                            />
                            <p>
                              Keep the item in its original condition and
                              packaging along with MRP tag and accessories for a
                              successful pick-up.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {freeDeliveryPopover && (
                    <div className={`popover ${styles.popover}`}>
                      <div
                        className="position-absolute"
                        style={{
                          top: "-14px",
                          left: "137px",
                        }}
                      >
                        <i className="bi bi-chevron-up"></i>
                      </div>
                      <div className="d-flex justify-content-between fw-bold pb-2">
                        <h6>Free Delivery</h6>
                        <i
                          className="bi bi-x-lg fs-6"
                          style={{ cursor: "pointer" }}
                          onClick={() => setFreeDeliveryPopover(false)}
                        ></i>
                      </div>
                      {product.freeDelivery ? (
                        <p>The product is eligible for Free delivery.</p>
                      ) : (
                        <p>The product is not eligible for Free delivery.</p>
                      )}
                    </div>
                  )}
                  {payOnDeliveryPopover && (
                    <div className={`popover ${styles.popover}`}>
                      <div
                        className="position-absolute"
                        style={{
                          top: "-14px",
                          left: "237px",
                        }}
                      >
                        <i className="bi bi-chevron-up"></i>
                      </div>
                      <div className="d-flex justify-content-between fw-bold pb-2">
                        <h6>What is Pay on Delivery (Cash/Card)?</h6>
                        <i
                          className="bi bi-x-lg fs-6"
                          style={{ cursor: "pointer" }}
                          onClick={() => setPayOnDeliveryPopover(false)}
                        ></i>
                      </div>
                      <p>
                        Pay on Delivery (Cash/Card) payment method includes Cash
                        on Delivery (COD) as well as Debit card / Credit card /
                        Net banking payments at your doorstep.
                      </p>
                    </div>
                  )}
                  {secureTransactionPopover && (
                    <div className={`popover ${styles.popover}`}>
                      <div
                        className="position-absolute"
                        style={{
                          top: "-14px",
                          left: "337px",
                        }}
                      >
                        <i className="bi bi-chevron-up"></i>
                      </div>
                      <div className="d-flex justify-content-between fw-bold pb-2">
                        <h6>Your transaction is secure</h6>
                        <i
                          className="bi bi-x-lg fs-6"
                          style={{ cursor: "pointer" }}
                          onClick={() => setSecureTransactionPopover(false)}
                        ></i>
                      </div>
                      <p>
                        We work hard to protect your security and privacy. Our
                        payment security system encrypts your information during
                        transmission. We don’t share your credit card details
                        with third-party sellers, and we don’t sell your
                        information to others.
                      </p>
                    </div>
                  )}
                </div>
                <hr />
                <div>
                  <h5>Description</h5>
                  <ul
                    className={`mb-0 ${expand ? "" : `${styles.productDescriptionLimit}`}`}
                  >
                    {product.description.map((list, index) => (
                      <li key={index}>{list}</li>
                    ))}
                  </ul>
                  <div
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setExpand(expand ? false : true)}
                  >
                    <span>{expand ? "show less" : "show more"}</span>{" "}
                    {expand ? (
                      <i className="bi bi-chevron-up"></i>
                    ) : (
                      <i className="bi bi-chevron-down"></i>
                    )}
                  </div>
                </div>
                <div className={`${styles.btnContainer2}`}>
                  {!user && (
                    <button
                      className="btn btn-primary w-100 my-2"
                      onClick={() => toast.info("Please login to your account")}
                    >
                      Buy Now
                    </button>
                  )}
                  {user && !user.address.length && (
                    <button
                      className="btn btn-primary w-100 my-2"
                      onClick={() => toast.info("Please add your address")}
                    >
                      Buy Now
                    </button>
                  )}
                  {user && user.address.length !== 0 && !size && (
                    <button
                      className="btn btn-primary w-100 my-2"
                      onClick={() =>
                        toast.info("Please select the product size")
                      }
                    >
                      Buy Now
                    </button>
                  )}
                  {user && user.address.length !== 0 && size && (
                    <Link
                      to="/paymentMethods"
                      className="btn btn-primary w-100 my-2 text-decoration-none"
                    >
                      Buy Now{" "}
                    </Link>
                  )}
                  <br />
                  <div>
                    {!user ? (
                      <button
                        className="btn btn-secondary w-100 mb-2"
                        onClick={() =>
                          toast.info("Please login to your account")
                        }
                      >
                        {product.addToCart ? "Added To Cart" : "Add To cart"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary w-100 mb-2"
                        value={product.id}
                        onClick={addToCart}
                      >
                        {product.addToCart ? "Added To Cart" : "Add To cart"}
                      </button>
                    )}
                  </div>
                  <div>
                    {!user ? (
                      <button
                        className="btn btn-outline-secondary w-100 mb-2"
                        onClick={() =>
                          toast.info("Please login to your account")
                        }
                      >
                        {product.addToWishList
                          ? "Added To Wishlist"
                          : "Save To Wishlist"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-secondary w-100 mb-2"
                        value={product.id}
                        onClick={addToWishlist}
                      >
                        {product.addToWishList
                          ? "Added To Wishlist"
                          : "Save To Wishlist"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`bg-white ${styles.checkoutSidebar} ms-auto px-4 py-3 fw-medium border border-secondary`}
              >
                <span className={`${styles.aboutProduct_sidebar_price}`}>
                  <span
                    style={{ fontSize: "18px", bottom: "7px" }}
                    className="position-relative"
                  >
                    ₹
                  </span>
                  {Math.round(
                    (
                      product.price -
                      (product.price *
                        (Number(product.offer.replace("%", ""))
                          ? Number(product.offer.replace("%", ""))
                          : Number(product.discount.replace("%", "")))) /
                        100
                    ).toFixed(1),
                  )}
                </span>
                {time !== "0:0:0" && (
                  <p
                    className={`${styles.aboutProduct_sidebar_deliveryEstimate} lh-sm`}
                  >
                    FREE delivery
                    <span className="fw-bold"> {setDeliveryDate()}</span>. Order
                    within{" "}
                    <span
                      className={`${styles.sidebar_deliveryEstimate_orderWithin}`}
                      style={{ color: "green" }}
                    >
                      {time}
                    </span>
                    .
                    {!size && (
                      <a
                        className="d-block text-decoration-underline"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          toast.info("Please select the product size")
                        }
                      >
                        Details
                      </a>
                    )}
                    {size && (
                      <Link
                        to="/paymentMethods"
                        className="d-block text-decoration-underline"
                        style={{ cursor: "pointer" }}
                      >
                        Details
                      </Link>
                    )}
                  </p>
                )}
                {user && user.address.length !== 0 && (
                  <div
                    className={`d-flex align-items-start ${styles.aboutProduct_sidebar_deliveryLocation}`}
                  >
                    <img
                      className={`${styles.sidebar_deliveryLocation_locationLogo}`}
                      src={images.location}
                      alt="Location icon"
                    />
                    <p
                      className={`${styles.sidebar_deliveryLocation_locationText} lh-sm`}
                    >
                      Delivering to {user.name} - {address.city}{" "}
                      {address.pinCode}
                    </p>
                  </div>
                )}
                <p
                  className={`${styles.aboutProduct_sidebar_stockStatus} fw-bold fs-5`}
                >
                  In stock
                </p>
                <table className={`${styles.aboutProduct_sidebar_table}`}>
                  <tbody>
                    <tr>
                      <td>Ships from</td>
                      <td>{product.shipsFrom}</td>
                    </tr>
                    <tr>
                      <td>Sold by</td>
                      <td>{product.soldBy}</td>
                    </tr>
                    <tr>
                      <td>Payment</td>
                      <td>Secure transaction</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4">
                  {!user && (
                    <button
                      className="btn btn-warning w-100 my-2"
                      onClick={() => toast.info("Please login to your account")}
                    >
                      Buy Now
                    </button>
                  )}
                  {user && !user.address.length && (
                    <button
                      className="btn btn-warning w-100 my-2"
                      onClick={() => toast.info("Please add your address")}
                    >
                      Buy Now
                    </button>
                  )}
                  {user && user.address.length !== 0 && !size && (
                    <button
                      className="btn btn-warning rounded w-100 my-2"
                      onClick={() =>
                        toast.info("Please select the product size")
                      }
                    >
                      Buy Now
                    </button>
                  )}
                  {user && user.address.length !== 0 && size && (
                    <Link
                      to="/paymentMethods"
                      className="btn btn-warning rounded w-100 mb-2"
                    >
                      Buy Now
                    </Link>
                  )}
                  <div>
                    {!user ? (
                      <button
                        className="btn btn-warning rounded w-100 mb-2"
                        onClick={() =>
                          toast.info("Please login to your account")
                        }
                      >
                        {product.addToCart ? "Added To Cart" : "Add To cart"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning rounded w-100 mb-2"
                        value={product.id}
                        onClick={addToCart}
                      >
                        {product.addToCart ? "Added To Cart" : "Add To cart"}
                      </button>
                    )}
                  </div>
                  <hr className="mt-1 mb-3" />
                  <div>
                    {!user ? (
                      <button
                        className="btn btn-outline-secondary rounded w-100"
                        onClick={() =>
                          toast.info("Please login to your account")
                        }
                      >
                        {product.addToWishList
                          ? "Added To Wishlist"
                          : "Save To Wishlist"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-secondary rounded w-100"
                        value={product.id}
                        onClick={addToWishlist}
                      >
                        {product.addToWishList
                          ? "Added To Wishlist"
                          : "Save To Wishlist"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
            <hr />
            <section className={`${styles.frequentlyBoughtSection}`}>
              <h3 className="mt-2 mb-4">Frequently bought together</h3>
              <div className={`${styles.frequentlyBoughtContainer}`}>
                <div className={`${styles.frequently_bought_item}`}>
                  <div className={`${styles.frequently_bought_image}`}>
                    <img src={product.url} alt="Frequently bought item 1" />
                    <input type="checkbox" checked readOnly />
                  </div>
                  <p
                    style={{
                      height: "67px",
                      overflow: "hidden",
                      fontSize: "14px",
                      marginBottom: "0px",
                    }}
                  >
                    <span className="fw-bold">This item:</span>{" "}
                    {product.name.length > 71
                      ? product.name.slice(0, 70).concat("...")
                      : product.name}
                  </p>
                  <div className={`${styles.item_price}`}>
                    <b>₹</b>
                    <span>
                      {Math.round(
                        product.price -
                          (product.price *
                            (Number(product.offer.replace("%", ""))
                              ? Number(product.offer.replace("%", ""))
                              : Number(product.discount.replace("%", "")))) /
                            100,
                      )}
                    </span>
                    <span className="ms-1">
                      (-
                      {Number(product.offer.replace("%", ""))
                        ? product.offer
                        : product.discount}
                      )
                    </span>
                  </div>
                </div>
                <span
                  className={`${styles.plus_symbol}`}
                  style={{ fontSize: "30px" }}
                >
                  +
                </span>
                <div className={`${styles.frequently_bought_item}`}>
                  <div className={`${styles.frequently_bought_image}`}>
                    <img
                      src={similarProducts[2].url}
                      alt="Frequently bought item 2"
                    />
                    <input
                      type="checkbox"
                      id="frequentlyBoughtItem2Checkbox"
                      ref={cbBought2Ref}
                      style={{ cursor: "pointer" }}
                      onChange={(e) => {
                        if (userId) {
                          addToCreateOrderCheckboxHandler(
                            e,
                            similarProducts[2].id,
                          )
                          setCheckBox1Clicked(checkBox1Clicked ? false : true)
                        } else {
                          toast.info("Please login to your account")
                        }
                      }}
                    />
                  </div>
                  <Link
                    to={`/productDetails/${similarProducts[2].id}`}
                    style={{
                      height: "67px",
                      overflow: "hidden",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "0px",
                    }}
                  >
                    {similarProducts[2].name.length > 71
                      ? similarProducts[2].name.slice(0, 70).concat("...")
                      : similarProducts[2].name}
                  </Link>
                  <div className={`${styles.item_price} text-black`}>
                    <b>₹</b>
                    <span>
                      {Math.round(
                        similarProducts[2].price -
                          (similarProducts[2].price *
                            (Number(similarProducts[2].offer.replace("%", ""))
                              ? Number(
                                  similarProducts[2].offer.replace("%", ""),
                                )
                              : Number(
                                  similarProducts[2].discount.replace("%", ""),
                                ))) /
                            100,
                      )}
                    </span>
                    <span className="ms-1">
                      (-
                      {Number(similarProducts[2].offer.replace("%", ""))
                        ? similarProducts[2].offer
                        : similarProducts[2].discount}
                      )
                    </span>
                  </div>
                </div>
                <span
                  className={`${styles.plus_symbol} ${styles.frequentlyBoughtThirdPlusSymbol}`}
                  style={{ fontSize: "30px" }}
                >
                  +
                </span>
                <div
                  className={`${styles.frequently_bought_item} ${styles.frequentlyBoughtThirdItem}`}
                >
                  <div className={`${styles.frequently_bought_image}`}>
                    <img
                      src={similarProducts[3].url}
                      alt="Frequently bought item 3"
                    />
                    <input
                      type="checkbox"
                      id="frequentlyBoughtItem3Checkbox"
                      ref={cbBought3Ref}
                      style={{ cursor: "pointer" }}
                      onChange={(e) => {
                        if (userId) {
                          addToCreateOrderCheckboxHandler(
                            e,
                            similarProducts[3].id,
                          )
                          setCheckBox2Clicked(checkBox2Clicked ? false : true)
                        } else {
                          toast.info("Please login to your account")
                        }
                      }}
                    />
                  </div>
                  <Link
                    to={`/productDetails/${similarProducts[3].id}`}
                    style={{
                      height: "67px",
                      overflow: "hidden",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "0px",
                    }}
                  >
                    {similarProducts[3].name.length > 71
                      ? similarProducts[3].name.slice(0, 70).concat("...")
                      : similarProducts[3].name}
                  </Link>
                  <div className={`${styles.item_price} text-black`}>
                    <b>₹</b>
                    <span>
                      {Math.round(
                        similarProducts[3].price -
                          (similarProducts[3].price *
                            (Number(similarProducts[3].offer.replace("%", ""))
                              ? Number(
                                  similarProducts[3].offer.replace("%", ""),
                                )
                              : Number(
                                  similarProducts[3].discount.replace("%", ""),
                                ))) /
                            100,
                      )}
                    </span>
                    <span className="ms-1">
                      (-
                      {Number(similarProducts[3].offer.replace("%", ""))
                        ? similarProducts[3].offer
                        : similarProducts[3].discount}
                      )
                    </span>
                  </div>
                </div>
                <div className={`${styles.frequentlyBroughtPriceSection}`}>
                  <div className="text-center fw-medium">
                    <p className="d-inline-block fs-6 mb-0">Total Price:</p>
                    <p className="d-inline-block ms-1 mb-0">
                      ₹
                      <span>
                        {Math.round(
                          (product.price -
                            (product.price *
                              (Number(product.offer.replace("%", ""))
                                ? Number(product.offer.replace("%", ""))
                                : Number(product.discount.replace("%", "")))) /
                              100) *
                            product.quantity,
                        ) +
                          (checkBox1Clicked
                            ? Math.round(
                                similarProducts[2].price -
                                  (similarProducts[2].price *
                                    (Number(
                                      similarProducts[2].offer.replace("%", ""),
                                    )
                                      ? Number(
                                          similarProducts[2].offer.replace(
                                            "%",
                                            "",
                                          ),
                                        )
                                      : Number(
                                          similarProducts[2].discount.replace(
                                            "%",
                                            "",
                                          ),
                                        ))) /
                                    100,
                              )
                            : 0) +
                          (checkBox2Clicked
                            ? Math.round(
                                similarProducts[3].price -
                                  (similarProducts[3].price *
                                    (Number(
                                      similarProducts[3].offer.replace("%", ""),
                                    )
                                      ? Number(
                                          similarProducts[3].offer.replace(
                                            "%",
                                            "",
                                          ),
                                        )
                                      : Number(
                                          similarProducts[3].discount.replace(
                                            "%",
                                            "",
                                          ),
                                        ))) /
                                    100,
                              )
                            : 0)}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`${styles.frequentlyBroughtBuyNowBtn}`}
                    style={{ width: "250px" }}
                  >
                    {!user && (
                      <button
                        className="btn btn-warning w-100 my-2 rounded-pill"
                        onClick={() =>
                          toast.info("Please login to your account")
                        }
                      >
                        Buy now
                      </button>
                    )}
                    {user && !user.address.length && (
                      <button
                        className="btn btn-warning w-100 my-2 rounded-pill"
                        onClick={() => toast.info("Please add your address")}
                      >
                        Buy now
                      </button>
                    )}
                    {user && user.address.length !== 0 && !size && (
                      <button
                        className="btn btn-warning w-100 my-2 rounded-pill"
                        onClick={() =>
                          toast.info("Please select the product size")
                        }
                      >
                        Buy now
                      </button>
                    )}
                    {user && user.address.length !== 0 && size && (
                      <Link
                        to="/paymentMethods"
                        className="btn btn-warning w-100 mb-2 rounded-pill"
                      >
                        Buy now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>
            <hr className={`${styles.frequentlyBroughtSectionHr}`} />
            <section className={`${styles.productSpecsSection}`}>
              <h3>Product information</h3>
              <div
                className={`${styles.specsContainer} ${styles.specsContainerFirst}`}
              >
                <div
                  className={`${styles.Product_details} mt-3 ${styles.additionalInformationTable}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowTable1(showTable1 ? false : true)}
                >
                  <div className={`${styles.tableHeader} p-2`}>
                    <h4 className={`${styles.additionalInformationHeader}`}>
                      Additional Information
                    </h4>
                    {showTable1 ? (
                      <i className="bi bi-chevron-up"></i>
                    ) : (
                      <i className="bi bi-chevron-down"></i>
                    )}
                  </div>
                  <table
                    className={`${showTable1 ? `${styles.showTable}` : ""}`}
                  >
                    <tbody>
                      {additionalInformationKeys &&
                        additionalInformationKeys.map((key) => {
                          return (
                            <tr key={key}>
                              <td>{camelCaseToTitle(key)}</td>
                              <td>
                                {
                                  product.productDetails.additionalInformation[
                                    key
                                  ]
                                }
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
                <div
                  className={`${styles.Product_details} mt-3 ${styles.itemDetailsTable}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowTable2(showTable2 ? false : true)}
                >
                  <div className={`${styles.tableHeader} p-2`}>
                    <h4 className={`${styles.itemDetailsHeader}`}>
                      Item Details
                    </h4>
                    {showTable2 ? (
                      <i className="bi bi-chevron-up"></i>
                    ) : (
                      <i className="bi bi-chevron-down"></i>
                    )}
                  </div>
                  <table
                    className={`${showTable2 ? `${styles.showTable}` : ""}`}
                  >
                    <tbody>
                      {itemDetailsKeys &&
                        itemDetailsKeys.map((key) => {
                          return (
                            <tr key={key}>
                              <td>{camelCaseToTitle(key)}</td>
                              <td>
                                {key !== "bestSellersRank"
                                  ? product.productDetails.itemDetails[key]
                                  : Object.values(
                                      product.productDetails.itemDetails
                                        .bestSellersRank,
                                    ).join(", ")}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className={`${styles.specsContainer} ${styles.specsContainerSecond}`}
              >
                <div
                  className={`${styles.Product_details} mt-3 ${styles.styleTable}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowTable3(showTable3 ? false : true)}
                >
                  <div className={`${styles.tableHeader} p-2`}>
                    <h4 className={`${styles.styleHeader}`}>Style</h4>
                    {showTable3 ? (
                      <i className="bi bi-chevron-up"></i>
                    ) : (
                      <i className="bi bi-chevron-down"></i>
                    )}
                  </div>
                  <table
                    className={`${showTable3 ? `${styles.showTable}` : ""}`}
                  >
                    <tbody>
                      {styleKeys &&
                        styleKeys.map((key) => {
                          return (
                            <tr key={key}>
                              <td>{camelCaseToTitle(key)}</td>
                              <td>{product.productDetails.style[key]}</td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
                <div
                  className={`${styles.Product_details} mt-3 ${styles.topHighlightsTable}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowTable4(showTable4 ? false : true)}
                >
                  <div className={`${styles.tableHeader} p-2`}>
                    <h4 className={`${styles.topHighlightsHeader}`}>
                      Top Highlights
                    </h4>
                    {showTable4 ? (
                      <i className="bi bi-chevron-up"></i>
                    ) : (
                      <i className="bi bi-chevron-down"></i>
                    )}
                  </div>
                  <table
                    className={`${showTable4 ? `${styles.showTable}` : ""}`}
                  >
                    <tbody>
                      {topHighlightsKeys &&
                        topHighlightsKeys.map((key) => {
                          return (
                            <tr key={key}>
                              <td>{camelCaseToTitle(key)}</td>
                              <td>
                                {product.productDetails.topHighlights[key]}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
            <hr className={`${styles.productSpecsSectionHr}`} />
            <section className={`${styles.compareSimilarItemsSection}`}>
              <h3>Compare similar items</h3>
              <button
                className={`${styles.pre_content}`}
                onClick={preContentClicked}
              >
                <img src={images.rightArrow} alt="" />
              </button>
              <button
                className={`${styles.nxt_content}`}
                onClick={nxtContentClicked}
              >
                <img src={images.rightArrow} alt="" />
              </button>
              <div
                className={`${styles.compareSimilarItemsDiv}`}
                ref={compareContainerRef}
              >
                <table className={`${styles.compareSimilarItemsTable}`}>
                  <thead>
                    <tr>
                      <td></td>
                      <td>
                        <div className={`${styles.similarItems_item1} item`}>
                          <img src={product.url} alt="" />
                          <Link
                            className={`${styles.productLink} d-block`}
                            style={{
                              height: "56px",
                              overflow: "hidden",
                              color: "black",
                              textDecoration: "none",
                              cursor: "default",
                            }}
                          >
                            <b>
                              {product.productDetails.itemDetails.brandName}
                            </b>
                            <span className="ms-1">
                              {product.name.length > 61
                                ? product.name.slice(0, 60).concat("...")
                                : product.name}
                            </span>
                          </Link>
                          <button
                            className="btn btn-warning btn-sm rounded-pill mt-2"
                            value={product.id}
                            onClick={(e) =>
                              userId
                                ? addToCart(e)
                                : toast.info("Please login to your account")
                            }
                          >
                            {product.addToCart
                              ? "Added To Cart"
                              : "Add To cart"}
                          </button>
                        </div>
                      </td>
                      {similarProducts.map((product) => {
                        return (
                          <td key={product.id}>
                            <div className="similarItems-item1 item">
                              <img src={product.url} alt="" />
                              <Link
                                className={`${styles.productLink} d-block`}
                                style={{ height: "56px", overflow: "hidden" }}
                                to={`/productDetails/${product.id}`}
                              >
                                <b>
                                  {product.productDetails.itemDetails.brandName}
                                </b>
                                <span className="ms-1">
                                  {product.name.length > 61
                                    ? product.name.slice(0, 60).concat("...")
                                    : product.name}
                                </span>
                              </Link>
                              {!user ? (
                                <button
                                  className="btn btn-warning btn-sm rounded-pill mt-2"
                                  onClick={() =>
                                    toast.info("Please login to your account")
                                  }
                                >
                                  {product.addToCart
                                    ? "Added To Cart"
                                    : "Add To cart"}
                                </button>
                              ) : (
                                <button
                                  className="btn btn-warning btn-sm rounded-pill mt-2"
                                  value={product.id}
                                  onClick={(e) =>
                                    userId
                                      ? addToCart(e)
                                      : toast.info(
                                          "Please login to your account",
                                        )
                                  }
                                >
                                  {product.addToCart
                                    ? "Added To Cart"
                                    : "Add To cart"}
                                </button>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Price</td>
                      <td>
                        <p className={`${styles.discountedPrice} my-0`}>
                          <span className={`${styles.discount} me-2`}>
                            -{product.discount}
                          </span>
                          <span>
                            ₹
                            {Math.round(
                              product.price -
                                (product.price *
                                  (Number(product.offer.replace("%", ""))
                                    ? Number(product.offer.replace("%", ""))
                                    : Number(
                                        product.discount.replace("%", ""),
                                      ))) /
                                  100,
                            )}
                          </span>
                        </p>
                        <p className={`${styles.originalPrice} my-0`}>
                          M.R.P: <span>{product.price}</span>
                        </p>
                      </td>
                      {similarProducts.map((product) => {
                        return (
                          <td key={product.id}>
                            <p className={`${styles.discountedPrice} my-0`}>
                              <span className={`${styles.discount} me-2`}>
                                -{product.discount}
                              </span>
                              <span>
                                ₹
                                {Math.round(
                                  product.price -
                                    (product.price *
                                      (Number(product.offer.replace("%", ""))
                                        ? Number(product.offer.replace("%", ""))
                                        : Number(
                                            product.discount.replace("%", ""),
                                          ))) /
                                      100,
                                )}
                              </span>
                            </p>
                            <p className={`${styles.originalPrice} my-0`}>
                              M.R.P: <span>{product.price}</span>
                            </p>
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td>Delivery</td>
                      <td>
                        Get it{" "}
                        <b className="text-success">{setDeliveryDate()}</b>
                      </td>
                      <td>
                        Get it{" "}
                        <b className="text-success">{setDeliveryDate()}</b>
                      </td>
                      <td>
                        Get it{" "}
                        <b className="text-success">{setDeliveryDate()}</b>
                      </td>
                      <td>
                        Get it{" "}
                        <b className="text-success">{setDeliveryDate()}</b>
                      </td>
                      <td>
                        Get it{" "}
                        <b className="text-success">{setDeliveryDate()}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Customer Ratings</td>
                      <td>
                        <b className="text-success">{product.rating}</b> out of
                        5
                      </td>
                      {similarProducts.map((Product) => {
                        return (
                          <td key={Product.id}>
                            <b className="text-success">{product.rating}</b> out
                            of 5
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td>Sold By</td>
                      <td>{product.soldBy}</td>
                      {similarProducts.map((product) => {
                        return <td key={product.id}>{product.soldBy}</td>
                      })}
                    </tr>
                    <tr>
                      <td>Size</td>
                      <td className="text-success fw-bold">S, M, L, XL, XXL</td>
                      <td className="text-success fw-bold">S, M, L, XL, XXL</td>
                      <td className="text-success fw-bold">S, M, L, XL, XXL</td>
                      <td className="text-success fw-bold">S, M, L, XL, XXL</td>
                      <td className="text-success fw-bold">S, M, L, XL, XXL</td>
                    </tr>
                    <tr>
                      <td>Offer</td>
                      <td className="text-success fw-bold">{product.offer}</td>
                      {similarProducts.map((product) => {
                        return (
                          <td key={product.id} className="text-success fw-bold">
                            {product.offer}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td>Gender</td>
                      <td>
                        {product.gender.replace(
                          product.gender[0],
                          product.gender[0].toUpperCase(),
                        )}
                      </td>
                      {similarProducts.map((product) => {
                        return (
                          <td key={product.id}>
                            {product.gender.replace(
                              product.gender[0],
                              product.gender[0].toUpperCase(),
                            )}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td>Age Group</td>
                      <td className="text-success fw-bold">
                        {product.mainCategory.join(", ")}
                      </td>
                      {similarProducts.map((product) => {
                        return (
                          <td key={product.id} className="text-success fw-bold">
                            {product.mainCategory.join(", ")}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td>Cloth Material</td>
                      <td>{product.material}</td>
                      {similarProducts.map((Product) => {
                        return <td key={Product.id}>{product.material}</td>
                      })}
                    </tr>
                    <tr>
                      <td>Country of Origin</td>
                      <td>
                        {product.productDetails.topHighlights.countryOfOrigin}
                      </td>
                      {similarProducts.map((Product) => {
                        return (
                          <td key={Product.id}>
                            {
                              product.productDetails.topHighlights
                                .countryOfOrigin
                            }
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <hr className={`${styles.compareSimilarItemsSectionHr}`} />
            <section>
              <h3 className="my-3">More items you may like in apparel</h3>
              <div className="row row-gap-3">
                {similarProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`col-md-4 col-sm-6 col-xl-3 py-2 bg-body-tertiary ${styles.cardContainer}`}
                  >
                    <Link
                      className="text-decoration-none"
                      to={`/productDetails/${product.id}`}
                    >
                      <div
                        className={`card border border-0 ${styles.similarCards}`}
                      >
                        <img
                          src={product.url}
                          alt="productImage"
                          className={`img-fluid ${styles.similarItemsImage}`}
                          style={{ minHeight: "250px", maxHeight: "250px" }}
                        />
                        <div className="card-body d-flex flex-column justify-content-between align-items-center">
                          <p
                            className={`text-center m-0 lh-sm overflow-hidden ${styles.listProductName} lh-base`}
                            style={{ height: "72px" }}
                          >
                            {!!Number(product.offer.replace("%", "")) && (
                              <span className="badge text-bg-warning me-1">
                                Diwali Offer
                              </span>
                            )}
                            {product.newArrival === true && (
                              <span className="badge text-bg-primary me-1">
                                New
                              </span>
                            )}
                            {product.freeDelivery && (
                              <span className="badge text-bg-success">
                                Free Deilvery
                              </span>
                            )}{" "}
                            {product.name.length > 61
                              ? product.name.slice(0, 60).concat("...")
                              : product.name}
                          </p>
                          <div>
                            <RatingBar rating={product.rating} />
                          </div>
                          <div>
                            <p className="fw-bold my-2">
                              <b>₹</b>
                              {Math.round(
                                (
                                  product.price -
                                  (product.price *
                                    (Number(product.offer.replace("%", ""))
                                      ? Number(product.offer.replace("%", ""))
                                      : Number(
                                          product.discount.replace("%", ""),
                                        ))) /
                                    100
                                ).toFixed(1),
                              )}
                              (-
                              {Number(product.offer.replace("%", ""))
                                ? product.offer
                                : product.discount}
                              )
                            </p>
                            <p
                              id="M.R.P."
                              className="text-decoration-line-through text-center my-0"
                            >
                              M.R.P. ₹{product.price}
                            </p>
                          </div>
                          <div className="w-100 mt-3">
                            <div>
                              {!user ? (
                                <button
                                  className={`btn btn-secondary w-100 mb-2 ${styles.addToCart}`}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    toast.info("Please login to your account")
                                  }}
                                >
                                  {product.addToCart
                                    ? "Added To Cart"
                                    : "Add To cart"}
                                </button>
                              ) : (
                                <button
                                  className={`btn btn-secondary w-100 mb-2 ${styles.addToCart}`}
                                  value={product.id}
                                  onClick={(e) =>
                                    userId
                                      ? addToCart(e)
                                      : toast.info(
                                          "Please login to your account",
                                        )
                                  }
                                >
                                  {product.addToCart
                                    ? "Added To Cart"
                                    : "Add To cart"}
                                </button>
                              )}
                            </div>
                            <div>
                              {!user ? (
                                <button
                                  className={`btn btn-outline-secondary w-100 mb-2 ${styles.saveToWishlist}`}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    toast.info("Please login to your account")
                                  }}
                                >
                                  {product.addToWishList
                                    ? "Added To Wishlist"
                                    : "Save To Wishlist"}
                                </button>
                              ) : (
                                <button
                                  className={`btn btn-outline-secondary w-100 mb-2 ${styles.saveToWishlist}`}
                                  value={product.id}
                                  onClick={(e) =>
                                    userId
                                      ? addToWishlist(e)
                                      : toast.info(
                                          "Please login to your account",
                                        )
                                  }
                                >
                                  {product.addToWishList
                                    ? "Added To Wishlist"
                                    : "Save To Wishlist"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      )}
      <Footer />
    </>
  )
}
