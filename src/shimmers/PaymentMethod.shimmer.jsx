import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/PaymentMethodShimmer.module.css"

export default function PaymentMethodShimmer() {
  return (
    <>
      <HeaderShimmer />
      <main className={`mt-3 mb-5 d-lg-flex gap-5 align-items-start ${styles.paymentMethodMainElement}`}>
        <div className={`${styles.paymentMethodSectionOne}`}>
          <section
            className={`p-3 d-flex column-gap-5 justify-content-between align-items-start deliveryAddressSection ${styles.section1}`}
          ></section>
          <section>
            <div className="mt-4">
              <h3>Payment Method</h3>
              <div className={`p-3 ${styles.paymentMethodContainer}`}></div>
            </div>
          </section>
        </div>
        <section
          className={`p-3 ${styles.paymentMethodSectionTwo} mt-5 mt-lg-0 ${styles.section3}`}
        ></section>
      </main>
    </>
  )
}
