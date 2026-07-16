import { Link } from "react-router-dom"
import { FooterWrapper } from "../services/styledComponents"
import { FaDiscord, FaWhatsapp } from "react-icons/fa"
import { MdMailOutline } from "react-icons/md"

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
            <Link
              to="/contactUs"
              className="btn text-light text-decoration-none"
            >
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
            <h3>Connect Us</h3>
            <div className="footer-social--icons">
              <a href="https://discordapp.com/users/1319317746579669056" target="_blank">
                <div>
                  <FaDiscord className="icons" />
                </div>
              </a>
              <a href="https://wa.me/9883620996" target="_blank">
                <div>
                  <FaWhatsapp className="icons" />
                </div>
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=akashdas02052@gmail.com&su=Hello&body=Hi%20Akash,"
                target="_blank"
              >
                <div>
                  <MdMailOutline className="icons" />
                </div>
              </a>
            </div>
          </div>
          <div className="footer-contact">
            <h3>Call Us</h3>
            <h3>+91 9883620996</h3>
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
