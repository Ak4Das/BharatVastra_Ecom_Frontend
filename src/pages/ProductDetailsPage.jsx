import styles from "../style_modules/pages_modules/ProductDetails.module.css"
import Header from "../components/Header"
import cashOnDelivery from "../assets/images/cash-on-delivery.png"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import RatingBar from "../components/RatingBar"
import { useState } from "react"
import location from "../assets/images/location.png"
import { useEffect } from "react"
import SearchInPage from "../components/SearchInPage"
import { toast } from "react-toastify"
import rightArrow from "../assets/images/right-arrow.png"
import {
  fetchAllCloths,
  updateClothById,
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  fetchUserById,
  updateCartItemsInUser,
  updateWishlistItemsInUser,
  saveCreateOrder,
  fetchClothById,
} from "../services/FetchRequests.js"
import ProductDetailsShimmer from "../shimmers/ProductDetails.shimmer.jsx"
import Footer from "../components/Footer.jsx"
import GetUserId from "../services/GetClothsData.js"
import { syncUserAndCreateOrder } from "../services/Function.js"
import Error from "../components/Error.jsx"

export default function ProductDetailsPage() {
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

  const id = Number(useParams().id)

  const userId = GetUserId()
  const [user, setUser] = useState(null)

  const [CreateOrderInDatabase, setCreateOrderInDatabase] = useState(null)

  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])

  useEffect(() => {
    async function syncFunction() {
      try {
        setLoading(true)

        if (userId) {
          await syncUserAndCreateOrder(userId, setIsError)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    }
    syncFunction()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        if (userId) {
          await fetchCreateOrderByUserId(
            userId,
            setCreateOrderInDatabase,
            setIsError,
          )
          const user = await fetchUserById(userId, setUser, setIsError)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    }
    fetchData()
  }, [isUpdated])

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchClothById(id, setProduct, setIsError)
        if (result) {
          const similarProductIds = result.similarProducts.map(
            (product) => product.id,
          )
          const allSimilarProducts = await Promise.all(
            similarProductIds.map((id) =>
              fetchClothById(id, undefined, setIsError),
            ),
          )
          setSimilarProducts(allSimilarProducts)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    if (user) {
      const finalProduct = getFinalClothsData([product])
      setProduct(finalProduct[0])
      const finalSimilarProducts = getFinalClothsData(similarProducts)
      setSimilarProducts(finalSimilarProducts)
    }
  }, [user])

  const uniqueCreateOrderInDatabase =
    CreateOrderInDatabase &&
    CreateOrderInDatabase.reduce((acc, item) => {
      if (!acc.length) {
        acc.push(item)
      } else {
        const searchInAcc = acc.find((obj) => obj.id === item.id) ? true : false
        if (!searchInAcc) {
          acc.push(item)
        }
      }
      return acc
    }, [])
  const createOrderInDatabase = { item: uniqueCreateOrderInDatabase }

  async function updateCreateOrder(id, data) {
    try {
      const response = await fetchCreateOrderByUserId(
        userId,
        undefined,
        setIsError,
      )
      if (response.length) {
        await fetchCreateOrderByUserIdAndUpdate(id, data, undefined, setIsError)
      } else {
        const response = await saveCreateOrder(data, undefined, setIsError)
      }
      setUpdated(true)
    } catch (error) {
      throw error
    }
  }

  function getFinalClothsData(clothsData) {
    const finalClothsData = clothsData.map((cloth) => {
      const isClothPresentInCart =
        user && user.addToCartItems.filter((item) => item.id === cloth.id)
      if (isClothPresentInCart && isClothPresentInCart.length) {
        cloth.addToCart = true
        cloth.quantity = isClothPresentInCart[0].quantity
          ? isClothPresentInCart[0].quantity
          : 1
        cloth.size = isClothPresentInCart[0].size
          ? isClothPresentInCart[0].size
          : ""
      } else {
        delete cloth.addToCart
      }
      const isClothPresentInWishlist =
        user && user.addToWishlistItems.filter((item) => item.id === cloth.id)
      if (isClothPresentInWishlist && isClothPresentInWishlist.length) {
        cloth.addToWishList = true
      } else {
        delete cloth.addToWishList
      }
      return cloth
    })
    return finalClothsData
  }

  const isClothPresentInCart =
    user && user.addToCartItems.filter((item) => item.id === product.id)

  if (isClothPresentInCart && isClothPresentInCart.length) {
    product.addToCart = true
    product.quantity = isClothPresentInCart[0].quantity
      ? isClothPresentInCart[0].quantity
      : 1
    product.size = isClothPresentInCart[0].size
      ? isClothPresentInCart[0].size
      : ""
  }

  /* Reset the quantity and size value of the product in clothsData 
  while i enter the page if this product is not added to cart */
  if (isClothPresentInCart && !isClothPresentInCart.length) {
    product.quantity = quantity
    product.size = size
  }

  const isClothPresentInWishlist =
    user && user.addToWishlistItems.filter((item) => item.id === product.id)

  if (isClothPresentInWishlist && isClothPresentInWishlist.length) {
    product.addToWishList = true
  }

  async function increaseCount(e) {
    try {
      // Update the input element value
      let inputElementValue = Number(e.target.previousElementSibling.value)
      e.target.previousElementSibling.value = ++inputElementValue

      // Update user in Database
      const clothItem =
        user && user.addToCartItems.find((item) => item.id === id)
      if (clothItem) {
        clothItem.quantity = Number(e.target.previousElementSibling.value)
        await updateCartItemsInUser(
          user._id,
          user.addToCartItems,
          undefined,
          setIsError,
        )
      }

      // Update clothsData in memory
      if (product) {
        product.quantity = Number(e.target.previousElementSibling.value)
      }

      setQuantity(Number(e.target.previousElementSibling.value))
      setUpdated(true)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  async function decreaseCount(e) {
    try {
      let inputElementValue = Number(e.target.nextElementSibling.value)
      if (inputElementValue > 1) {
        // Update the input element value
        e.target.nextElementSibling.value = --inputElementValue

        // Update user in Database
        const clothItem = user.addToCartItems.find((item) => item.id === id)
        if (clothItem) {
          clothItem.quantity = Number(e.target.nextElementSibling.value)
          await updateCartItemsInUser(
            user._id,
            user.addToCartItems,
            undefined,
            setIsError,
          )
        }

        // Update clothsData in memory
        if (product) {
          product.quantity = Number(e.target.nextElementSibling.value)
        }

        setQuantity(Number(e.target.nextElementSibling.value))
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
      // To stop Event Bubbling
      e.preventDefault()
      e.stopPropagation()

      // Update clothsData in memory
      const cloth = await fetchClothById(e.target.value, undefined, setIsError)
      if (cloth) {
        cloth.addToCart = true
        cloth.quantity = quantity
        cloth.size = size
      }

      // Update user in Database
      const isAddedToCart = user.addToCartItems.filter(
        (item) => item.id === Number(e.target.value),
      )
      if (!isAddedToCart.length) {
        user.addToCartItems.push({
          id: cloth.id,
          quantity: quantity,
          size: size,
        })
        await updateCartItemsInUser(
          user._id,
          user.addToCartItems,
          undefined,
          setIsError,
        )

        // For interactivity
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

      // To update the variables present in this page
      setUpdated(true)

      toast("Product added to cart😊")
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  async function addToWishlist(e) {
    try {
      // To stop Event Bubbling
      e.preventDefault()
      e.stopPropagation()

      const isAddedToWishlist = user.addToWishlistItems.filter(
        (item) => item.id === Number(e.target.value),
      )
      if (!isAddedToWishlist.length) {
        // Update user in Database
        user.addToWishlistItems.push({ id: Number(e.target.value) })
        await updateWishlistItemsInUser(
          user._id,
          user.addToWishlistItems,
          undefined,
          setIsError,
        )

        // Update clothsData in memory
        const item = await fetchClothById(e.target.value, undefined, setIsError)
        if (item) {
          item.addToWishList = true
        }

        // For interactivity
        const btn = e.target
        btn.innerHTML = "Added To Wishlist"
        btn.style.backgroundColor = "#05a058"
        btn.style.color = "white"
        setTimeout(() => {
          btn.innerHTML = "Added To Wishlist"
          btn.style.backgroundColor = ""
          btn.style.color = ""
        }, 1000)

        // To update the variables present in this page
        setUpdated(true)

        toast("Product added to wishlist😊")
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  const address =
    user &&
    user.address.length !== 0 &&
    user.address.find((address) => address.selected)

  /* Update createOrder in Database while quantity, size, freeDelivery will change and 
  update user in database while quantity change and if product is already added to cart */
  useEffect(() => {
    async function fetchData() {
      try {
        if (isUpdated) {
          if (isClothPresentInCart && isClothPresentInCart.length) {
            if (quantity > 1) {
              isClothPresentInCart[0].quantity = quantity
              await updateCartItemsInUser(
                user._id,
                user.addToCartItems,
                undefined,
                setIsError,
              )
              product.quantity = quantity
            }
          } else {
            if (quantity > 1) {
              product.quantity = quantity
            }
          }
          if (size) {
            const createOrderArr = await fetchCreateOrderByUserId(
              userId,
              undefined,
              setIsError,
            )
            createOrderArr[0].products.forEach((item) => (item.size = size))
            product.size = size
            const createOrderObj = {
              products: createOrderArr[0].products,
              userId,
            }
            await fetchCreateOrderByUserIdAndUpdate(
              userId,
              createOrderObj,
              undefined,
              setIsError,
            )
          }
          if (isFreeDeliveryAvailable) {
            product.freeDelivery = true
          } else {
            product.freeDelivery = false
          }
          const createOrderArr = await fetchCreateOrderByUserId(
            userId,
            undefined,
            setIsError,
          )
          const filteredItem = createOrderArr[0].products.filter(
            (item) => item.id !== product.id,
          )
          filteredItem.forEach((product) => {
            const isAddedToCart =
              user &&
              user.addToCartItems.filter((item) => item.id === product.id)
            if (isAddedToCart.length) {
              product.addToCart = true
            }
            const isAddedToWishlist =
              user &&
              user.addToWishlistItems.filter((item) => item.id === product.id)
            if (isAddedToWishlist.length) {
              product.addToWishList = true
            }
          })
          filteredItem.push(product)
          const createOrderObj = { products: filteredItem, userId }
          await fetchCreateOrderByUserIdAndUpdate(
            userId,
            createOrderObj,
            undefined,
            setIsError,
          )
          setUpdated(false)
        }
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error)
        }
        setIsError(error.message)
      }
    }
    fetchData()
    // return () => {
    //   localStorage.setItem("havePass", true)
    // }
  }, [isUpdated])

  // Slide content btn logic
  function preBtnClicked(e) {
    const element = e.target
    const container = element.parentElement.children[2]
    const containerDimensions = container.getBoundingClientRect()
    const containerWidth = containerDimensions.width
    container.scrollLeft += containerWidth
    element.style.opacity = 0
    element.nextElementSibling.style.opacity = 1
  }
  function nxtBtnClicked(e) {
    const element = e.target
    const container = element.parentElement.children[2]
    const containerDimensions = container.getBoundingClientRect()
    const containerWidth = containerDimensions.width
    container.scrollLeft -= containerWidth
    element.style.opacity = 0
    element.previousElementSibling.style.opacity = 1
  }

  function preContentClicked() {
    const container = document.querySelector(
      `.${styles.compareSimilarItemsDiv}`,
    )
    container.scrollLeft -= 210
  }
  function nxtContentClicked() {
    const container = document.querySelector(
      `.${styles.compareSimilarItemsDiv}`,
    )
    container.scrollLeft += 280
  }

  const months = [
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

  function setDeliveryDate() {
    const today = new Date()
    today.setDate(today.getDate() + 10)
    return `${today.getDate()} ${
      months[today.getMonth()]
    } ${today.getFullYear()}`
  }

  useEffect(() => {
    if (product?.freeDelivery) {
      setFreeDelivery(true)
      const timerId = setInterval(async () => {
        try {
          const currentTime = new Date()
          const hours = currentTime.getHours()
          const minutes = currentTime.getMinutes()
          const seconds = currentTime.getSeconds()
          setTime(`${23 - hours}:${59 - minutes}:${59 - seconds}`)
          // console.log(hours, minutes, seconds)
          if (hours === 23 && minutes === 59 && seconds === 59) {
            setFreeDelivery(false)
            setUpdated(true)
            const cloth = await fetchClothById(
              e.target.value,
              undefined,
              setIsError,
            )
            cloth.freeDelivery = false
            await updateClothById(product.id, cloth, undefined, setIsError)
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
  }, [])

  useEffect(() => {
    const input1 = document.querySelector("#frequentlyBoughtItem2Checkbox")
    if (input1) {
      input1.checked = false
    }
    const input2 = document.querySelector("#frequentlyBoughtItem3Checkbox")
    if (input2) {
      input2.checked = false
    }
  }, [id])

  useEffect(() => {
    // set createOrder for every mount
    async function updateCreateOrderData() {
      try {
        if (product) {
          const obj = { products: [product], userId }
          userId && (await updateCreateOrder(userId, obj))
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
  }, [product])

  const additionalInformationKeys =
    product && Object.keys(product.productDetails.additionalInformation)

  const itemDetailsKeys =
    product && Object.keys(product.productDetails.itemDetails)

  const styleKeys = product && Object.keys(product.productDetails.style)

  const topHighlightsKeys =
    product && Object.keys(product.productDetails.topHighlights)

  function camelCaseToTitle(camelCase) {
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
    return wordsArray.join(" ")
  }

  async function addToCreateOrder(e, productId) {
    try {
      const checked = e.target.checked
      const createOrderArr = await fetchCreateOrderByUserId(
        userId,
        undefined,
        setIsError,
      )
      const product = await fetchClothById(productId, undefined, setIsError)
      const isIncluded = createOrderArr[0].products.filter(
        (item) => item.id === product.id,
      ).length
        ? true
        : false
      if (checked) {
        if (!isIncluded) {
          if (size) {
            product.size = size
          }
          product.quantity = 1
          createOrderArr[0].products.push(product)
          const createOrderObj = {
            products: createOrderArr[0].products,
            userId,
          }
          await fetchCreateOrderByUserIdAndUpdate(
            userId,
            createOrderObj,
            undefined,
            setIsError,
          )
        }
      } else {
        if (isIncluded) {
          const updatedItem = createOrderArr[0].products.filter(
            (item) => item.id !== product.id,
          )
          const createOrderObj = { products: updatedItem, userId }
          await fetchCreateOrderByUserIdAndUpdate(
            userId,
            createOrderObj,
            undefined,
            setIsError,
          )
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

  if (isError) {
    return <Error />
  }

  if (!product || !similarProducts.length) {
    return
  }

  return (
    <>
      {loading ? (
        <ProductDetailsShimmer />
      ) : (
        <>
          <Header
            position="static"
            top="auto"
            zIndex="auto"
            setSearch={setSearch}
            placeHolder="Search Product"
            page="productDetails"
            userDetails={user}
          />
          <SearchInPage
            margin="ms-3"
            setSearch={setSearch}
            page="productDetails"
            placeHolder="Search Product"
          />
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
                        onClick={() => toast("Please login to your account")}
                      >
                        Buy Now
                      </button>
                    )}
                    {user && !user.address.length && (
                      <button
                        className="btn btn-primary w-100 my-2"
                        onClick={() => toast("Please add your address")}
                      >
                        Buy Now
                      </button>
                    )}
                    {user && user.address.length !== 0 && !size && (
                      <button
                        className="btn btn-primary w-100 my-2"
                        onClick={() => toast("Please select the product size")}
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
                          onClick={() => toast("Please login to your account")}
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
                              : toast("Please login to your account")
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
                          onClick={() => toast("Please login to your account")}
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
                              : toast("Please login to your account")
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
                            : toast("Please login to your account")
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
                        onChange={async (e) => {
                          try {
                            // Update user in Database
                            const clothItem = user.addToCartItems.find(
                              (item) => item.id === id,
                            )
                            if (clothItem) {
                              clothItem.quantity = Number(e.target.value)
                              await updateCartItemsInUser(
                                user._id,
                                user.addToCartItems,
                                undefined,
                                setIsError,
                              )
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
                            : toast("Please login to your account")
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
                        onClick={async (e) => {
                          try {
                            if (userId) {
                              setSize("S")

                              // Update user in Database
                              const isClothAddedToCart =
                                user.addToCartItems.find(
                                  (item) => item.id === id,
                                )
                              if (isClothAddedToCart) {
                                isClothAddedToCart.size = "S"
                                await updateCartItemsInUser(
                                  user._id,
                                  user.addToCartItems,
                                  undefined,
                                  setIsError,
                                )
                              }

                              // To update clothsData, createOrder and the variables present in this page
                              setUpdated(true)

                              // For interactivity
                              const btn = e.target
                              btn.innerHTML = "✓"
                              setTimeout(() => {
                                btn.innerHTML = "S"
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
                              toast("Please login to your account")
                            }
                          } catch (error) {
                            if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
                              console.error(error)
                            }
                            setIsError(error.message)
                          }
                        }}
                      >
                        S
                      </button>
                      <button
                        className="border border-1 me-2 mb-2"
                        onClick={async (e) => {
                          try {
                            if (userId) {
                              setSize("M")

                              // Update user in Database
                              const isClothAddedToCart =
                                user &&
                                user.addToCartItems.find(
                                  (item) => item.id === id,
                                )
                              if (isClothAddedToCart) {
                                isClothAddedToCart.size = "M"
                                await updateCartItemsInUser(
                                  user._id,
                                  user.addToCartItems,
                                  undefined,
                                  setIsError,
                                )
                              }

                              // To update clothsData, createOrder and the variables present in this page
                              setUpdated(true)

                              // For interactivity
                              const btn = e.target
                              btn.innerHTML = "✓"
                              setTimeout(() => {
                                btn.innerHTML = "M"
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
                              toast("Please login to your account")
                            }
                          } catch (error) {
                            if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
                              console.error(error)
                            }
                            setIsError(error.message)
                          }
                        }}
                      >
                        M
                      </button>
                      <button
                        className="border border-1 me-2 mb-2"
                        onClick={async (e) => {
                          try {
                            if (userId) {
                              setSize("L")

                              // Update user in Database
                              const isClothAddedToCart =
                                user.addToCartItems.find(
                                  (item) => item.id === id,
                                )
                              if (isClothAddedToCart) {
                                isClothAddedToCart.size = "L"
                                await updateCartItemsInUser(
                                  user._id,
                                  user.addToCartItems,
                                  undefined,
                                  setIsError,
                                )
                              }

                              // To update clothsData, createOrder and the variables present in this page
                              setUpdated(true)

                              // For interactivity
                              const btn = e.target
                              btn.innerHTML = "✓"
                              setTimeout(() => {
                                btn.innerHTML = "L"
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
                              toast("Please login to your account")
                            }
                          } catch (error) {
                            if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
                              console.error(error)
                            }
                            setIsError(error.message)
                          }
                        }}
                      >
                        L
                      </button>
                      <button
                        className="border border-1 me-2 mb-2"
                        onClick={async (e) => {
                          try {
                            if (userId) {
                              setSize("XL")

                              // Update user in Database
                              const isClothAddedToCart =
                                user.addToCartItems.find(
                                  (item) => item.id === id,
                                )
                              if (isClothAddedToCart) {
                                isClothAddedToCart.size = "XL"
                                await updateCartItemsInUser(
                                  user._id,
                                  user.addToCartItems,
                                  undefined,
                                  setIsError,
                                )
                              }

                              // To update clothsData, createOrder and the variables present in this page
                              setUpdated(true)

                              // For interactivity
                              const btn = e.target
                              btn.innerHTML = "✓"
                              setTimeout(() => {
                                btn.innerHTML = "XL"
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
                              toast("Please login to your account")
                            }
                          } catch (error) {
                            if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
                              console.error(error)
                            }
                            setIsError(error.message)
                          }
                        }}
                      >
                        XL
                      </button>
                      <button
                        className="border border-1 mb-2"
                        onClick={async (e) => {
                          try {
                            if (userId) {
                              setSize("XXL")

                              // Update user in Database
                              const isClothAddedToCart =
                                user.addToCartItems.find(
                                  (item) => item.id === id,
                                )
                              if (isClothAddedToCart) {
                                isClothAddedToCart.size = "XXL"
                                await updateCartItemsInUser(
                                  user._id,
                                  user.addToCartItems,
                                  undefined,
                                  setIsError,
                                )
                              }

                              // To update clothsData, createOrder and the variables present in this page
                              setUpdated(true)

                              // For interactivity
                              const btn = e.target
                              btn.innerHTML = "✓"
                              setTimeout(() => {
                                btn.innerHTML = "XXL"
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
                              toast("Please login to your account")
                            }
                          } catch (error) {
                            if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
                              console.error(error)
                            }
                            setIsError(error.message)
                          }
                        }}
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
                          src={cashOnDelivery}
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
                                packaging along with MRP tag and accessories for
                                a successful pick-up.
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
                          Pay on Delivery (Cash/Card) payment method includes
                          Cash on Delivery (COD) as well as Debit card / Credit
                          card / Net banking payments at your doorstep.
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
                          payment security system encrypts your information
                          during transmission. We don’t share your credit card
                          details with third-party sellers, and we don’t sell
                          your information to others.
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
                        onClick={() => toast("Please login to your account")}
                      >
                        Buy Now
                      </button>
                    )}
                    {user && !user.address.length && (
                      <button
                        className="btn btn-primary w-100 my-2"
                        onClick={() => toast("Please add your address")}
                      >
                        Buy Now
                      </button>
                    )}
                    {user && user.address.length !== 0 && !size && (
                      <button
                        className="btn btn-primary w-100 my-2"
                        onClick={() => toast("Please select the product size")}
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
                          onClick={() => toast("Please login to your account")}
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
                          onClick={() => toast("Please login to your account")}
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
                      <span className="fw-bold"> {setDeliveryDate()}</span>.
                      Order within{" "}
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
                            toast("Please select the product size")
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
                        src={location}
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
                        onClick={() => toast("Please login to your account")}
                      >
                        Buy Now
                      </button>
                    )}
                    {user && !user.address.length && (
                      <button
                        className="btn btn-warning w-100 my-2"
                        onClick={() => toast("Please add your address")}
                      >
                        Buy Now
                      </button>
                    )}
                    {user && user.address.length !== 0 && !size && (
                      <button
                        className="btn btn-warning rounded w-100 my-2"
                        onClick={() => toast("Please select the product size")}
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
                          onClick={() => toast("Please login to your account")}
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
                          onClick={() => toast("Please login to your account")}
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
                        style={{ cursor: "pointer" }}
                        onChange={(e) => {
                          if (userId) {
                            addToCreateOrder(e, similarProducts[2].id)
                            setCheckBox1Clicked(checkBox1Clicked ? false : true)
                          } else {
                            toast("Please login to your account")
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
                                    similarProducts[2].discount.replace(
                                      "%",
                                      "",
                                    ),
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
                        style={{ cursor: "pointer" }}
                        onChange={(e) => {
                          if (userId) {
                            addToCreateOrder(e, similarProducts[3].id)
                            setCheckBox2Clicked(checkBox2Clicked ? false : true)
                          } else {
                            toast("Please login to your account")
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
                                    similarProducts[3].discount.replace(
                                      "%",
                                      "",
                                    ),
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
                            product.price -
                              (product.price *
                                (Number(product.offer.replace("%", ""))
                                  ? Number(product.offer.replace("%", ""))
                                  : Number(
                                      product.discount.replace("%", ""),
                                    ))) /
                                100,
                          ) +
                            (checkBox1Clicked
                              ? Math.round(
                                  similarProducts[2].price -
                                    (similarProducts[2].price *
                                      (Number(
                                        similarProducts[2].offer.replace(
                                          "%",
                                          "",
                                        ),
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
                                        similarProducts[3].offer.replace(
                                          "%",
                                          "",
                                        ),
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
                          onClick={() => toast("Please login to your account")}
                        >
                          Buy now
                        </button>
                      )}
                      {user && !user.address.length && (
                        <button
                          className="btn btn-warning w-100 my-2 rounded-pill"
                          onClick={() => toast("Please add your address")}
                        >
                          Buy now
                        </button>
                      )}
                      {user && user.address.length !== 0 && !size && (
                        <button
                          className="btn btn-warning w-100 my-2 rounded-pill"
                          onClick={() =>
                            toast("Please select the product size")
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
                                    product.productDetails
                                      .additionalInformation[key]
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
                  <img src={rightArrow} alt="" />
                </button>
                <button
                  className={`${styles.nxt_content}`}
                  onClick={nxtContentClicked}
                >
                  <img src={rightArrow} alt="" />
                </button>
                <div className={`${styles.compareSimilarItemsDiv}`}>
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
                                  : toast("Please login to your account")
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
                                    {
                                      product.productDetails.itemDetails
                                        .brandName
                                    }
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
                                      toast("Please login to your account")
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
                                        : toast("Please login to your account")
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
                                          ? Number(
                                              product.offer.replace("%", ""),
                                            )
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
                          <b className="text-success">{product.rating}</b> out
                          of 5
                        </td>
                        {similarProducts.map((Product) => {
                          return (
                            <td key={Product.id}>
                              <b className="text-success">{product.rating}</b>{" "}
                              out of 5
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
                        <td className="text-success fw-bold">
                          S, M, L, XL, XXL
                        </td>
                        <td className="text-success fw-bold">
                          S, M, L, XL, XXL
                        </td>
                        <td className="text-success fw-bold">
                          S, M, L, XL, XXL
                        </td>
                        <td className="text-success fw-bold">
                          S, M, L, XL, XXL
                        </td>
                        <td className="text-success fw-bold">
                          S, M, L, XL, XXL
                        </td>
                      </tr>
                      <tr>
                        <td>Offer</td>
                        <td className="text-success fw-bold">
                          {product.offer}
                        </td>
                        {similarProducts.map((product) => {
                          return (
                            <td
                              key={product.id}
                              className="text-success fw-bold"
                            >
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
                            <td
                              key={product.id}
                              className="text-success fw-bold"
                            >
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
                                      toast("Please login to your account")
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
                                        : toast("Please login to your account")
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
                                      toast("Please login to your account")
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
                                        : toast("Please login to your account")
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
          <Footer />
        </>
      )}
    </>
  )
}
