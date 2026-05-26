export function Search(clothsData, query) {
  function tokenize(text) {
    const normalized = text
    const tokens = []
    let currentWord = ""

    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i]

      if (char === " " || char === "," || char === ".") {
        if (currentWord) {
          tokens.push(currentWord)
          currentWord = ""
        }
      } else {
        currentWord += char
      }
    }

    if (currentWord) tokens.push(currentWord)

    return tokens
  }

  function searchProducts(products, query) {
    const queryTokens = tokenize(query.toLowerCase())

    return products
      .map((product) => {
        const name =
          typeof product === "string"
            ? product.toLowerCase()
            : product.commonCategory.toLowerCase()
        let score = 0

        // Exact match
        if (name.includes(query.toLowerCase())) {
          score = queryTokens.length
        } else {
          // Token match
          queryTokens.forEach((token) => {
            if (name.includes(token)) {
              score++
            } else {
              let matchCount = 0

              for (let i = 0; i < token.length; i++) {
                if (name.includes(token[i])) {
                  matchCount++
                }
              }

              const similarity = matchCount / token.length

              if (similarity > 0.6) {
                score += similarity
              }
            }
          })
        }
        return typeof product === "string"
          ? { product, score }
          : { ...product, score }
      })
      .filter((p) => p.score > 0)
  }

  function rankedSearchProducts(products, query) {
    const searchProductArray = searchProducts(products, query)
    for (let i = 0; i < searchProductArray.length; i++) {
      for (let j = i + 1; j < searchProductArray.length; j++) {
        if (searchProductArray[j].score > searchProductArray[i].score) {
          let a = searchProductArray[i]
          searchProductArray[i] = searchProductArray[j]
          searchProductArray[j] = a
        }
      }
    }
    return searchProductArray
  }

  return rankedSearchProducts(clothsData, query)
}
