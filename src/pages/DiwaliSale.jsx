import styles from "../style_modules/pages_modules/DiwaliSale.module.css"
import Header from "../components/Header"
import diwaliDecoration5 from "../assets/images/diwaliDecoration5.png"
import background2 from "../assets/images/background2.png"
import saree1 from "../assets/images/saree1.png"
import offer2 from "../assets/images/offer2.png"
import menWearCoat2 from "../assets/images/menWearCoat2.png"
import womenWearLahenga3 from "../assets/images/womenWearLahenga3.png"
import shoe1 from "../assets/images/shoe1.png"
import menWearPanjabi1 from "../assets/images/menWearPanjabi1.png"
import menWearJeans from "../assets/images/menWearJeans.png"
import ganpati from "../assets/images/ganpati.png"
import lakshmiMata from "../assets/images/lakshmiMata.png"
import ghat from "../assets/images/ghat.png"
import girlHoldDiya1 from "../assets/images/girlHoldDiya1.png"
import diwaliDecoration11 from "../assets/images/diwaliDecoration11.png"
import diwaliDecoration12 from "../assets/images/diwaliDecoration12.png"
import diwaliDecoration13 from "../assets/images/diwaliDecoration13.png"
import { Link } from "react-router-dom"
import SearchInPage from "../components/SearchInPage"
import { useState, useEffect } from "react"
import { fetchUserById } from "../services/FetchRequests"
import DiwaliSaleShimmer from "../shimmers/DiwaliSale.shimmer"
import Footer from "../components/Footer"
import GetUserId from "../services/GetClothsData"
import Error from "../components/Error"

export default function DiwaliSale() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const [search, setSearch] = useState("")
  console.log(search)

  const userId = GetUserId()
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        if (userId) {
          const user = await fetchUserById(userId, setUser, setIsError)
        }
      } catch (error) {
        console.error(error)
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isError) {
    return <Error />
  }

  return (
    <>
      {loading || !user ? (
        <DiwaliSaleShimmer />
      ) : (
        <>
          <Header
            position="static"
            top="auto"
            zIndex="auto"
            setSearch={setSearch}
            placeHolder="Search Product"
            page="diwaliSale"
            userDetails={user}
          />
          <SearchInPage
            margin="ms-3"
            setSearch={setSearch}
            placeHolder="Search Product"
            page="diwaliSale"
          />
          <main className="mx-5 my-4">
            <section
              className={`${styles.diwaliSaleSection1}`}
              style={{
                backgroundImage: `url(${background2})`,
                backgroundSize: "contain",
              }}
            >
              <div
                className="d-flex justify-content-center align-items-center gap-3 gap-md-5"
                style={{ paddingBlock: "2vw" }}
              >
                <h1 className={`${styles.headingText}`}>Happy</h1>
                <img
                  src={diwaliDecoration5}
                  style={{ width: "5vw" }}
                  alt="diwaliDecoration"
                />
                <h1 className={`${styles.headingText}`}>Diwali</h1>
              </div>
              <div>
                <div className="row row-gap-3 row-gap-sm-4">
                  <div className="col-12 col-xxl-6">
                    <div
                      className={`${styles.diwaliSaleCard} ${styles.sareeCard} card p-1 flex-row justify-content-around`}
                    >
                      <div className="w-25 d-flex flex-column justify-content-around">
                        <div className="">
                          <span
                            className={`${styles.DiwaliSaleProductName1} d-inline-block bg-light px-1 px-sm-2 rounded-pill`}
                          >
                            Saree
                          </span>
                          <img
                            src={offer2}
                            className={`${styles.diwaliSalePageOffer1} d-block img-fluid w-100`}
                            alt="offer"
                          />
                        </div>
                        <Link
                          to={`/saleProducts/Saree`}
                          className={`${styles.diwaliSaleCheckBtn} btn btn-outline-primary rounded-pill`}
                        >
                          Check
                        </Link>
                      </div>
                      <img
                        src={saree1}
                        className={`img-fluid h-100 ${styles.sareeImageInDiwaliSalePage}`}
                        alt="saree"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-xxl-6">
                    <div
                      className={`${styles.diwaliSaleCard} ${styles.suitPantCard} card p-1 flex-row justify-content-around`}
                    >
                      <div className="w-25 d-flex flex-column justify-content-around">
                        <div className="">
                          <span
                            className={`${styles.DiwaliSaleProductName2} d-inline-block bg-light px-1 px-sm-2 rounded-pill`}
                          >
                            Suit Pant
                          </span>
                          <img
                            src={offer2}
                            className={`${styles.diwaliSalePageOffer2} d-block img-fluid w-100`}
                            alt="offer"
                          />
                        </div>
                        <Link
                          to={`/saleProducts/Suit`}
                          className={`${styles.diwaliSaleCheckBtn} ${styles.diwaliSaleCheckBtn2} btn btn-outline-info rounded-pill`}
                        >
                          Check
                        </Link>
                      </div>
                      <img
                        src={menWearCoat2}
                        className="img-fluid h-100"
                        alt="menWearCoatImage"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-xxl-6">
                    <div
                      className={`${styles.diwaliSaleCard} ${styles.lahengaCard} card p-1 flex-row justify-content-around`}
                    >
                      <div className="w-25 d-flex flex-column justify-content-around">
                        <div className="">
                          <span
                            className={`${styles.DiwaliSaleProductName3} d-inline-block bg-light px-1 px-sm-2 rounded-pill`}
                          >
                            Lahenga
                          </span>
                          <img
                            src={offer2}
                            className={`${styles.diwaliSalePageOffer3} d-block img-fluid w-100`}
                            alt="offer"
                          />
                        </div>
                        <Link
                          to={`/saleProducts/Lehenga`}
                          className={`${styles.diwaliSaleCheckBtn} ${styles.diwaliSaleCheckBtn3} btn btn-outline-primary rounded-pill`}
                        >
                          Check
                        </Link>
                      </div>
                      <img
                        src={womenWearLahenga3}
                        className="img-fluid h-100"
                        alt="womenWearLahengaImage"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-xxl-6">
                    <div
                      className={`${styles.diwaliSaleCard} ${styles.shoesCard} card p-1 flex-row justify-content-around`}
                    >
                      <div className="w-25 d-flex flex-column justify-content-around">
                        <div className="">
                          <span
                            className={`${styles.DiwaliSaleProductName4} d-inline-block bg-light px-1 px-sm-2 rounded-pill`}
                          >
                            Shoes
                          </span>
                          <img
                            src={offer2}
                            className={`${styles.diwaliSalePageOffer4} d-block img-fluid w-100`}
                            alt="offer"
                          />
                        </div>
                        <Link
                          to={`/saleProducts/Shoes`}
                          className={`${styles.diwaliSaleCheckBtn} ${styles.diwaliSaleCheckBtn4} btn btn-outline-info rounded-pill`}
                        >
                          Check
                        </Link>
                      </div>
                      <div className="text-end">
                        <img
                          src={shoe1}
                          className="img-fluid w-75 h-100"
                          alt="shoe"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-xxl-6">
                    <div
                      className={`${styles.diwaliSaleCard} ${styles.panjabiCard} card p-1 flex-row justify-content-around`}
                    >
                      <div className="w-25 d-flex flex-column justify-content-around">
                        <div className="">
                          <span
                            className={`${styles.DiwaliSaleProductName5} d-inline-block bg-light px-1 px-sm-2 rounded-pill`}
                          >
                            Panjabi
                          </span>
                          <img
                            src={offer2}
                            className={`${styles.diwaliSalePageOffer5} d-block img-fluid w-100`}
                            alt="offer"
                          />
                        </div>
                        <Link
                          to={`/saleProducts/Panjabi`}
                          className={`${styles.diwaliSaleCheckBtn} ${styles.diwaliSaleCheckBtn5} btn btn-outline-primary rounded-pill`}
                        >
                          Check
                        </Link>
                      </div>
                      <img
                        src={menWearPanjabi1}
                        className="img-fluid h-100"
                        alt="menWearPanjabiImage"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-xxl-6">
                    <div
                      className={`${styles.diwaliSaleCard} ${styles.jeansCard} card p-1 flex-row justify-content-around`}
                    >
                      <div className="w-25 d-flex flex-column justify-content-around">
                        <div className="">
                          <span
                            className={`${styles.DiwaliSaleProductName6} d-inline-block bg-light px-1 px-sm-2 rounded-pill`}
                          >
                            Jeans
                          </span>
                          <img
                            src={offer2}
                            className={`${styles.diwaliSalePageOffer6} d-block img-fluid w-100`}
                            alt="offer"
                          />
                        </div>
                        <Link
                          to={`/saleProducts/Jeans`}
                          className={`${styles.diwaliSaleCheckBtn} ${styles.diwaliSaleCheckBtn6} btn btn-outline-info rounded-pill`}
                        >
                          Check
                        </Link>
                      </div>
                      <img
                        src={menWearJeans}
                        className="img-fluid h-100"
                        alt="menWearJeansImage"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className={`mt-4 mt-md-5 py-4 ${styles.couponSection}`}>
              <div className="w-50 d-flex flex-column mx-auto">
                <div className="d-flex">
                  <div>
                    <img
                      src={ganpati}
                      className="img-fluid w-100"
                      alt="ganpatiImage"
                    />
                  </div>
                  <div>
                    <img
                      src={lakshmiMata}
                      className="img-fluid w-100"
                      alt="lakshmiMataImage"
                    />
                  </div>
                </div>
                <div className="d-flex align-items-end">
                  <div className="w-25">
                    <img
                      src={diwaliDecoration11}
                      className="img-fluid w-100"
                      alt="diwaliDecoration"
                    />
                  </div>
                  <div className="w-50">
                    <img
                      src={ghat}
                      className="img-fluid d-block mx-auto w-50 position-relative"
                      style={{ marginBottom: "-4.5vw" }}
                      alt="ghat"
                    />
                    <img
                      src={diwaliDecoration13}
                      className="img-fluid d-block mx-auto w-75"
                      alt="diwaliDecoration"
                    />
                  </div>
                  <div className="w-25">
                    <img
                      src={diwaliDecoration12}
                      className="img-fluid w-50"
                      alt="diwaliDecoration"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div
                  className={`${styles.coupon}`}
                  style={{ padding: "2vw", minWidth: "140px" }}
                >
                  <div className="">
                    <label
                      className={`form-label fw-bold text-light lh-1 ${styles.couponInputLavel}`}
                      style={{ fontSize: "2vw" }}
                    >
                      Save 10%
                    </label>
                  </div>
                  <div className="">
                    <input
                      type="text"
                      value="HAPPYDIWALI"
                      className={`form-control fw-bold ${styles.couponInput}`}
                      readOnly
                    ></input>
                  </div>
                  <div className="">
                    <span
                      className={`${styles.couponValid} form-text fw-bold text-light`}
                      style={{ fontSize: "1vw" }}
                    >
                      OFFER VALID TILL 30th NOVEMBER
                    </span>
                  </div>
                </div>
                <div className={`${styles.girlHoldDiya1} w-75`}>
                  <img
                    src={girlHoldDiya1}
                    className="img-fluid d-block ms-auto w-25"
                    alt="girlHoldDiyaImage"
                  />
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
