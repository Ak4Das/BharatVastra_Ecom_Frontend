import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/DiwaliSaleShimmer.module.css"
import background2 from "../assets/images/background2.png"
import diwaliDecoration5 from "../assets/images/diwaliDecoration5.png"

export default function DiwaliSaleShimmer() {
  return (
    <>
      <HeaderShimmer />
      <main className="mx-5 my-4">
        <section
          className={`diwaliSaleSection1 ${styles.diwaliSaleSection1}`}
          style={{ backgroundImage: `url(${background2})` }}
        >
          <div
            className={`d-flex justify-content-center align-items-center gap-3 gap-md-5 ${styles.heading}`}
          >
            <h1 className={`${styles.happyDiwali}`}>Happy</h1>
            <img
              src={diwaliDecoration5}
              className={`${styles.diwaliDecoration5}`}
              alt="diwaliDecoration"
            />
            <h1 className={`${styles.happyDiwali}`}>Diwali</h1>
          </div>
          <div>
            <div className="row row-gap-3 row-gap-sm-4">
              <div className="col-12 col-xxl-6">
                <div className={`${styles.diwaliSaleCard} card p-1 flex-row justify-content-around ${styles.card}`}></div>
              </div>
              <div className="col-12 col-xxl-6">
                <div className={`${styles.diwaliSaleCard} card p-1 flex-row justify-content-around ${styles.card}`}></div>
              </div>
              <div className="col-12 col-xxl-6">
                <div className={`${styles.diwaliSaleCard} card p-1 flex-row justify-content-around ${styles.card}`}></div>
              </div>
              <div className="col-12 col-xxl-6">
                <div className={`${styles.diwaliSaleCard} card p-1 flex-row justify-content-around ${styles.card}`}></div>
              </div>
              <div className="col-12 col-xxl-6">
                <div className={`${styles.diwaliSaleCard} card p-1 flex-row justify-content-around ${styles.card}`}></div>
              </div>
              <div className="col-12 col-xxl-6">
                <div className={`${styles.diwaliSaleCard} card p-1 flex-row justify-content-around ${styles.card}`}></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
