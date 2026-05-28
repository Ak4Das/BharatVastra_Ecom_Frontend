import styles from "../style_modules/pages_modules/OrderDetails.module.css"
import Header from "../components/Header"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import RatingBar from "../components/RatingBar"
import { toast } from "react-toastify"
import {
  fetchUserById,
  fetchOrderByOrderId,
  deleteOrderById,
} from "../services/FetchRequests"
import OrderDetailsShimmer from "../shimmers/OrderDetails.shimmer"
import Footer from "../components/Footer"
import GetUserId from "../services/GetClothsData"
import Error from "../components/Error"

export default function OrderDetails() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const id = Number(useParams().id)

  const [order, setOrder] = useState([])

  const userId = GetUserId()
  const [user, setUser] = useState(null)

  /* isUpdated useState is used only to update the variables on this page 
  while user will cancel any order */
  const [isUpdated, setUpdated] = useState(false)

  const totalOrder =
    order &&
    order.length &&
    order[0].item.reduce(
      (acc, curr) =>
        acc +
        (curr.price -
          (curr.price / 100) *
            (Number(curr.offer.replace("%", ""))
              ? Number(curr.offer.replace("%", ""))
              : Number(curr.discount.replace("%", "")))) *
          (curr.quantity ? curr.quantity : 1),
      0,
    )

  const deliveryCharge =
    order &&
    order.length &&
    Math.round(
      order[0].item.reduce(
        (acc, curr) => acc + (curr.freeDelivery ? 0 : curr.deliveryCharge),
        0,
      ) / order[0].item.length,
    )

  const cashOnDeliveryCharge =
    order &&
    order.length &&
    order[0].paymentMethod === "Cash on Delivery/Pay on Delivery"
      ? 10
      : 0

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        const user = await fetchUserById(userId, setUser, setIsError)
        await fetchOrderByOrderId(id, setOrder, setIsError)
        if (isUpdated) {
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
    fetchData()
  }, [isUpdated])

  if (isError) {
    return <Error />
  }

  return (
    <>
      {loading || !order ? (
        <OrderDetailsShimmer />
      ) : (
        <>
          <Header
            position="static"
            top="auto"
            zIndex="auto"
            isSearchBarNeeded={false}
            userDetails={user}
          />
          {order && order.length !== 0 && (
            <>
              <main className="py-3" style={{ fontSize: "15px" }}>
                <div
                  className={`mx-auto ${styles.orderDetailsContainer}`}
                  style={{ maxWidth: "960px" }}
                >
                  <h1>Order Details</h1>
                  <div className="d-md-flex align-items-center gap-3">
                    <p className="my-0 fw-medium" style={{ fontSize: "13px" }}>
                      Order placed {order[0].orderDate}
                    </p>
                    <span className="d-none d-md-inline"> | </span>
                    <p className="my-0 fw-medium" style={{ fontSize: "14px" }}>
                      Order ID # {order[0].id}
                    </p>
                  </div>
                  <div className="card p-3 mt-3 flex-lg-row gap-3 bg-light">
                    <div style={{ maxWidth: "200px" }}>
                      <p className="my-0 fw-bold">Ship to</p>
                      <div
                        className="my-0 fw-medium"
                        style={{ fontSize: "14px" }}
                      >
                        <p className="my-0">{order[0].address.localInfo}</p>
                        <p className="my-0">{order[0].address.area}</p>
                        <p className="my-0">
                          {order[0].address.city}, {order[0].address.state},{" "}
                          {order[0].address.pinCode}
                        </p>
                        <p className="my-0">{order[0].address.country}</p>
                      </div>
                    </div>
                    <div>
                      <p className="my-0 fw-bold">Payment method</p>
                      <p className="my-0 fw-medium">{order[0].paymentMethod}</p>
                    </div>
                    <div className="ms-lg-auto">
                      <p className="my-0 fw-bold">Order Summary</p>
                      <div
                        className={`${styles.orderDetailsBill}`}
                        style={{ fontSize: "14px" }}
                      >
                        <div>
                          <p className="my-0 w-75 fw-medium d-inline-block">
                            Item(s) Subtotal:{" "}
                          </p>
                          <p className="my-0 w-25 fw-medium d-inline-block text-end">
                            ₹{Math.round(totalOrder)}
                          </p>
                        </div>
                        <div>
                          <p className="my-0 w-75 fw-medium d-inline-block">
                            Shipping:{" "}
                          </p>
                          <p className="my-0 w-25 fw-medium d-inline-block text-end">
                            ₹{deliveryCharge}
                          </p>
                        </div>
                        {cashOnDeliveryCharge ? (
                          <div>
                            <p className="my-0 w-75 fw-medium d-inline-block">
                              Cash On Delivery Charge:{" "}
                            </p>
                            <p className="my-0 w-25 fw-medium d-inline-block text-end">
                              ₹{cashOnDeliveryCharge}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                        <div>
                          <p className="my-0 w-75 fw-medium d-inline-block">
                            Total:{" "}
                          </p>
                          <p className="my-0 w-25 fw-medium d-inline-block text-end">
                            ₹
                            {Math.round(
                              totalOrder +
                                deliveryCharge +
                                cashOnDeliveryCharge,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="my-0 w-75 fw-medium d-inline-block text-success">
                            Free Delivery:
                          </p>
                          <p className="my-0 w-25 fw-medium d-inline-block text-end text-success">
                            -₹0
                          </p>
                        </div>
                        <div>
                          <p className="my-0 w-50 fw-medium d-inline-block text-success">
                            Sale:
                          </p>
                          <p className="my-0 w-50 fw-medium d-inline-block text-end text-success">
                            -{order[0].sale ? order[0].sale : "0%"}
                          </p>
                        </div>
                        <div>
                          <p className="my-0 w-75 fw-medium d-inline-block">
                            Order Total:
                          </p>
                          <p className="my-0 w-25 fw-medium d-inline-block text-end">
                            ₹{Math.round(order[0].totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border border-secondary-subtle rounded bg-white p-3 mt-3">
                    <p className="my-0 fs-5 fw-bold text-success">
                      Arriving {order[0].deliveryDay}
                    </p>
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mt-3">
                      <div className="d-flex flex-column gap-4">
                        {order[0].item.map((product) => (
                          <div
                            key={product.id}
                            className={`d-flex gap-3 align-items-start ${styles.productYourOrder}`}
                          >
                            <img
                              src={product.url}
                              alt=""
                              className="img-fluid"
                              style={{
                                minWidth: "135px",
                                maxWidth: "135px",
                                height: "200px",
                              }}
                            />
                            <div>
                              <p className="my-0 fw-medium text-secondary">
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
                                <span
                                  style={{ fontSize: "15px" }}
                                  className="ms-1 text-success"
                                >
                                  {product.rating}
                                </span>
                              </div>
                              <div className="mt-0 mb-0 fw-medium text-success">
                                <span className="fw-bold text-secondary">
                                  Price:{" "}
                                </span>
                                <span className="mt-2 fw-medium">
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
                                <span className="ms-2 fw-medium">
                                  (-
                                  {Number(product.offer.replace("%", ""))
                                    ? product.offer
                                    : product.discount}
                                  )
                                </span>
                              </div>
                              <p className="mt-0 mb-0 fw-medium text-success">
                                <b className="text-secondary">Quantity: </b>
                                {product.quantity}
                              </p>
                              <p className="my-0 fs-6 fw-medium text-success">
                                <b className="text-secondary">Size: </b>
                                {product.size}
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
                          to={`/editOrder/${order[0].id}`}
                          className="btn btn-warning rounded-pill"
                        >
                          View or edit order
                        </Link>
                        <button
                          className="btn btn-outline-danger rounded-pill"
                          onClick={async () => {
                            const result = await deleteOrderById(
                              order[0].id,
                              setIsError,
                            )
                            if (result) {
                              setUpdated(true)
                              toast("Order deleted successfully")
                            }
                          }}
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
              <Footer />
            </>
          )}
        </>
      )}
    </>
  )
}
