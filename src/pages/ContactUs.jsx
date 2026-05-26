import "@fortawesome/fontawesome-free/css/all.min.css"
import styles from "../style_modules/pages_modules/ContactUs.module.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import GetUserId from "../services/GetClothsData"
import { useEffect, useState } from "react"
import { fetchUserById } from "../services/FetchRequests"
import Error from "../components/Error"

export default function ContactUs() {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const userId = GetUserId()
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        const user = await fetchUserById(userId, setUser, setIsError)
      } catch (error) {
        console.error(error)
        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isError) {
    return <Error />
  }

  return (
    <>
      {loading || !user ? (
        <div
          className="d-flex flex-column align-items-center justify-content-center gap-3 bg-dark-subtle text-dark fw-bold fs-1"
          style={{ width: "100vw", height: "100vh" }}
        >
          Loading...
        </div>
      ) : (
        <div>
          <Header
            position="static"
            top="auto"
            zIndex="auto"
            isSearchBarNeeded={false}
            userDetails={user}
          />
          <main>
            <section className={`${styles.contact_section}`}>
              <div className={`${styles.contact_bg}`}>
                <h2>CONTACT US</h2>
                <p>
                  We'd love to hear from you. Reach out to us for any questions,
                  feedback, or support.
                </p>
              </div>
              <div className={`${styles.contact_body}`}>
                <div className={`${styles.contact_info}`}>
                  <div>
                    <span>
                      <i className="fa-solid fa-phone"></i>
                    </span>
                    <span>Phone No.</span>
                    <span>+91 1234567890</span>
                  </div>
                  <div>
                    <span>
                      <i className="fa-sharp fa-solid fa-envelope"></i>
                    </span>
                    <span>Email</span>
                    <span>bharatvastra@gmail.com</span>
                  </div>
                  <div>
                    <span>
                      <i className="fa-solid fa-building"></i>
                    </span>
                    <span>Address</span>
                    <span>Dubrajpur, Birbhum, West Bengal</span>
                  </div>
                  <div>
                    <span>
                      <i className="fa-solid fa-clock"></i>
                    </span>
                    <span>Working Hours</span>
                    <span>Mon - Sat (10am - 7pm)</span>
                  </div>
                </div>
              </div>
              <div className={`${styles.contact_form}`}>
                <form action="https://formspree.io/f/mdajdnbo" method="POST">
                  <h2>Get In Touch</h2>
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      className={`${styles.form_input}`}
                      name="Username"
                      autoComplete="off"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      className={`${styles.form_input}`}
                      name="Email"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <textarea
                    name="Message"
                    className={`${styles.form_input}`}
                    id="message"
                    cols="30"
                    rows="10"
                    placeholder="Enter Your Message"
                    autoComplete="off"
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-primary btn-lg">
                    Send Message
                  </button>
                </form>
                <div className={`${styles.map}`}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17365.420908085205!2d87.36976764332869!3d23.79618481803105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f75d2b8355c0c3%3A0x19de8f112fef7240!2sDubrajpur%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1779511719432!5m2!1sen!2sin"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}
