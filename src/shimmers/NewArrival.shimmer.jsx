import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/NewArrivalShimmer.module.css"

export default function NewArrivalShimmer() {
  return (
    <>
      <HeaderShimmer />
      <main className="mx-5 my-3">
        <h2 className="my-3 text-secondary">New Arrival</h2>
        <div>
          <div className="row">
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
        </div>
      </main>
    </>
  )
}
