import styles from "./style_modules/pages_modules/App.module.css"
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap-icons/font/bootstrap-icons.css"
import Header from "./components/Header"
import { Link } from "react-router-dom"
import { useState } from "react"
import BharatVastra from "./assets/images/BharatVastra.png"
import JHALAR from "./assets/images/jhalar.png"
import DEEPAK from "./assets/images/deepak.png"
import backgroundImage from "./assets/images/backgroundImage.png"
import LakshmiMaaAndGaneshJi from "./assets/images/LakshmiMaaAndGaneshJi.png"
import LINE from "./assets/images/line.png"
import saree1 from "./assets/images/saree1.png"
import saree2 from "./assets/images/saree2.png"
import diwaliDecoration1 from "./assets/images/diwaliDecoration1.png"
import diwaliDecoration2 from "./assets/images/diwaliDecoration2.png"
import diwaliDecoration3 from "./assets/images/diwaliDecoration3.png"
import diwaliDecoration7 from "./assets/images/diwaliDecoration7.png"
import diwaliDecoration8 from "./assets/images/diwaliDecoration8.png"
import diwaliDecoration9 from "./assets/images/diwaliDecoration9.png"
import diwaliDecoration10 from "./assets/images/diwaliDecoration10.png"
import diwaliDecoration13 from "./assets/images/diwaliDecoration13.png"
import diwaliDecoration14 from "./assets/images/diwaliDecoration14.png"
import diwaliDecoration15 from "./assets/images/diwaliDecoration15.png"
import offer from "./assets/images/offer.png"
import offer2 from "./assets/images/offer2.png"
import offer3 from "./assets/images/offer3.png"
import menWearCoat1 from "./assets/images/menWearCoat1.png"
import menWearCoat2 from "./assets/images/menWearCoat2.png"
import menWearCoat3 from "./assets/images/menWearCoat3.png"
import womenWearLahenga1 from "./assets/images/womenWearLahenga1.png"
import womenWearLahenga2 from "./assets/images/womenWearLahenga2.png"
import womenWearLahenga3 from "./assets/images/womenWearLahenga3.png"
import shoe1 from "./assets/images/shoe1.png"
import goldenRibbon from "./assets/images/goldenRibbon.png"
import menWearShoe from "./assets/images/menWearShoe.png"
import SearchInPage from "./components/SearchInPage"
import { useEffect } from "react"
import { fetchAllCategories, fetchUserById } from "./services/FetchRequests.js"
import AppShimmer from "./shimmers/App.shimmer.jsx"
import Footer from "./components/Footer.jsx"
import GetUserId from "./services/GetClothsData.js"
import Error from "./components/Error.jsx"

export default function App() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const [search, setSearch] = useState("")
  const [show, setShow] = useState(true)
  setTimeout(() => {
    setShow(false)
  }, 1500)

  const userId = GetUserId()
  const [user, setUser] = useState(null)
  const [category, setCategory] = useState([])

  const filteredCategory = search
    ? category.filter((category) =>
        category.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      )
    : category

  async function fetchData(setLoading, setIsError) {
    try {
      setLoading(true)
      if (userId) {
        await fetchUserById(userId, setUser, setIsError)
      }
      await fetchAllCategories(setCategory, setIsError)
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error)
      }
      setIsError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(setLoading, setIsError)
  }, [])

  if (isError) {
    return <Error />
  }

  return (
    <>
      {show ? (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <img src={BharatVastra} alt="BharatVastra" className="img-fluid" />
        </div>
      ) : (
        <>
          {loading ? (
            <AppShimmer />
          ) : (
            <>
              <Header
                position="static"
                top="auto"
                zIndex="auto"
                setSearch={setSearch}
                placeHolder="Search Product"
                userDetails={user}
              />
              <SearchInPage
                margin="ms-3"
                setSearch={setSearch}
                placeHolder="Search Product"
              />
              <div
                className="alert alert-success alert-dismissible fade show mt-3"
                role="alert"
              >
                <div className="d-flex flex-column flex-sm-row align-items-sm-center col-gap-4">
                  <p
                    className={`my-0 d-inline-block fw-medium me-4 ${styles.alertMessage}`}
                  >
                    <b className="fw-bold">Diwali Sale</b> is now live.
                  </p>
                  <a
                    href="#carousel"
                    className={`text-decoration-none fw-medium ${styles.alertBtn}`}
                  >
                    Click Here
                  </a>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
              <main className="mx-5 my-4">
                <div className="row">
                  {filteredCategory.map((category) => {
                    return (
                      <div
                        key={category.id}
                        className="col-12 col-sm-6 col-md-4 col-xl-2 col-xxl-2 mb-3"
                      >
                        <div className={`${styles.categoryCard}`}>
                          <Link to={`/products/${category.for}`}>
                            <div className="card position-relative">
                              <img
                                src={category.url}
                                alt="categoryImage"
                                className={`img-fluid ${styles.image}`}
                              />
                              <p
                                className={`m-0 text-center bg-light position-absolute w-100 top-50 ${styles.productCategoryLabel}`}
                              >
                                {category.name}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div id="carousel" className="carousel">
                  <div
                    id="carouselExampleAutoplaying"
                    className={`carousel ${styles.slide}`}
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <div
                          className="slide1"
                          style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: "cover",
                            maxHeight: "800px",
                            height: "78.6vw",
                          }}
                        >
                          <div
                            id="jhalar"
                            className="d-block"
                            style={{ width: "25vw" }}
                          >
                            <img
                              className={`d-block ${styles.jhalarImage}`}
                              style={{ width: "25vw" }}
                              src={JHALAR}
                              alt="jhalar"
                            />
                          </div>
                          <div
                            className={`${styles.text1} text-start position-relative fw-medium`}
                            style={{ maxWidth: "400px" }}
                          >
                            <p className="my-0">Hay,</p>
                            <p className="my-0">
                              BharatVastra Wish Happy Diwali To you and all of
                              your loved ones
                            </p>
                            <p className="my-0">
                              Checkout the latest trends waiting for you!
                            </p>
                          </div>
                          <div id="deepak" className="d-inline-block">
                            <img
                              className={`d-block ${styles.deepakImage}`}
                              style={{ width: "28vw" }}
                              src={DEEPAK}
                              alt="deepak"
                            />
                          </div>
                          <div id="deepak" className="d-inline-block">
                            <img
                              className={`d-block ${styles.deepakImage}`}
                              style={{ width: "28vw" }}
                              src={DEEPAK}
                              alt="deepak"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div
                          className={`${styles.slide2} bg-light p-2 d-flex justify-content-between`}
                          style={{ height: "78.6vw", maxHeight: "800px" }}
                        >
                          <div
                            className={`${styles.saree1} d-flex flex-column justify-content-between`}
                          >
                            <div className="w-50">
                              <img
                                src={diwaliDecoration2}
                                className="img-fluid w-75"
                                alt="diwaliDecoration"
                              />
                            </div>
                            <div className="">
                              <img
                                src={saree1}
                                className="img-fluid w-100"
                                alt="saree"
                              />
                            </div>
                          </div>
                          <div
                            className="d-flex flex-column justify-content-between align-items-center text-center"
                            style={{ width: "20vw" }}
                          >
                            <div className={`${styles.offer}`}>
                              <p className="fs-3 fw-bold my-0 text-danger">
                                UPTO
                              </p>
                              <img
                                src={offer}
                                className="img-fluid w-100"
                                alt="offer"
                              />
                            </div>
                            <div>
                              <div className={`${styles.diwaliDecoration3}`}>
                                <img
                                  src={diwaliDecoration3}
                                  style={{
                                    width: "5vw",
                                    marginBottom: "-2.2vw",
                                    position: "relative",
                                  }}
                                  className="img-fluid"
                                  alt="diwaliDecoration"
                                />
                              </div>
                              <div className={`${styles.diwaliDecoration13}`}>
                                <img
                                  src={diwaliDecoration13}
                                  className="img-fluid w-50"
                                  alt="diwaliDecoration"
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            className={`${styles.saree2} d-flex flex-column justify-content-between`}
                          >
                            <div className="text-center">
                              <div className={`${styles.saree2offer}`}>
                                <p
                                  className={`${styles.upto} fw-bold my-0 text-danger`}
                                >
                                  UPTO
                                </p>
                                <div>
                                  <img
                                    src={offer}
                                    alt="offer"
                                    className="img-fluid w-75"
                                  />
                                </div>
                              </div>
                              <div
                                className={`${styles.saree2diwaliDecoration1}`}
                              >
                                <img
                                  src={diwaliDecoration1}
                                  className="img-fluid w-75"
                                  alt="diwaliDecoration"
                                />
                              </div>
                            </div>
                            <div className="">
                              <img
                                src={saree2}
                                className="img-fluid w-100"
                                alt="saree"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div
                          className={`${styles.slide3} p-2 d-flex justify-content-around`}
                          style={{ height: "78.6vw", maxHeight: "800px" }}
                        >
                          <div className={`${styles.diwaliOfferOnMenSuit}`}>
                            <div className="w-75">
                              <img
                                src={diwaliDecoration7}
                                className="img-fluid w-100"
                                alt="diwaliDecoration"
                              />
                            </div>
                            <div className="text-light mt-5">
                              <p
                                className={`${styles.diwaliOfferInSuitCard} my-0`}
                              >
                                Diwali Offer
                              </p>
                              <p className="my-0 d-flex align-items-start">
                                <span className={`${styles.uptoInCoat}`}>
                                  UPTO
                                </span>
                                <span
                                  className={`${styles.diwaliOfferOnSuit} fw-bold`}
                                  style={{ fontSize: "48px" }}
                                >
                                  {" "}
                                  50% OFF
                                </span>
                              </p>
                            </div>
                          </div>
                          <div
                            className={`${styles.menWearCoatContainer} d-flex align-items-end`}
                          >
                            <div>
                              <img
                                src={menWearCoat1}
                                className="img-fluid w-100"
                                alt="menWearCoatImage"
                              />
                            </div>
                            <div>
                              <img
                                src={menWearCoat2}
                                className="img-fluid w-100"
                                alt="menWearCoatImage"
                              />
                            </div>
                            <div>
                              <img
                                src={menWearCoat3}
                                className="img-fluid w-100"
                                alt="menWearCoatImage"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div
                          className={`${styles.slide4} p-2 d-flex justify-content-between`}
                          style={{ maxHeight: "800px", height: "78.6vw" }}
                        >
                          <div
                            className={`${styles.diwaliOfferOnLahenga} d-flex flex-column justify-content-between`}
                          >
                            <div>
                              <img
                                src={diwaliDecoration15}
                                className="img-fluid w-50"
                                alt="jhalar"
                              />
                            </div>
                            <div>
                              <img
                                src={diwaliDecoration8}
                                className="img-fluid w-50"
                                alt="diwaliDecoration"
                              />
                            </div>
                          </div>
                          <div
                            className="d-flex flex-column justify-content-center align-items-center text-center"
                            style={{ width: "20vw" }}
                          >
                            <div className={`${styles.offer}`}>
                              <img
                                src={offer2}
                                className="img-fluid w-100"
                                alt="offer"
                              />
                            </div>
                            <div className={`${styles.diwaliDecoration3}`}>
                              <img
                                src={diwaliDecoration9}
                                style={{ width: "10vw" }}
                                className="img-fluid"
                                alt="diwaliDecoration"
                              />
                            </div>
                          </div>
                          <div
                            className={`${styles.groupOfWomenWearLahenga} d-flex flex-column justify-content-between`}
                          >
                            <div className="w-25 ms-auto">
                              <img
                                src={diwaliDecoration2}
                                className={`${styles.diwaliDecoration2} img-fluid w-100`}
                                alt="diwaliDecoration"
                              />
                            </div>
                            <div className={`${styles.offer2}`}>
                              <img
                                src={offer2}
                                className="img-fluid w-50 d-block mx-auto"
                                alt="offer"
                              />
                            </div>
                            <div className="d-flex">
                              <div>
                                <img
                                  src={womenWearLahenga1}
                                  className="img-fluid w-100"
                                  alt="womenWearLahengaImage"
                                />
                              </div>
                              <div>
                                <img
                                  src={womenWearLahenga3}
                                  className="img-fluid w-100"
                                  alt="womenWearLahengaImage"
                                />
                              </div>
                              <div>
                                <img
                                  src={womenWearLahenga2}
                                  className="img-fluid w-100"
                                  alt="womenWearLahengaImage"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div
                          className={`${styles.slide5} p-2 d-flex justify-content-between`}
                          style={{ height: "78.6vw", maxHeight: "800px" }}
                        >
                          <div
                            className={`${styles.diwaliOfferOnShoes} d-flex flex-column justify-content-between`}
                          >
                            <div>
                              <img
                                src={diwaliDecoration10}
                                className="img-fluid w-50"
                                alt="diwaliDecoration"
                              />
                            </div>
                            <div className="">
                              <img
                                src={diwaliDecoration14}
                                className="img-fluid w-75"
                                alt="diwaliDecoration"
                              />
                            </div>
                          </div>
                          <div
                            className={`${styles.menWearShoe} align-self-end`}
                          >
                            <img
                              src={menWearShoe}
                              className="img-fluid w-100"
                              alt="menWearShoeImage"
                            />
                          </div>
                          <div
                            className={`${styles.shoeContainerInDiwaliSaleBanner} d-flex flex-column justify-content-between`}
                          >
                            <div className="text-center">
                              <div
                                className={`d-flex justify-content-center ${styles.shoeOfferInCarousel}`}
                              >
                                <p
                                  className={`${styles.uptoInShoe} fw-bold text-warning`}
                                  style={{ marginBlock: "0px" }}
                                >
                                  UPTO
                                </p>
                                <div className="w-25">
                                  <img
                                    src={offer3}
                                    className="img-fluid w-100"
                                    alt="offer"
                                  />
                                </div>
                                <p
                                  className={`${styles.uptoInShoe} fw-bold text-warning align-self-end`}
                                  style={{ marginBlock: "0px" }}
                                >
                                  OFF
                                </p>
                              </div>
                              <div className={`${styles.goldenRibbonCarousel}`}>
                                <img
                                  src={goldenRibbon}
                                  className="img-fluid w-50"
                                  alt="goldenRibbon"
                                />
                              </div>
                            </div>
                            <div className="text-end">
                              <img
                                src={shoe1}
                                className={`${styles.shoe1} img-fluid`}
                                alt="shoe"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div
                          className={`${styles.slide6} px-3 d-flex align-items-center justify-content-center`}
                          style={{
                            backgroundColor: "orange",
                            height: "78.6vw",
                            maxHeight: "800px",
                          }}
                        >
                          <div className="w-100 d-flex flex-column align-items-center">
                            <div className={`${styles.line1}`}>
                              <img
                                className="d-block w-100"
                                src={LINE}
                                alt="line"
                              />
                            </div>
                            <div>
                              <img
                                className="w-100 img-fluid"
                                src={LakshmiMaaAndGaneshJi}
                                style={{ maxHeight: "410px" }}
                                alt="lakshmiGaneshaImage"
                              />
                            </div>
                            <div
                              className={`${styles.text2} text-center fw-medium`}
                            >
                              Wishing You a Blessed and Prosperous Deepawali
                            </div>
                            <div className={`${styles.line2}`}>
                              <img
                                className="d-block w-100"
                                src={LINE}
                                alt="line"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselExampleAutoplaying"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselExampleAutoplaying"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
                <div className="row">
                  <Link
                    to="/newArrival"
                    className="col-md-6 my-3 text-decoration-none"
                  >
                    <div className="card flex-xxl-row p-sm-5 p-3 bg-body-secondary">
                      <img
                        src="https://tse1.mm.bing.net/th/id/OIP.jngCe7THF9RyUMqBs3Lw6gHaDt?pid=Api&P=0&h=180"
                        alt="newArrivalBannerImage"
                        className={`${styles.bannerImage}`}
                        style={{ height: "200px" }}
                      />
                      <div className="card-body py-0 px-0 px-xxl-5 d-flex flex-column justify-content-between">
                        <p className="fw-bold mt-2">New Arrival</p>
                        <div
                          style={{ minWidth: "225px" }}
                          className={`${styles.description}`}
                        >
                          <h3 className={`${styles.newArrivalHeader}`}>
                            New Collection
                          </h3>
                          <p className={`m-0 ${styles.newArrivalCardTitle}`}>
                            Checkout our new collection to live your diwali with
                            style. hurry up don't miss this chance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/diwaliSale"
                    className="col-md-6 my-3 text-decoration-none"
                  >
                    <div className="card flex-xxl-row p-sm-5 p-3 bg-body-secondary">
                      <img
                        src="https://tse3.mm.bing.net/th/id/OIP.DZhMFCN8KQJup5G70IemgAHaDt?pid=Api&P=0&h=180"
                        alt="diwaliSaleBannerImage"
                        className={`${styles.bannerImage}`}
                        style={{ height: "200px" }}
                      />
                      <div className="card-body py-0 px-0 px-xxl-5 d-flex flex-column justify-content-between">
                        <p className="fw-bold mt-2">Diwali Sale</p>
                        <div
                          style={{ minWidth: "225px" }}
                          className={`${styles.description}`}
                        >
                          <h3 className={`${styles.diwaliSaleHeader}`}>
                            Upto 50% off
                          </h3>
                          <p className={`m-0 ${styles.diwaliSaleCardTitle}`}>
                            Diwali sale is launch now, sale is live till 31st
                            November, go and make your diwali stylish.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
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
