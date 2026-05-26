import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/CartPageShimmer.module.css"

export default function CartPageShimmer() {
  return (
    <>
      <HeaderShimmer/>
      <main className="bg-body-secondary pb-3">
        <div className="container">
            <h3 className="py-4 text-center">My Cart</h3>
            <div className={`d-md-flex justify-content-between align-items-start ${styles.cartContainer}`}>
                <section className={`${styles.productsInCurt}`}>
                    <div className="row mb-3">
                        <div className="col-sm-12 col-md-12 mb-3">
                            <div className={`card ${styles.productCardInCart} ${styles.card}`}>
                                <div className="card-body"></div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 mb-3">
                            <div className={`card ${styles.productCardInCart} ${styles.card}`}>
                                <div className="card-body"></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={`px-5 py-4 ${styles.totalBill}`}>
                </section>
            </div>
        </div>
      </main>
    </>
  )
}
