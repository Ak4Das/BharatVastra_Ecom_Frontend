import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/OrderDetailsShimmer.module.css"

export default function OrderDetailsShimmer() {
  return (
    <>
      <HeaderShimmer />
      <main className={`py-3 ${styles.main} container`}>
        <div
          className={`mx-auto orderDetailsContainer ${styles.orderDetailsContainer}`}
        >
          <h1>Order Details</h1>
          <div className={`${styles.orderId}`}></div>
          <div
            className={`card p-3 mt-3 flex-lg-row gap-3 orderDetailsCard ${styles.orderDetailsCard}`}
          ></div>
          <div
            className={`border border-secondary-subtle rounded p-3 mt-3 ${styles.productDetailsCard}`}
          ></div>
        </div>
      </main>
    </>
  )
}
