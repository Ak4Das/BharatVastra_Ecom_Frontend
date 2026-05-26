import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/AppShimmer.module.css"

export default function AppShimmer() {
  return (
    <>
      <HeaderShimmer />
      <main className="mx-5 my-4">
        <div className="row">
          <div className="col-12 col-sm-6 col-md-4 col-xl-2 col-xxl-2 mb-3">
            <div className={`${styles.categoryCard}`}>
              <div className="card position-relative">
                <img
                  src="https://placehold.co/550x741?text=Loading..."
                  alt=""
                  className={`img-fluid ${styles.image}`}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-xl-2 col-xxl-2 mb-3">
            <div className={`${styles.categoryCard}`}>
              <div className="card position-relative">
                <img
                  src="https://placehold.co/550x741?text=Loading..."
                  alt=""
                  className={`img-fluid ${styles.image}`}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-xl-2 col-xxl-2 mb-3">
            <div className={`${styles.categoryCard}`}>
              <div className="card position-relative">
                <img
                  src="https://placehold.co/550x741?text=Loading..."
                  alt=""
                  className={`img-fluid ${styles.image}`}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-xl-2 col-xxl-2 mb-3">
            <div className={`${styles.categoryCard}`}>
              <div className="card position-relative">
                <img
                  src="https://placehold.co/550x741?text=Loading..."
                  alt=""
                  className={`img-fluid ${styles.image}`}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-xl-2 col-xxl-2 mb-3">
            <div className={`${styles.categoryCard}`}>
              <div className="card position-relative">
                <img
                  src="https://placehold.co/550x741?text=Loading..."
                  alt=""
                  className={`img-fluid ${styles.image}`}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-xl-2 col-xxl-2 mb-3">
            <div className={`${styles.categoryCard}`}>
              <div className="card position-relative">
                <img
                  src="https://placehold.co/550x741?text=Loading..."
                  alt=""
                  className={`img-fluid ${styles.image}`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="carousel">
          <div className="carousel slide">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className={`slide1 ${styles.slide1}`}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
