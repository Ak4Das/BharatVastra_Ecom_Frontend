import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { fetchUserById, updateAddressOfUser } from "../services/FetchRequests"
import GetUserId from "../services/GetClothsData"
import Error from "../components/Error"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { toast } from "react-toastify"

export default function AddAddressForm() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const id = Number(useParams().id)

  const userId = GetUserId()
  const [user, setUser] = useState(null)
  const [isUpdated, setUpdated] = useState(false)

  const address = user && user.address[id]
  const [fullName, setFullName] = useState("")
  const [mobNo, setMobNo] = useState("")
  const [pinCode, setPinCode] = useState("")
  const [localInfo, setLocalInfo] = useState("")
  const [area, setArea] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  async function handleSubmit(e) {
    const form = document.getElementById("addAddressForm");
    try {
      e.preventDefault()
      const Address = {
        country: "India",
        fullName,
        mobNo,
        pinCode,
        localInfo,
        area,
        city,
        state,
      }

      Address.id = address ? id : user.address.length
      address ? (user.address[id] = Address) : user.address.push(Address)
      await updateAddressOfUser(userId, user.address, undefined, setIsError)
      form.reset()
      toast("Address added successfully")
    } catch (error) {
      console.error(error)
      setIsError(error.message)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        const user = await fetchUserById(userId, setUser, setIsError)
        const address = id >= 0 && user.address[id]
        address && setFullName(address.fullName)
        address && setMobNo(address.mobNo)
        address && setPinCode(address.pinCode)
        address && setLocalInfo(address.localInfo)
        address && setArea(address.area)
        address && setCity(address.city)
        address && setState(address.state)
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
    fetchData()
  }, [isUpdated])

  if (isError) {
    return <Error />
  }

  return (
    <>
      {loading || !user ? (
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
          <main className="container my-5">
            <h2>Add a new address</h2>
            <form onSubmit={handleSubmit} id="addAddressForm" className="mt-3">
              <label htmlFor="country" className="form-label">
                Country/Region
              </label>
              <br />
              <input
                id="country"
                type="text"
                className="w-100 form-control"
                defaultValue="India"
              />
              <br />
              <label htmlFor="fullName" className="form-label">
                Full name (First and Last name)
              </label>
              <br />
              <input
                id="fullName"
                type="text"
                className="w-100 form-control"
                defaultValue={address ? address.fullName : ""}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <br />
              <label htmlFor="mobileNo" className="form-label">
                Mobile number
              </label>
              <br />
              <input
                id="mobileNo"
                type="text"
                className="w-100 form-control"
                defaultValue={address ? address.mobNo : ""}
                onChange={(e) => setMobNo(e.target.value)}
                required
              />
              <br />
              <label htmlFor="pinCode" className="form-label">
                Pincode
              </label>
              <br />
              <input
                id="pinCode"
                type="text"
                className="w-100 form-control"
                defaultValue={address ? address.pinCode : ""}
                onChange={(e) => setPinCode(e.target.value)}
                required
              />
              <br />
              <label htmlFor="localInfo" className="form-label">
                Flat, House no., Building, Company, Apartment
              </label>
              <br />
              <input
                id="localInfo"
                type="text"
                className="w-100 form-control"
                defaultValue={address ? address.localInfo : ""}
                onChange={(e) => setLocalInfo(e.target.value)}
                required
              />
              <br />
              <label htmlFor="area" className="form-label">
                Area, Street, Sector, Village
              </label>
              <br />
              <input
                id="area"
                type="text"
                className="w-100 form-control"
                defaultValue={address ? address.area : ""}
                onChange={(e) => setArea(e.target.value)}
                required
              />
              <br />
              <label htmlFor="city" className="form-label">
                Town/City
              </label>
              <br />
              <input
                id="city"
                type="text"
                className="w-100 form-control"
                defaultValue={address ? address.city : ""}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <br />
              <label htmlFor="state" className="form-label">
                State
              </label>
              <br />
              <input
                id="state"
                type="text"
                className="w-100 form-control"
                defaultValue={address ? address.state : ""}
                onChange={(e) => setState(e.target.value)}
                required
              />
              <br />
              {fullName &&
              mobNo &&
              pinCode &&
              localInfo &&
              area &&
              city &&
              state ? (
                <button
                  className="btn btn-warning rounded-pill mt-3"
                  type="submit"
                >
                  {address ? "Edit Address" : "Add Address"}
                </button>
              ) : (
                <button
                  className="btn btn-warning rounded-pill mt-3"
                  type="button"
                >
                  {address ? "Edit Address" : "Add Address"}
                </button>
              )}
            </form>
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
