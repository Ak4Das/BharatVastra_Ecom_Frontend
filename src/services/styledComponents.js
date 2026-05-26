import styled from "styled-components"

export const HeaderShimmer = styled.header({
  height: "62px",
  backgroundColor: "#ccc",
})

export const FooterWrapper = styled.section`
  position: relative;
  z-index: 5;

  .contact-short {
    max-width: 60vw;
    margin: auto;
    padding: 3rem 3rem;
    background-color: #f6f8fa;
    border-radius: 1rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    transform: translateY(50%);

    .btn {
      background-color: #6254f3 !important;
      padding: 20px !important;
      font-size: 16px;
    }
  }

  footer {
    padding: 12rem 0 3rem 0;
    background-color: #0a1435;

    h3 {
      color: #ffffff;
      margin-bottom: 2.4rem;
    }

    p {
      color: #fff;
    }

    .flex {
      justify-content: space-evenly;

      .footer-about {
        max-width: 30vw;
        min-width: 30vw;
        justify-items: center;

        p {
          text-align: center;
        }
      }

      .footer-social {
        max-width: 30vw;
        min-width: 30vw;
        justify-items: center;

        h3 {
          margin-bottom: 25px;
        }

        .footer-social--icons {
          display: flex;
          gap: 2rem;

          div {
            padding: 0.5rem;
            border-radius: 50%;
            border: 2px solid #fff;

            .icons {
              color: #fff;
              font-size: 2rem;
              position: relative;
              cursor: pointer;
            }
          }
        }
      }

      .footer-contact {
        max-width: 30vw;
        min-width: 30vw;
        justify-items: center;
      }
    }

    .footer-bottom--section {
      padding-top: 5rem;

      .termsAndConditions,
      .privacyPolicy {
        cursor: pointer;
      }

      .copyright,
      .privacyPolicy,
      .termsAndConditions {
        max-width: 30vw;
        min-width: 30vw;
        text-align: center;
      }

      hr {
        margin-bottom: 2rem;
        color: #ffffff;
        height: 0.1px;
      }
    }
  }

  @media (max-width: 1200px) {
    .contact-short {
      max-width: 70vw;
    }
  }
  @media (max-width: 992px) {
    footer {
      padding: 10rem 0 3rem 0;

      .flex {
        flex-direction: column !important;
        gap: 9vw;
        align-items: center;

        .footer-about,
        .footer-social,
        .footer-contact {
          max-width: 100% !important;
          min-width: 100% !important;
        }
      }

      .footer-bottom--section {
        padding-top: 3rem;

        .copyright,
        .termsAndConditions,
        .privacyPolicy {
          max-width: 100% !important;
          min-width: 100% !important;
        }
      }
    }
  }
  @media (max-width: 768px) {
    .contact-short div {
      flex-direction: column !important;
      align-items: center;
    }

    .queryDiv {
      margin-bottom: 25px;
      text-align: center;
    }

    footer {
      padding: 14rem 0 3rem 0;
    }
  }
  @media (max-width: 576px) {
    .contact-short {
      max-width: 80vw;
      margin: 4.8rem auto;
      transform: translateY(0%);
      text-align: center;
    }

    footer {
      padding: 5rem 0 3rem 0;

      .flex {
        gap: 10vw;
      }

      .footer-about {
        margin-inline: 25px !important;
      }

      .footer-social {
        margin-bottom: 1rem;
      }

      .footer-bottom--section {
        padding-top: 2rem;
      }
    }
  }
  @media (max-width: 400px) {
    .contact-short {
      padding: 2rem 2rem;

      .queryDiv h3 {
        font-size: 18px;
      }

      .btn {
        padding: 10px !important;
        font-size: 16px;
      }
    }

    footer {
      padding: 2rem;
    }
  }
  @media (max-width: 300px) {
    .contact-short {
      padding: 1.5rem 1.5rem;

      .queryDiv h3 {
        font-size: 15px;
      }
    }

    footer {
      padding: 2rem;

      .footer-bottom--section {
        padding-top: 0px;
      }
    }
  }
`
