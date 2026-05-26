import styles from "../style_modules/pages_modules/UserAddresses.module.css"
import Header from "../components/Header"
import Plus from "../assets/images/plus.png"
import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { fetchUserById, updateAddressOfUser } from "../services/FetchRequests"
import Footer from "../components/Footer"
import GetUserId from "../services/GetClothsData"
import Error from "../components/Error"

export default function UserAddresses() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const param = useParams()
  const userId = GetUserId()
  const [user, setUser] = useState(null)
  const [isUpdated, setUpdated] = useState(false)

  async function updateAddress(userId, addresses) {
    try {
      await updateAddressOfUser(
        userId,
        addresses,
        undefined,
        setIsError,
        setUpdated,
      )
    } catch (error) {
      console.error(error)
      setIsError(error.message)
    }
  }

  if (user && user.address.length) {
    const selectedAddress = user.address.find((address) => address.selected)
    if (!selectedAddress) {
      user.address[0].selected = true
      updateAddress(userId, user.address)
    }
  }
  async function removeAddress(e) {
    try {
      user.address = user.address.filter(
        (address) => address.id !== Number(e.target.value),
      )
      await updateAddressOfUser(
        userId,
        user.address,
        undefined,
        setIsError,
        setUpdated,
      )
    } catch (error) {
      console.error(error)
      setIsError(error.message)
    }
  }

  async function fetchData(setLoading, setIsError) {
    try {
      setLoading(true)

      await fetchUserById(userId, setUser, setIsError)
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
      {loading ? (
        <div
          className="d-flex flex-column align-items-center justify-content-center gap-3 bg-dark-subtle text-dark fw-bold fs-1"
          style={{ width: "100vw", height: "100vh" }}
        >
          Loading
        </div>
      ) : (
        <>
          <Header
            position="static"
            top="auto"
            zIndex="auto"
            isSearchBarNeeded={false}
            userDetails={user}
          />
          <main>
            <div className="container mt-3">
              <h2>Your Addresses</h2>
              <div className="row row-gap-4 mt-4">
                <div className={`col-sm-6 col-lg-4 ${styles.addAddressBtn1}`}>
                  <Link
                    to="/addAddress"
                    className="card align-items-center justify-content-center text-decoration-none text-dark"
                    style={{
                      height: "300px",
                      border: "3px dashed black",
                    }}
                  >
                    <div className="text-center">
                      <img
                        src={Plus}
                        alt="plusIcon"
                        style={{ width: "30px" }}
                      />
                      <h4 className="mt-2">Add Address</h4>
                    </div>
                  </Link>
                </div>
                {user &&
                  user.address.length !== 0 &&
                  user.address.map((address) => (
                    <div
                      key={address.id}
                      className="col-sm-6 col-lg-4 text-decoration-none"
                      onClick={async () => {
                        try {
                          let Address = user.address.find(
                            (add) => add.id === address.id,
                          )
                          for (address of user.address) {
                            if (address === Address) {
                              address.selected = true
                            } else {
                              address.selected = false
                            }
                          }
                          await updateAddressOfUser(
                            userId,
                            user.address,
                            undefined,
                            setIsError,
                            setUpdated,
                          )
                        } catch (error) {
                          console.error(error)
                          setIsError(error.message)
                        }
                      }}
                    >
                      <div
                        className="card"
                        style={{
                          height: "300px",
                          border: "3px solid black",
                        }}
                      >
                        <div className="card-body d-flex flex-column justify-content-between">
                          <div>
                            <p className="my-0 fw-bold">{address.fullName}</p>
                            <p className="my-0 fw-medium">
                              {address.localInfo}
                            </p>
                            <p className="my-0 fw-medium">{address.area}</p>
                            <p className="my-0 fw-medium">
                              {address.city.toUpperCase()}
                              {", "}
                              {address.state.toUpperCase()}{" "}
                              {address.pinCode.toUpperCase()}
                            </p>
                            <p className="my-0 fw-medium">
                              {address.country.toUpperCase()}
                            </p>
                            <p className="my-0 fw-medium">
                              Phone Number: {address.mobNo}
                            </p>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <Link
                                to={`/editAddress/${address.id}`}
                                className={`text-decoration-none border border-0 bg-white me-1 fw-medium text-primary ${styles.addressEditOrRemove}`}
                                style={{ cursor: "pointer" }}
                              >
                                Edit
                              </Link>
                              <span className="fw-medium text-primary">|</span>
                              <button
                                className={`border border-0 bg-white ms-1 fw-medium text-primary ${styles.addressEditOrRemove}`}
                                style={{ cursor: "pointer" }}
                                value={address.id}
                                onClick={removeAddress}
                              >
                                Remove
                              </button>
                            </div>
                            <div
                              className="text-primary fw-bold"
                              style={{ fontSize: "20px" }}
                            >
                              {address.selected && (
                                <i className="bi bi-check2-all"></i>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {param.orderId && (
                <Link
                  to={`/editOrder/${param.orderId}`}
                  className="btn btn-warning mt-5 mb-3"
                >
                  <i className="bi bi-arrow-left"></i>
                  Back
                </Link>
              )}
              {param.route && user && !!user.address.length && (
                <Link
                  to={`/${param.route}`}
                  className="btn btn-warning mt-5 mb-3"
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back
                </Link>
              )}
            </div>
            <div
              className={`fs-3 position-fixed ${styles.addAddressBtn2} rounded-circle bg-warning`}
              style={{
                right: "30px",
                top: "86%",
                width: "50px",
                height: "50px",
                overflow: "hidden",
                border: "2px dashed black",
              }}
              title="Add new address"
            >
              <Link
                to="/addAddress"
                className="d-flex align-items-center justify-content-center text-decoration-none text-dark d-inline-block px-2 py-1"
              >
                <i className="bi bi-plus-lg"></i>
              </Link>
            </div>
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
