import styles from "../style_modules/pages_modules/YourOrders.module.css"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import RatingBar from "../components/RatingBar"
import { useState } from "react"
import { toast } from "react-toastify"
import { useEffect } from "react"
import {
  fetchUserById,
  fetchAllOrdersByUserId,
  deleteOrderById,
} from "../services/FetchRequests"
import YourOrdersShimmer from "../shimmers/YourOrders.shimmer"
import Footer from "../components/Footer"
import GetUserId from "../services/GetClothsData"
import Error from "../components/Error"

export default function YourOrders() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")

  /* isClicked useState is used to show user's selected address 
  while user click on user's name on your orders page */
  const [isClicked, setClicked] = useState(false)

  /* isUpdated useState is used to if user cancel any order 
  then variables present on this page will reinitialize */
  const [isUpdated, setUpdated] = useState(false)

  const [allOrders, setAllOrders] = useState([])
  const orders = allOrders || []

  const userId = GetUserId()
  const [user, setUser] = useState(null)

  async function fetchData(setLoading, setIsError) {
    try {
      setLoading(true)

      await fetchUserById(userId, setUser, setIsError)
      await fetchAllOrdersByUserId(userId, setAllOrders, setIsError)
      if (isUpdated) {
        setUpdated(false)
      }
    } catch (error) {
      console.error(error)
      setIsError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(setLoading, setIsError)
  }, [isUpdated])

  if (isError) {
    return <Error />
  }

  return (
    <>
      {loading || !orders ? (
        <YourOrdersShimmer />
      ) : (
        <>
          <Header
            position="static"
            top="auto"
            zIndex="auto"
            isSearchBarNeeded={false}
            userDetails={user}
          />
          <main className="container mt-3">
            <h1>Your Orders</h1>
            {orders &&
              orders.map((order) => (
                <div key={order.id}>
                  <div className="ms-auto d-md-none fw-medium">
                    <div style={{ fontSize: "13px" }}>
                      <span>ORDER </span>
                      <span>#{order.id}</span>
                    </div>
                    <Link
                      to={`/orderDetails/${order.id}`}
                      className={`text-decoration-none ${styles.viewOrderDetailsYourOrders}`}
                      style={{ fontSize: "14px" }}
                    >
                      View order details
                    </Link>
                  </div>
                  <div className={`${styles.shipTo} fw-medium mt-2`}>
                    <p className="my-0" style={{ fontSize: "13px" }}>
                      SHIP TO
                    </p>
                    <p
                      className={`my-0 text-primary ${styles.userAddressFloatingCard}`}
                      style={{ fontSize: "14px" }}
                      onClick={() => setClicked(isClicked ? false : true)}
                    >
                      {user && user.name} <i className="bi bi-chevron-down"></i>
                    </p>
                    {isClicked && (
                      <div
                        className="bg-light p-2 border border-secondary-subtle position-absolute rounded"
                        style={{ width: "150px", fontSize: "13px", zIndex: 1 }}
                      >
                        <p className="my-0">{order.address.localInfo}</p>
                        <p className="my-0">{order.address.area}</p>
                        <p className="my-0">
                          {order.address.city}, {order.address.state},{" "}
                          {order.address.pinCode}
                        </p>
                        <p className="my-0">{order.address.country}</p>
                      </div>
                    )}
                  </div>
                  <div className={`mt-2 ${styles.totalOrder}`}>
                    <p className="my-0 fw-medium" style={{ fontSize: "13px" }}>
                      TOTAL
                    </p>
                    <p className="my-0 fw-medium" style={{ fontSize: "14px" }}>
                      ₹{order.totalPrice}
                    </p>
                  </div>
                  <div className="card my-3">
                    <div className="bg-light p-3 rounded d-flex gap-5">
                      <div>
                        <p
                          className="my-0 fw-medium"
                          style={{ fontSize: "13px" }}
                        >
                          ORDER PLACED
                        </p>
                        <p
                          className="my-0 fw-medium"
                          style={{ fontSize: "14px" }}
                        >
                          {order.orderDate}
                        </p>
                      </div>
                      <div className={`${styles.totalOrderCard}`}>
                        <p
                          className="my-0 fw-medium"
                          style={{ fontSize: "13px" }}
                        >
                          TOTAL
                        </p>
                        <p
                          className="my-0 fw-medium"
                          style={{ fontSize: "14px" }}
                        >
                          ₹{order.totalPrice}
                        </p>
                      </div>
                      <div className={`${styles.shipToCard}`}>
                        <p
                          className="my-0 fw-medium"
                          style={{ fontSize: "13px" }}
                        >
                          SHIP TO
                        </p>
                        <p
                          className={`my-0 text-primary fw-medium ${styles.userAddressFloatingCard}`}
                          style={{ fontSize: "14px" }}
                          onClick={() => setClicked(isClicked ? false : true)}
                        >
                          {user && user.name}{" "}
                          <i className="bi bi-chevron-down"></i>
                        </p>
                        {isClicked && (
                          <div
                            className="bg-light p-2 border border-secondary-subtle position-absolute rounded"
                            style={{
                              width: "150px",
                              fontSize: "13px",
                              zIndex: 1,
                            }}
                          >
                            <p className="my-0">{order.address.localInfo}</p>
                            <p className="my-0">{order.address.area}</p>
                            <p className="my-0">
                              {order.address.city}, {order.address.state},{" "}
                              {order.address.pinCode}
                            </p>
                            <p className="my-0">{order.address.country}</p>
                          </div>
                        )}
                      </div>
                      <div className="ms-auto d-none d-md-block fw-medium">
                        <div style={{ fontSize: "13px" }}>
                          <span>ORDER </span>
                          <span># {order.id}</span>
                        </div>
                        <Link
                          to={`/orderDetails/${order.id}`}
                          className={`text-decoration-none ${styles.viewOrderDetailsYourOrders}`}
                          style={{ fontSize: "14px" }}
                        >
                          View order details
                        </Link>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="my-0 fs-6 fw-bold text-success">
                        Arriving {order.deliveryDay}
                      </p>
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mt-3">
                        <div className="d-flex flex-column gap-4">
                          {order.item.map((product) => (
                            <div
                              key={product.id}
                              className={`d-flex gap-3 align-items-start ${styles.productYourOrder}`}
                            >
                              <img
                                src={product.url}
                                alt="productImage"
                                className="img-fluid"
                                style={{
                                  minWidth: "135px",
                                  maxWidth: "135px",
                                  height: "200px",
                                }}
                              />
                              <div>
                                <p className="my-0 fw-medium">
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
                                  {product.name.length > 61
                                    ? product.name.slice(0, 60).concat("...")
                                    : product.name}
                                </p>
                                <div className="d-flex align-items-end">
                                  <RatingBar rating={product.rating} />
                                  <span className="ms-1">
                                    {" "}
                                    {product.rating}
                                  </span>
                                </div>
                                <p className="mt-0 mb-1">
                                  <b>Price:</b> ₹
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
                                </p>
                                <p className="my-0 text-secondary fs-6 fw-medium">
                                  {Number(product.offer.replace("%", ""))
                                    ? product.offer
                                    : product.discount}{" "}
                                  off
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div
                          className="d-flex flex-column gap-2"
                          style={{ minWidth: "170px" }}
                        >
                          <Link
                            to={`/editOrder/${order.id}`}
                            className="btn btn-warning rounded-pill"
                          >
                            View or edit order
                          </Link>
                          <button
                            className="btn btn-outline-danger rounded-pill"
                            onClick={async () => {
                              try {
                                const result = await deleteOrderById(
                                  order.id,
                                  setIsError,
                                )
                                if (result) {
                                  setUpdated(true)
                                  toast("Order deleted successfully")
                                }
                              } catch (error) {
                                console.error(error)
                                setIsError(error.message)
                              }
                            }}
                          >
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                </div>
              ))}
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
