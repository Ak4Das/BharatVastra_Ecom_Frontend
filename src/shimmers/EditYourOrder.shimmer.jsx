import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/EditYourOrderShimmer.module.css"

export default function EditYourOrderShimmer() {
  return (
    <>
      <HeaderShimmer />
      <h1 className="text-success fw-medium my-3 container">Edit Order</h1>
      <main className="container my-4">
        <section
          className={`editOrderSection1 p-3 d-flex column-gap-5 justify-content-between align-items-start deliveryAddressSection ${styles.section1}`}
        ></section>
        <section
          className={`editOrderSection2 p-3 d-flex column-gap-5 row-gap-3 justify-content-between align-items-start mt-3 paymentMethodSection ${styles.section2}`}
        ></section>
        <section className="editOrderSection3">
          <div className="mt-4">
            <h3 className="fw-medium">Products List</h3>
            <div className={`p-3 ${styles.productContainer}`}></div>
          </div>
        </section>
        <button className={`btn rounded-pill mt-4 ${styles.btn}`}>
          Save Changes
        </button>
      </main>
    </>
  )
}
