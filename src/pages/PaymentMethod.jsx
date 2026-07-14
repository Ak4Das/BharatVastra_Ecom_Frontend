import styles from "../style_modules/pages_modules/PaymentMethod.module.css"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Header from "../components/Header"
import RatingBar from "../components/RatingBar"
import Footer from "../components/Footer.jsx"
import Error from "../components/Error.jsx"
import PaymentMethodShimmer from "../shimmers/PaymentMethod.shimmer.jsx"
import GetUser from "../services/GetClothsData"
import { images } from "../assets/images/images.js"
import {
  fetchCreateOrderByUserId,
  fetchCreateOrderByUserIdAndUpdate,
  updateCartItemsInUser,
  fetchAllOrdersByUserId,
  saveNewOrder,
  fetchCreateOrderByUserIdAndDelete,
  fetchClothById,
} from "../services/FetchRequests.js"

export default function PaymentMethods() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const navigate = useNavigate()

  const [isCard, setIsCard] = useState(false)
  const [isNetBanking, setIsNetBanking] = useState(false)
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false)
  const [isVisible, setVisible] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isPaymentMethodSelected, selectPaymentMethod] = useState(false)

  const [updated, setUpdated] = useState(false)
  const [orders, setOrders] = useState([])
  const [CreateOrderInDatabase, setCreateOrderInDatabase] = useState(null)
  const [Products, setProducts] = useState([])
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [editItems, setEditItems] = useState(false)

  const { user, setUser } = GetUser()
  const userId = user._id

  const address = user?.address?.length
    ? user.address.find((addr) => addr.selected)
    : null

  const uniqueCreateOrderInDatabase =
    CreateOrderInDatabase &&
    CreateOrderInDatabase.length &&
    CreateOrderInDatabase[0].products.reduce((acc, item) => {
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

  useEffect(() => {
    if (uniqueCreateOrderInDatabase?.length && !Products.length) {
      setProducts(uniqueCreateOrderInDatabase)
    }
  }, [CreateOrderInDatabase])

  async function updateAllItems(data) {
    const createOrder = { products: data, userId }
    await fetchCreateOrderByUserIdAndUpdate({
      userId: userId,
      createOrder,
      setIsError,
      navigate,
    })
    setUpdated(true)
  }

  async function removeAllItemsFromCreateOrder() {
    const result = await fetchCreateOrderByUserIdAndDelete({
      userId,
      setIsError,
      navigate,
    })
    setUpdated(true)
    return result
  }

  async function updateCartItems(id, items) {
    await updateCartItemsInUser({ items, setIsError, navigate })
    setUpdated(true)
  }

  const totalOrder = Products.reduce((acc, curr) => {
    const discountVal = Number(curr.offer.replace("%", ""))
      ? Number(curr.offer.replace("%", ""))
      : Number(curr.discount.replace("%", ""))
    const itemPrice = curr.price - (curr.price / 100) * discountVal
    return acc + itemPrice * (curr.quantity || 1)
  }, 0)

  const DeliveryCharge = Products.length
    ? Math.round(
        Products.reduce((acc, curr) => acc + curr.deliveryCharge, 0) /
          Products.length,
      )
    : 0

  const deliveryCharge = Products.length
    ? Math.round(
        Products.reduce(
          (acc, curr) => acc + (curr.freeDelivery ? 0 : curr.deliveryCharge),
          0,
        ) / Products.length,
      )
    : 0

  const freeDelivery = Products.length
    ? Math.round(
        Products.reduce(
          (acc, curr) => acc + (curr.freeDelivery ? curr.deliveryCharge : 0),
          0,
        ) / Products.length,
      )
    : 0

  const totalPrice = totalOrder + deliveryCharge + (isCashOnDelivery ? 10 : 0)

  async function deleteItem(product) {
    try {
      const Product = Products.filter((item) => item.id !== product.id)
      orders[orders.length - 1].item = Product
      setProducts(Product)

      const createOrder = createOrderInDatabase

      const createOrderItem =
        createOrder &&
        createOrder.item.length &&
        createOrder.item.filter((item) => item.id === product.id)

      const updatedCreateOrder = createOrder.item.filter(
        (item) => item.id !== createOrderItem[0].id,
      )

      await updateAllItems(updatedCreateOrder)
      setEditItems(true)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  async function changeQuantity(e, product) {
    try {
      let inputElementValue = Number(e.target.value)
      // Update clothsData in memory
      const item = await fetchClothById({
        clothId: product.id,
        setIsError,
        navigate,
      })
      if (inputElementValue > 0) {
        item.quantity = inputElementValue
      } else {
        item.quantity = 1
      }

      // Update user in Database
      const isItemAddedToCart = user.addToCartItems.filter(
        (item) => item.id === product.id,
      )
      if (isItemAddedToCart.length) {
        if (inputElementValue > 0) {
          isItemAddedToCart[0].quantity = inputElementValue
        } else {
          isItemAddedToCart[0].quantity = 1
        }

        await updateCartItems(user._id, user.addToCartItems)
      }

      // Update createOrder in Database
      const createOrder = createOrderInDatabase

      const createOrderItem =
        createOrder &&
        createOrder.item.length &&
        createOrder.item.filter((item) => item.id === product.id)

      if (createOrderItem && createOrderItem.length) {
        if (inputElementValue > 0) {
          createOrderItem[0].quantity = inputElementValue
        } else {
          createOrderItem[0].quantity = 1
        }
      }

      await updateAllItems(createOrder.item)

      // Update items of current order
      const Product = Products.find((item) => item.id === product.id)
      Product.quantity = inputElementValue
      orders[orders.length - 1].item = Products
      // useState(true)
      setEditItems(true)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  async function increaseCount(e, product) {
    try {
      // Update the input element value
      let inputElementValue = Number(e.target.previousElementSibling.value)
      e.target.previousElementSibling.value = ++inputElementValue

      // Update clothsData in memory
      const item = await fetchClothById({
        clothId: product.id,
        setIsError,
        navigate,
      })
      item.quantity = Number(e.target.previousElementSibling.value)

      // Update user in Database
      const isItemAddedToCart = user.addToCartItems.filter(
        (item) => item.id === product.id,
      )
      if (isItemAddedToCart.length) {
        isItemAddedToCart[0].quantity = Number(
          e.target.previousElementSibling.value,
        )
        await updateCartItemsInUser({
          items: user.addToCartItems,
          setIsError,
          navigate,
        })
      }

      // Update createOrder in Database
      const createOrder = createOrderInDatabase

      const createOrderItem =
        createOrder &&
        createOrder.item.length &&
        createOrder.item.filter((item) => item.id === product.id)

      if (createOrderItem && createOrderItem.length) {
        createOrderItem[0].quantity = Number(
          e.target.previousElementSibling.value,
        )
      }

      const CreateOrder = {
        products: createOrder.item,
        userId,
      }
      await fetchCreateOrderByUserIdAndUpdate({
        userId,
        createOrder: CreateOrder,
        setIsError,
        navigate,
      })

      // Update items of current order
      const Product = Products.find((item) => item.id === product.id)
      Product.quantity = Number(e.target.previousElementSibling.value)
      orders[orders.length - 1].item = Products

      // To update the variables present in this page
      setUpdated(true)
      setEditItems(true)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  async function placeOrder() {
    try {
      const order = { ...orders[orders.length - 1] }

      if (coupon === "HAPPYDIWALI") {
        order.sale = "10%"
      }

      if (freeDelivery) {
        order.freeDelivery = `₹${freeDelivery}`
      }

      order.totalPrice = Math.round(
        totalPrice - (coupon === "HAPPYDIWALI" ? totalOrder / 10 : 0),
      )

      const newOrder = await saveNewOrder({
        newOrder: order,
        setIsError,
        navigate,
      })
      if (!newOrder) return

      const result = await removeAllItemsFromCreateOrder()
      if (!result) return

      if (order.item) {
        let updatedCartItems = [...user.addToCartItems]
        for (const product of order.item) {
          if (product.addToCart) {
            updatedCartItems = updatedCartItems.filter(
              (item) => item.id !== product.id,
            )
          }
        }
        user.addToCartItems = updatedCartItems
        await updateCartItems(user._id, user.addToCartItems)
      }

      setIsOrderPlaced(true)
      toast.success("Order Placed Successfully🎉😊")
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    }
  }

  function getOrderDate() {
    return new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  function setDeliveryDate() {
    const delivery = new Date()
    delivery.setDate(delivery.getDate() + 10)
    return delivery.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  function getDeliveryDay() {
    const delivery = new Date()
    delivery.setDate(delivery.getDate() + 10)
    return delivery.toLocaleDateString("en-US", { weekday: "long" })
  }

  function setDeliveryTime() {
    return new Date().toLocaleTimeString()
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        const createOrder = await fetchCreateOrderByUserId({
          userId,
          setFunction: setCreateOrderInDatabase,
          setIsError,
          navigate,
        })
        setProducts(createOrder?.length ? createOrder[0].products : [])
        const orders = await fetchAllOrdersByUserId({
          userId,
          setIsError,
          navigate,
        })
        if (!editItems) {
          setOrders(orders || [])
        }
        if (updated) {
          setUpdated(false)
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
    userId && fetchData()
  }, [updated, userId])

  useEffect(() => {
    !updated && setEditItems(false)
  }, [editItems])

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
        isSearchBarNeeded={false}
        userDetails={user}
      />
      {loading && !orders ? (
        <PaymentMethodShimmer />
      ) : (
        <main
          className={`mt-3 mb-5 d-lg-flex gap-5 align-items-start ${styles.paymentMethodMainElement}`}
        >
          <div className={`${styles.paymentMethodSectionOne}`}>
            {user && user.address.length !== 0 && (
              <section
                className={`bg-light p-3 d-flex column-gap-5 justify-content-between align-items-start ${styles.deliveryAddressSection}`}
              >
                <div>
                  <h5 className={`${styles.userName}`}>
                    Delivering to {address.fullName}
                  </h5>
                  <p className={`fw-medium ${styles.userAddress}`}>
                    {address.localInfo}, {address.area},{" "}
                    {address.city.toUpperCase()}
                    {", "}
                    {address.state.toUpperCase()}, {address.pinCode},{" "}
                    {address.country}
                  </p>
                </div>
                <Link
                  to="/userAddress/paymentMethods"
                  className={`text-decoration-none fw-medium ${styles.changeBtn}`}
                >
                  Change
                </Link>
              </section>
            )}
            {isPaymentMethodSelected && (
              <section
                className={`bg-light p-3 d-flex column-gap-5 row-gap-3 justify-content-between align-items-start mt-3 ${styles.paymentMethodSection}`}
              >
                <div>
                  <h5 className={`${styles.paymentMethodHeading}`}>
                    {orders[orders.length - 1].paymentMethod}
                  </h5>
                  <Link
                    className={`fw-medium text-decoration-none ${styles.discountCard} d-block lh-sm`}
                  >
                    Use a gift card, voucher or promo code
                  </Link>
                </div>
                <p
                  className={`text-decoration-none fw-medium my-0 text-primary ${styles.changeBtn} ${styles.cursor_pointer}`}
                  onClick={async () => {
                    try {
                      selectPaymentMethod(false)
                      await fetchAllOrdersByUserId({
                        userId,
                        setFunction: setOrders,
                        setIsError,
                        navigate,
                      })
                    } catch (error) {
                      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
                        console.error(error)
                      }
                      setIsError(error.message)
                    }
                  }}
                >
                  Change
                </p>
              </section>
            )}
            {isPaymentMethodSelected && (
              <section>
                <h3 className="mt-4">Products List</h3>
                <div className="bg-light px-4 py-3 mt-3">
                  <h5
                    className={`mb-3 fw-bold ${styles.deliveryDate} text-success`}
                  >
                    Arriving {setDeliveryDate()}
                  </h5>
                  {Products &&
                    Products.map((product) => (
                      <div
                        key={product.id}
                        className={`card column-gap-4 my-3 ${styles.cardInPaymentMethodPage}`}
                      >
                        <div
                          className={`h-100 mx-auto ${styles.productImageDiv}`}
                        >
                          <img
                            src={product.url}
                            alt="productImage"
                            className="w-100 h-100"
                          />
                        </div>
                        <div className="p-2 w-100">
                          <p className={`fw-medium my-0 ${styles.productName}`}>
                            {product.newArrival === true && (
                              <span className="badge text-bg-success me-1">
                                New
                              </span>
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
                            <span className="ms-1 fw-medium">
                              {product.rating}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="mt-2 fw-medium">
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
                            <span className="ms-2 fw-medium">
                              (-
                              {Number(product.offer.replace("%", ""))
                                ? product.offer
                                : product.discount}
                              )
                            </span>
                          </div>
                          <div
                            className={`border border-warning border-2 mt-3 d-flex align-items-center rounded-pill overflow-hidden justify-content-around ${styles.deleteOrIncreaseQuantityBtn}`}
                            style={{ width: "100px" }}
                          >
                            <button
                              className="border border-0 bg-white text-danger"
                              onClick={() => {
                                deleteItem(product)
                              }}
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                            <input
                              type="text"
                              className={`border border-0 ${styles.quantityInput}`}
                              defaultValue={product.quantity || 1}
                              onChange={async (e) => {
                                changeQuantity(e, product)
                              }}
                            />
                            <button
                              className={`border border-0 bg-white fs-5 fw-bold ${styles.increaseQuantityBtn}`}
                              onClick={async (e) => {
                                increaseCount(e, product)
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}
            {!isPaymentMethodSelected && (
              <section>
                <div className="mt-4">
                  <h3>Payment Method</h3>
                  <div className="bg-light p-3">
                    <div
                      className="d-flex gap-3 align-items-start p-2 rounded"
                      style={{
                        backgroundColor: `${isCard ? "#FCF5EE" : "#F8F9FA"}`,
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="Credit or debit card"
                        className={`mt-1 ${styles.cursor_pointer}`}
                        onClick={(e) => {
                          setPaymentMethod(e.target.value)
                          setIsCard(true)
                          setIsNetBanking(false)
                          setIsCashOnDelivery(false)
                          setVisible(true)
                        }}
                      />
                      <div>
                        <label
                          className={`fw-medium mb-2 ${styles.paymentViaCardLabel}`}
                        >
                          Credit or debit card
                        </label>
                        <br />
                        <div
                          className={`d-flex ${styles.cardImagesInPaymentMethodPage}`}
                        >
                          <img
                            src="https://tse3.mm.bing.net/th/id/OIP.VxB3xx5PMyI8JoGlcWNkHAHaGE?pid=Api&P=0&h=180"
                            alt="master card"
                            className={`img-fluid me-2 ${styles.cardImage}`}
                            style={{ width: "60px" }}
                          />
                          <img
                            src="https://tse2.mm.bing.net/th/id/OIP.Y6-wJg-HiIJqiI8nok881AHaFr?pid=Api&P=0&h=180"
                            alt="visa"
                            className={`img-fluid me-2 ${styles.cardImage}`}
                            style={{ width: "60px" }}
                          />
                          <img
                            src="https://tse4.mm.bing.net/th/id/OIP.Irq5hFtZ2RWq4_WZa__XZwHaHa?pid=Api&P=0&h=180"
                            alt="rupay"
                            className={`img-fluid me-2 ${styles.cardImage}`}
                            style={{ width: "50px" }}
                          />
                          <img
                            src="https://tse2.mm.bing.net/th/id/OIP.q5UpjKh-KMHUQUEtd09BJQHaHa?pid=Api&P=0&h=180"
                            alt="maestro"
                            className={`img-fluid me-2 ${styles.cardImage}`}
                            style={{ width: "50px" }}
                          />
                          <img
                            src="https://tse1.mm.bing.net/th/id/OIP.rNamf0fxtSx4i_wPGdjb2wHaHa?pid=Api&P=0&h=180"
                            alt="American Express"
                            className={`img-fluid me-2 ${styles.cardImage}`}
                            style={{ width: "50px" }}
                          />
                        </div>
                        <div style={{ display: `${isVisible ? "" : "none"}` }}>
                          <div className="d-flex align-items-start gap-3 mt-2">
                            <Link
                              className={`${styles.addCardBtn} ${styles.cursor_pointer}`}
                            >
                              <img
                                src={images.Plus}
                                alt="plusIcon"
                                className="img-fluid bg-white p-1"
                                style={{ width: "20px" }}
                                onClick={() =>
                                  setShowCard(showCard ? false : true)
                                }
                              />
                            </Link>
                            <img
                              src={images.Card}
                              alt="cardIcon"
                              style={{ width: "30px" }}
                              className={`${styles.AtmCardImg} ${styles.cursor_pointer}`}
                              onClick={() =>
                                setShowCard(showCard ? false : true)
                              }
                            />
                            <Link
                              className={`text-decoration-none fw-medium ${styles.AddCardLink} ${styles.cursor_pointer}`}
                              onClick={() =>
                                setShowCard(showCard ? false : true)
                              }
                            >
                              Add a new credit or debit card
                            </Link>
                            <Link
                              className={`text-decoration-none fw-medium ${styles.AddCardLink2} ${styles.cursor_pointer}`}
                              onClick={() =>
                                setShowCard(showCard ? false : true)
                              }
                            >
                              Add a new card
                            </Link>
                          </div>
                        </div>
                        <div
                          style={{
                            display: `${showCard ? "" : "none"}`,
                          }}
                          className={`card rounded position-absolute top-50 start-50 ${styles.AtmCardDetailsForm}`}
                        >
                          <div className="bg-light d-flex justify-content-between align-items-center p-3">
                            <h5 className={`${styles.floatingCardHeaderText}`}>
                              Add a new credit or debit card
                            </h5>
                            <img
                              src={images.Cross}
                              alt="crossIcon"
                              className={`img-fluid ${styles.floatingCardHeaderCrossBtn} ${styles.cursor_pointer}`}
                              style={{ width: "15px" }}
                              onClick={() =>
                                setShowCard(showCard ? false : true)
                              }
                            />
                          </div>
                          <div
                            className={`bg-white p-3 d-flex justify-content-between ${styles.floatingAddCardBody}`}
                          >
                            <div
                              className={`${styles.floatingAddCardForm}`}
                              style={{ width: "50%" }}
                            >
                              <label htmlFor="" className="fw-medium">
                                Card number
                              </label>
                              <input
                                type="text"
                                className={`rounded ${styles.floatingAddCardBodyInput}`}
                              />
                              <br
                                className={`${styles.floatingAddCardBodyBr}`}
                              />
                              <br
                                className={`${styles.floatingAddCardBodyBr}`}
                              />
                              <label htmlFor="" className="fw-medium">
                                Nickname
                              </label>
                              <input
                                type="text"
                                className={`rounded ${styles.floatingAddCardBodyInput}`}
                              />
                              <br
                                className={`${styles.floatingAddCardBodyBr}`}
                              />
                              <br
                                className={`${styles.floatingAddCardBodyBr}`}
                              />
                              <label htmlFor="" className="fw-medium">
                                Expiry date
                              </label>
                              <input
                                type="date"
                                className={`rounded ${styles.floatingAddCardBodyInput}`}
                              />
                            </div>
                            <div
                              className={`${styles.floatingAddCardBodyText}`}
                            >
                              <p>
                                Please ensure that you enable your card for
                                online payments from your bank’s app.
                              </p>
                              <div className="d-flex">
                                <img
                                  src="https://tse3.mm.bing.net/th/id/OIP.VxB3xx5PMyI8JoGlcWNkHAHaGE?pid=Api&P=0&h=180"
                                  alt="master card"
                                  className={`img-fluid me-2 ${styles.cardImage}`}
                                  style={{ width: "60px" }}
                                />
                                <img
                                  src="https://tse2.mm.bing.net/th/id/OIP.Y6-wJg-HiIJqiI8nok881AHaFr?pid=Api&P=0&h=180"
                                  alt="visa"
                                  className={`img-fluid me-2 ${styles.cardImage}`}
                                  style={{ width: "60px" }}
                                />
                                <img
                                  src="https://tse4.mm.bing.net/th/id/OIP.Irq5hFtZ2RWq4_WZa__XZwHaHa?pid=Api&P=0&h=180"
                                  alt="rupay"
                                  className={`img-fluid me-2 ${styles.cardImage}`}
                                  style={{ width: "50px" }}
                                />
                                <img
                                  src="https://tse2.mm.bing.net/th/id/OIP.q5UpjKh-KMHUQUEtd09BJQHaHa?pid=Api&P=0&h=180"
                                  alt="maestro"
                                  className={`img-fluid me-2 ${styles.cardImage}`}
                                  style={{ width: "50px" }}
                                />
                                <img
                                  src="https://tse1.mm.bing.net/th/id/OIP.rNamf0fxtSx4i_wPGdjb2wHaHa?pid=Api&P=0&h=180"
                                  alt="American Express"
                                  className={`img-fluid me-2 ${styles.cardImage}`}
                                  style={{ width: "50px" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="bg-light p-3">
                            <div className="text-end">
                              <button
                                className={`btn btn-white rounded-pill border border-black ${styles.cursor_pointer}`}
                                style={{
                                  fontSize: "12px",
                                }}
                                onClick={() =>
                                  setShowCard(showCard ? false : true)
                                }
                              >
                                Cancel
                              </button>
                              <button
                                className={`btn btn-warning rounded-pill ms-2 ${styles.cursor_pointer}`}
                                style={{
                                  fontSize: "12px",
                                }}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div
                      className="d-flex gap-3 align-items-start p-2 rounded"
                      style={{
                        backgroundColor: `${
                          isNetBanking ? "#FCF5EE" : "#F8F9FA"
                        }`,
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="Net Banking"
                        className={`${styles.cursor_pointer}`}
                        onClick={(e) => {
                          setPaymentMethod(e.target.value)
                          setIsCard(false)
                          setIsNetBanking(true)
                          setIsCashOnDelivery(false)
                          setVisible(false)
                        }}
                      />
                      <div>
                        <label htmlFor="netBanking" className="fw-medium mb-2">
                          Net Banking
                        </label>
                        <br />
                        <select
                          id="netBanking"
                          className={`rounded p-2 ${styles.BanksFacilitateNetBanking} ${styles.cursor_pointer}`}
                          style={{ width: "200px" }}
                        >
                          <option value="" className="fw-bold">
                            Choose an Option
                          </option>
                          <option value="" className="fw-medium">
                            Axis Bank
                          </option>
                          <option value="" className="fw-medium">
                            HDFC Bank
                          </option>
                          <option value="" className="fw-medium">
                            ICICI Bank
                          </option>
                          <option value="" className="fw-medium">
                            Kotak Bank
                          </option>
                          <option value="" className="fw-medium">
                            State Bank of India
                          </option>
                          <hr />
                          <option value="" className="fw-medium">
                            Allahabad Bank
                          </option>
                          <option value="" className="fw-medium">
                            Andhra Bank
                          </option>
                          <option value="" className="fw-medium">
                            Bank of India
                          </option>
                          <option value="" className="fw-medium">
                            Bank of Maharashtra
                          </option>
                          <option value="" className="fw-medium">
                            Canada Bank
                          </option>
                          <option value="" className="fw-medium">
                            Catholic Syrian Bank
                          </option>
                          <option value="" className="fw-medium">
                            Central Bank of India
                          </option>
                          <option value="" className="fw-medium">
                            City Union Bank
                          </option>
                          <option value="" className="fw-medium">
                            Corporation Bank
                          </option>
                          <option value="" className="fw-medium">
                            Cosmos Bank
                          </option>
                          <option value="" className="fw-medium">
                            DCB Bank Ltd
                          </option>
                          <option value="" className="fw-medium">
                            Deutsche Bank
                          </option>
                          <option value="" className="fw-medium">
                            Dhanlakshmi Bank
                          </option>
                          <option value="" className="fw-medium">
                            Federal Bank
                          </option>
                          <option value="" className="fw-medium">
                            IDBI Bank
                          </option>
                          <option value="" className="fw-medium">
                            IDFC FIRST Bank
                          </option>
                          <option value="" className="fw-medium">
                            ING Vysya Bank
                          </option>
                          <option value="" className="fw-medium">
                            Indian Bank
                          </option>
                          <option value="" className="fw-medium">
                            Indian Overseas Bank
                          </option>
                          <option value="" className="fw-medium">
                            Indusind Bank
                          </option>
                          <option value="" className="fw-medium">
                            Jammu Kashmir Bank
                          </option>
                          <option value="" className="fw-medium">
                            Janata Sahakari Bank
                          </option>
                          <option value="" className="fw-medium">
                            Karnataka Bank LTD.
                          </option>
                          <option value="" className="fw-medium">
                            kARUR Vysya Bank
                          </option>
                          <option value="" className="fw-medium">
                            Laxmi Vilas Bank
                          </option>
                          <option value="" className="fw-medium">
                            Oriental Bank of Commerce
                          </option>
                          <option value="" className="fw-medium">
                            PNB YUVA Netbanking
                          </option>
                          <option value="" className="fw-medium">
                            Punjab National Bank
                          </option>
                          <option value="" className="fw-medium">
                            Saraswat Bank
                          </option>
                          <option value="" className="fw-medium">
                            Shamrao Vitthal Co-operative Bank
                          </option>
                          <option value="" className="fw-medium">
                            South Indian Bank
                          </option>
                          <option value="" className="fw-medium">
                            Standard Chartered Bank
                          </option>
                          <option value="" className="fw-medium">
                            State bank of Jaipur
                          </option>
                          <option value="" className="fw-medium">
                            State bank of Hydrabad
                          </option>
                          <option value="" className="fw-medium">
                            State bank of Mysore
                          </option>
                          <option value="" className="fw-medium">
                            State bank of Patiala
                          </option>
                          <option value="" className="fw-medium">
                            Syndicate Bank
                          </option>
                          <option value="" className="fw-medium">
                            Tamilnad Mercantile Bank LTD.
                          </option>
                          <option value="" className="fw-medium">
                            Union Bank of India
                          </option>
                          <option value="" className="fw-medium">
                            United Bank of India
                          </option>
                          <option value="" className="fw-medium">
                            Yes Bank Ltd
                          </option>
                          <option value="" className="fw-medium">
                            Airtal Digital Bank
                          </option>
                          <option value="" className="fw-medium">
                            Jio Digital Bank
                          </option>
                        </select>
                      </div>
                    </div>
                    <br />
                    <div
                      className="d-flex gap-3 align-items-start p-2 rounded"
                      style={{
                        backgroundColor: `${
                          isCashOnDelivery ? "#FCF5EE" : "#F8F9FA"
                        }`,
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="Cash on Delivery/Pay on Delivery"
                        className={`${styles.cursor_pointer}`}
                        onClick={(e) => {
                          setPaymentMethod(e.target.value)
                          setIsCard(false)
                          setIsNetBanking(false)
                          setIsCashOnDelivery(true)
                          setVisible(false)
                        }}
                      />
                      <div>
                        <label
                          className={`fw-medium ${styles.paymentViaCashOnDeliveryLabel}`}
                        >
                          Cash on Delivery/Pay on Delivery
                        </label>
                        <p
                          className={`my-0 ${styles.paymentViaCashOnDeliveryText}`}
                        >
                          Cash, UPI and Cards accepted.
                        </p>
                      </div>
                    </div>
                    {Products && Products.length === 0 ? (
                      <Link
                        to="/cart"
                        className={`btn btn-warning rounded-pill mt-4 px-4 ${styles.useThisPaymentMethodBtn}`}
                      >
                        Use this payment method
                      </Link>
                    ) : (
                      paymentMethod && (
                        <button
                          className={`btn btn-warning rounded-pill mt-4 px-4 ${styles.useThisPaymentMethodBtn}`}
                          onClick={() => {
                            const order = {
                              id: Number(
                                Date.now().toString() +
                                  Math.floor(Math.random() * 1000),
                              ),
                              item: Products,
                              address,
                              paymentMethod,
                              deliveryCharge,
                              orderDate: getOrderDate(),
                              orderTime: setDeliveryTime(),
                              deliveryDate: setDeliveryDate(),
                              deliveryDay: getDeliveryDay(),
                              totalPrice: Math.round(totalPrice),
                              userId,
                            }
                            orders.push(order)
                            setOrders(orders)
                            selectPaymentMethod(true)
                          }}
                        >
                          Use this payment method
                        </button>
                      )
                    )}
                  </div>
                </div>
              </section>
            )}
            {isPaymentMethodSelected && (
              <section
                className={`bg-light mt-4 p-4 d-flex fs-5 align-items-center ${styles.couponSection}`}
              >
                <input
                  type="text"
                  className={`form-control ${styles.couponSectionInput}`}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <label
                  htmlFor=""
                  className={`form-lavel fw-medium text-secondary ${styles.couponSectionLabel}`}
                >
                  Have you any coupon?
                </label>
              </section>
            )}
            {isPaymentMethodSelected && (
              <section
                className={`bg-light mt-4 p-4 d-flex gap-3 fs-5 ${styles.placeYourOrderSection}`}
              >
                {isOrderPlaced ? (
                  <Link
                    to="/yourOrders"
                    className={`btn btn-warning rounded-pill px-4 ${styles.placeYourOrderBtn}`}
                  >
                    See your orders
                  </Link>
                ) : (
                  <button
                    className={`btn btn-warning rounded-pill px-4 ${styles.placeYourOrderBtn}`}
                    onClick={placeOrder}
                  >
                    Place your order
                  </button>
                )}

                <p
                  className={`fw-bold my-0 text-center ${styles.orderTotalPlaceOrderSection}`}
                >
                  Order Total: ₹
                  {totalPrice && totalOrder
                    ? Math.round(
                        totalPrice -
                          (coupon === "HAPPYDIWALI" ? totalOrder / 10 : 0),
                      )
                    : 0}
                </p>
              </section>
            )}
          </div>
          <section
            className={`bg-light p-3 ${styles.paymentMethodSectionTwo} mt-5 mt-lg-0 position-sticky top-0`}
          >
            <div>
              <p className="my-0 w-50 fw-medium d-inline-block">Items: </p>
              <p className="my-0 w-50 fw-medium d-inline-block text-end">
                ₹{Math.round(totalOrder)}
              </p>
            </div>
            <div>
              <p className="my-0 w-50 fw-medium d-inline-block">Delivery: </p>
              <p className="my-0 w-50 fw-medium d-inline-block text-end">
                ₹{DeliveryCharge ? DeliveryCharge : 0}
              </p>
            </div>
            <div>
              <p className="my-0 w-50 fw-medium d-inline-block text-success">
                Free Delivery:
              </p>
              <p className="my-0 w-50 fw-medium d-inline-block text-end text-success">
                -₹{freeDelivery ? freeDelivery : 0}
              </p>
            </div>
            {isCashOnDelivery && (
              <div>
                <p className="my-0 w-50 fw-medium d-inline-block">
                  Cash On Delivery Charge:{" "}
                </p>
                <p className="my-0 w-50 fw-medium d-inline-block text-end">
                  ₹10
                </p>
              </div>
            )}
            <div>
              <p className="my-0 w-50 fw-medium d-inline-block">Total: </p>
              <p className="my-0 w-50 fw-medium d-inline-block text-end">
                ₹{totalPrice ? Math.round(totalPrice) : 0}
              </p>
            </div>
            {coupon === "HAPPYDIWALI" && (
              <div>
                <p className="my-0 w-50 fw-medium d-inline-block text-success">
                  Sale:
                </p>
                <p className="my-0 w-50 fw-medium d-inline-block text-end text-success">
                  -₹
                  {Math.round(coupon === "HAPPYDIWALI" ? totalOrder / 10 : 0)}
                </p>
              </div>
            )}
            <hr />
            <div>
              <p className="my-0 w-50 fw-medium d-inline-block fs-5">
                Order Total:
              </p>
              <p className="my-0 w-50 fw-medium d-inline-block fs-5 text-end">
                ₹
                {totalPrice
                  ? Math.round(
                      totalPrice -
                        (coupon === "HAPPYDIWALI" ? totalOrder / 10 : 0),
                    )
                  : 0}
              </p>
            </div>
          </section>
        </main>
      )}

      <Footer />
    </>
  )
}
