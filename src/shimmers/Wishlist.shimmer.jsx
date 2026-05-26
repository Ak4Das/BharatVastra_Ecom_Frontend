import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/WishlistShimmer.module.css"

export default function WishlistShimmer() {
  return (
    <>
      <HeaderShimmer />
      <main className="bg-body-secondary pb-3">
        <div className="mx-5">
          <h3 className="py-3 text-center">My Wishlist</h3>
          <div className="row row-gap-4">
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-2 cardContainer">
              <div className="card border border-0">
                <div className={`card-body ${styles.cardBody}`}></div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-2 cardContainer">
              <div className="card border border-0">
                <div className={`card-body ${styles.cardBody}`}></div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-2 cardContainer">
              <div className="card border border-0">
                <div className={`card-body ${styles.cardBody}`}></div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-2 cardContainer">
              <div className="card border border-0">
                <div className={`card-body ${styles.cardBody}`}></div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-2 cardContainer">
              <div className="card border border-0">
                <div className={`card-body ${styles.cardBody}`}></div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-2 cardContainer">
              <div className="card border border-0">
                <div className={`card-body ${styles.cardBody}`}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
