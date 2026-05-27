import styles from "../style_modules/components_modules/Offcanvas.module.css"
import crossBtn from "../assets/images/close.png"
import { useState } from "react"

export default function Offcanvas({
  setPrice,
  setRating,
  setSortBy,
  setGender,
  productCategory,
  setProductCategory,
  setUpdate,
  age,
  setAge,
  isCategory,
  setShowHamburgerPointer,
}) {
  // open useState is used only to open or close Offcanvas
  const [open, setOpen] = useState(false)
  function filterWithPrice(e) {
    setPrice(e.target.value)
  }
  function filterByRating(e) {
    setRating(e.target.value)
  }
  function filterBySort(e) {
    setSortBy(e.target.value)
  }
  function filterByGender(e) {
    setGender(e.target.value)
  }
  function filterByCategory(e) {
    if (e.target.checked) {
      productCategory.push(e.target.value)
      setProductCategory(productCategory)
      setUpdate(true)
    } else {
      setProductCategory(
        productCategory.filter((category) => category !== e.target.value),
      )
    }
  }
  function filterByAge(e) {
    if (e.target.checked) {
      age.push(e.target.value)
      setAge(age)
      setUpdate(true)
    } else {
      setAge(age.filter((age) => age !== e.target.value))
    }
  }
  function resetFilters() {
    setPrice(0)
    setRating(0)
    setSortBy("")
    setGender("")
    setProductCategory([])
    setAge([])
  }
  function handleClick() {
    setOpen(open ? false : true)
    setShowHamburgerPointer(false)
  }
  return (
    <form>
      <div
        style={{
          zIndex: open ? 7 : 2,
        }}
        className={`bg-light-subtle px-5 py-3 d-inline-block ${open ? styles.left_neutral : styles.left_negative} ${styles.offcanvasFilterForm}`}
      >
        {open ? (
          <img
            src={crossBtn}
            alt="close button"
            className={`${styles.logo} ${styles.button}`}
            onClick={handleClick}
            title="filter"
          />
        ) : (
          <button
            className={`rounded bi bi-list mt-2 ${styles.button}`}
            type="button"
            onClick={handleClick}
            title="filter"
          ></button>
        )}
        <div className="d-flex justify-content-between my-3">
          <b>Filters</b>
          <button
            className="btn btn-danger btn-sm"
            type="reset"
            onClick={resetFilters}
          >
            Clear
          </button>
        </div>
        <section className="my-3">
          <b>Price</b>
          <div className="d-flex justify-content-between">
            <span>0</span>
            <span>10000</span>
            <span>20000</span>
          </div>
          <input
            type="range"
            className="w-100"
            onChange={filterWithPrice}
            min={0}
            max={20000}
            defaultValue={0}
          />
        </section>
        <section className="my-3">
          <b>Gender</b>
          <div className="mt-2 form-check">
            <input
              type="radio"
              name="category"
              id="menClothing"
              value="male"
              className="form-check-input"
              onClick={filterByGender}
            />
            <label htmlFor="menClothing">Male</label>
            <br />
            <input
              type="radio"
              name="category"
              id="menClothing"
              value="female"
              className="form-check-input"
              onClick={filterByGender}
            />
            <label htmlFor="menClothing">Female</label>
          </div>
        </section>
        <section className="my-3">
          <b>Rating</b>
          <div className="mt-2">
            <input
              type="radio"
              name="rating"
              id="fourStarsAndAbove"
              value={4}
              onChange={filterByRating}
            />
            <label htmlFor="fourStarsAndAbove" className="ms-2">
              4 stars and above
            </label>
            <br />
            <input
              type="radio"
              name="rating"
              id="threeStarsAndAbove"
              value={3}
              onChange={filterByRating}
            />
            <label htmlFor="threeStarsAndAbove" className="ms-2">
              3 stars and above
            </label>
            <br />
            <input
              type="radio"
              name="rating"
              id="twoStarsAndAbove"
              value={2}
              onChange={filterByRating}
            />
            <label htmlFor="twoStarsAndAbove" className="ms-2">
              2 stars and above
            </label>
            <br />
            <input
              type="radio"
              name="rating"
              id="oneStarsAndAbove"
              value={1}
              onChange={filterByRating}
            />
            <label htmlFor="oneStarsAndAbove" className="ms-2">
              1 stars and above
            </label>
          </div>
        </section>
        <section className="my-3">
          <b>Sort by</b>
          <div className="mt-2">
            <input
              type="radio"
              name="sortBy"
              id="lowToHigh"
              value="lowToHigh"
              onChange={filterBySort}
            />
            <label htmlFor="lowToHigh" className="ms-2">
              Price - Low to High
            </label>
            <br />
            <input
              type="radio"
              name="sortBy"
              id="highToLow"
              value="highToLow"
              onChange={filterBySort}
            />
            <label htmlFor="highToLow" className="ms-2">
              Price - High to Low
            </label>
          </div>
        </section>
        <section className="my-3">
          <b>Category</b>
          <div className="mt-2">
            <input
              id="Suit"
              type="checkbox"
              value="suit"
              onChange={filterByCategory}
            />
            <label htmlFor="Suit" className="ms-2">
              Suit
            </label>
            <br />
            <input
              id="pant"
              type="checkbox"
              value="pant"
              onChange={filterByCategory}
            />
            <label htmlFor="pant" className="ms-2">
              Pant
            </label>
            <br />
            <input
              id="tShirt"
              type="checkbox"
              value="tShirt"
              onChange={filterByCategory}
            />
            <label htmlFor="tShirt" className="ms-2">
              T - Shirt
            </label>
            <br />
            <input
              id="bermuda"
              type="checkbox"
              value="bermuda"
              onChange={filterByCategory}
            />
            <label htmlFor="bermuda" className="ms-2">
              Bermuda
            </label>
            <br />
            <input
              id="panjabi"
              type="checkbox"
              value="panjabi"
              onChange={filterByCategory}
            />
            <label htmlFor="panjabi" className="ms-2">
              panjabi
            </label>
            <br />
            <input
              id="jeans"
              type="checkbox"
              value="jeans"
              onChange={filterByCategory}
            />
            <label htmlFor="jeans" className="ms-2">
              Jeans
            </label>
            <br />
            <input
              id="shoes"
              type="checkbox"
              value="shoes"
              onChange={filterByCategory}
            />
            <label htmlFor="shoes" className="ms-2">
              Shoes
            </label>
            <br />
            <input
              id="saree"
              type="checkbox"
              value="saree"
              onChange={filterByCategory}
            />
            <label htmlFor="saree" className="ms-2">
              Saree
            </label>
            <br />
            <input
              id="lehenga"
              type="checkbox"
              value="lehenga"
              onChange={filterByCategory}
            />
            <label htmlFor="lehenga" className="ms-2">
              Lehenga
            </label>
            <br />
            <input
              id="gopiDress"
              type="checkbox"
              value="gopiDress"
              onChange={filterByCategory}
            />
            <label htmlFor="gopiDress" className="ms-2">
              Gopi Dress
            </label>
            <br />
          </div>
        </section>
        {!isCategory && (
          <section className="my-3">
            <b>Age</b>
            <div className="mt-2">
              <input
                id="child"
                type="checkbox"
                value="child"
                onChange={filterByAge}
              />
              <label htmlFor="child" className="ms-2">
                Child
              </label>
              <br />
              <input
                id="teenager"
                type="checkbox"
                value="teenager"
                onChange={filterByAge}
              />
              <label htmlFor="teenager" className="ms-2">
                Teenager
              </label>
              <br />
              <input
                id="youngAdult"
                type="checkbox"
                value="youngAdult"
                onChange={filterByAge}
              />
              <label htmlFor="youngAdult" className="ms-2">
                Young Adult
              </label>
              <br />
              <input
                id="adult"
                type="checkbox"
                value="adult"
                onChange={filterByAge}
              />
              <label htmlFor="adult" className="ms-2">
                Adult
              </label>
              <br />
              <input
                id="matureAdult"
                type="checkbox"
                value="matureAdult"
                onChange={filterByAge}
              />
              <label htmlFor="matureAdult" className="ms-2">
                Mature Adult
              </label>
              <br />
              <input
                id="senior"
                type="checkbox"
                value="senior"
                onChange={filterByAge}
              />
              <label htmlFor="senior" className="ms-2">
                Senior
              </label>
              <br />
            </div>
          </section>
        )}
      </div>
    </form>
  )
}
