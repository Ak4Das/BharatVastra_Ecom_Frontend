import styles from "../style_modules/shimmer_modules/NewArrivalShimmer.module.css"

export default function NewArrivalShimmer() {
  return (
    <>
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
    </>
  )
}
