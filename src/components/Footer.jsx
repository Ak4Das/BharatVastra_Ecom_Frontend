import { Link } from "react-router-dom"
import { FooterWrapper } from "../services/styledComponents"
import { FaDiscord, FaInstagram, FaYoutube } from "react-icons/fa"

export default function Footer() {
  return (
    <FooterWrapper>
      <section className="contact-short">
        <div className="d-flex justify-content-between">
          <div className="queryDiv">
            <h3>Have you any query?</h3>
            <h3>Talk to us today</h3>
          </div>

          <div>
            <Link to="/contactUs" className="btn text-light text-decoration-none">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="d-flex flex">
          <div className="footer-about">
            <h3>BharatVastra</h3>
            <p>
              BharatVastra is your destination for authentic Indian and foreign
              clothing.
            </p>
          </div>
          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="footer-social--icons">
              <div>
                <FaDiscord className="icons" />
              </div>
              <div>
                <FaInstagram className="icons" />
              </div>
              <div>
                <a href="/" target="_blank">
                  <FaYoutube className="icons" />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-contact">
            <h3>Call Us</h3>
            <h3>+91 1234567890</h3>
          </div>
        </div>

        <div className="footer-bottom--section">
          <hr />
          <div className="d-flex flex">
            <div className="privacyPolicy">
              <p>PRIVACY POLICY</p>
            </div>
            <div className="termsAndConditions">
              <p>TERMS & CONDITIONS</p>
            </div>
            <div className="copyright">
              <p>
                @{new Date().getFullYear()} BharatVastra. All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </FooterWrapper>
  )
}
