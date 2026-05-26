import { HeaderShimmer } from "../services/styledComponents.js"
import styles from "../style_modules/shimmer_modules/UserProfileShimmer.module.css"

export default function UserProfileShimmer() {
  return (
    <>
      <HeaderShimmer />
      <main className="container">
        <div className="d-flex flex-column align-items-center mt-5">
          <div
            className={`overflow-hidden rounded-circle ${styles.profileImage}`}
          >
            <div
              className={`w-100 h-100 fs-1 d-flex align-items-center justify-content-center ${styles.img}`}
            ></div>
          </div>
          <div className={`${styles.name}`}></div>
          <div className={`${styles.email}`}></div>
        </div>
        <div className="row mt-5">
          <div className="col-md-6 col-xl-4 mb-4 text-decoration-none">
            <div
              className={`card align-items-center gap-2 cardInUserProfilePage p-2 ${styles.card}`}
            ></div>
          </div>
          <div className="col-md-6 col-xl-4 mb-4 text-decoration-none">
            <div
              className={`card align-items-center gap-2 cardInUserProfilePage p-2 ${styles.card}`}
            ></div>
          </div>
          <div className="col-md-6 col-xl-4 mb-4 text-decoration-none">
            <div
              className={`card align-items-center gap-2 cardInUserProfilePage p-2 ${styles.card}`}
            ></div>
          </div>
        </div>
      </main>
    </>
  )
}
