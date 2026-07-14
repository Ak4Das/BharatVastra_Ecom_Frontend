import styles from "../style_modules/shimmer_modules/ProductListingShimmer.module.css"

export default function ProductListingShimmer() {
  return (
    <>
      <section>
        <div className="row position-relative" style={{ zIndex: 1 }}>
          <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
            <div className={`card ${styles.card}`}></div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
            <div className={`card ${styles.card}`}></div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
            <div className={`card ${styles.card}`}></div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
            <div className={`card ${styles.card}`}></div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
            <div className={`card ${styles.card}`}></div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xxl-3 mb-3">
            <div className={`card ${styles.card}`}></div>
          </div>
        </div>
      </section>
    </>
  )
}
