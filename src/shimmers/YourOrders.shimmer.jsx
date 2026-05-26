import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/YourOrdersShimmer.module.css"

export default function YourOrdersShimmer() {
  return (
    <>
      <HeaderShimmer />
      <main className="container mt-3">
        <h1>Your Orders</h1>
        <div className={`card my-3 ${styles.card}`}></div>
        <hr />
        <div className={`card my-3 ${styles.card}`}></div>
        <hr />
      </main>
    </>
  )
}
