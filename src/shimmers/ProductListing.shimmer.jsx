import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/ProductListingShimmer.module.css"

export default function ProductListingShimmer() {
  return (
    <>
      <HeaderShimmer />
      <main className={`${styles.main}`}>
        <section>
          <div className={`ms-5 mt-4 ${styles.heading}`}></div>
          <div className="mx-5 mt-4 row">
            <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
            <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
            <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
            <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
            <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
            <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
