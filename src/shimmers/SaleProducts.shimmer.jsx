import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/SaleProductsShimmer.module.css"

export default function SaleProductsShimmer() {
  return (
    <>
      <HeaderShimmer />
      <main className="mx-5 my-3">
        <div className={`${styles.heading}`}></div>
        <div>
          <div className="row">
            <div className="col-sm-6 col-xl-4 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
            <div className="col-sm-6 col-xl-4 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
            <div className="col-sm-6 col-xl-4 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
            <div className="col-sm-6 col-xl-4 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
            <div className="col-sm-6 col-xl-4 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
            <div className="col-sm-6 col-xl-4 mb-3">
              <div className={`card productCard ${styles.card}`}></div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
