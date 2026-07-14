import styles from "../style_modules/shimmer_modules/SaleProductsShimmer.module.css"

export default function SaleProductsShimmer() {
  return (
    <>
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
    </>
  )
}
