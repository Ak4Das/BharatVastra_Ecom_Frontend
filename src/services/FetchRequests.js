export async function fetchAllCloths(setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch("http://localhost:3000/cloth/", {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchClothById(clothId, setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`http://localhost:3000/cloth/${clothId}`, {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchNewArrivalCloths(setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`http://localhost:3000/cloth/newArrive/true`, {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchDistinctCommonCategories(setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(
      `http://localhost:3000/cloth/categories/distinct`,
      {
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchClothsByMainCategory(
  mainCategory,
  setFunction,
  setIsError,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(
      `http://localhost:3000/cloth/mainCategory/${mainCategory}`,
      {
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchClothsByCommonCategory(
  commonCategory,
  setFunction,
  setIsError,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(
      `http://localhost:3000/cloth/commonCategory/${commonCategory}`,
      {
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchOfferOnACategory(
  commonCategory,
  setFunction,
  setIsError,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(
      `http://localhost:3000/cloth/offer/${commonCategory}`,
      {
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchAllCategories(setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch("http://localhost:3000/category/", {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchCategory(category, setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`http://localhost:3000/category/${category}`, {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function updateClothById(id, clothData, setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`http://localhost:3000/cloth/update/${id}`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(clothData),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchCreateOrderByUserIdAndUpdate(
  userId,
  createOrder,
  setFunction,
  setIsError,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(
      `http://localhost:3000/createOrder/updateItems/${userId}`,
      {
        method: "PATCH",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(createOrder),
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchCreateOrder(setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch("http://localhost:3000/createOrder/", {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchCreateOrderByUserId(
  userId,
  setFunction,
  setIsError,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(
      `http://localhost:3000/createOrder/${userId}`,
      {
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function updateAllItemsInCreateOrder(
  url,
  itemsData,
  setFunction,
  setIsError,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(itemsData),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchCreateOrderByUserIdAndDelete(
  userId,
  setFunction,
  setIsError,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(
      `http://localhost:3000/createOrder/delete/userId/${userId}`,
      {
        method: "DELETE",
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchAllUsers(setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch("http://localhost:3000/user/", {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchUserById(id, setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`http://localhost:3000/user/${id}`, {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function updateUser(
  id,
  data,
  setFunction,
  setIsError,
  setUpdated,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(
      `http://localhost:3000/user/updateUser/${id}`,
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const Data = await response.json()
    setFunction && setFunction(Data)
    setUpdated && setUpdated(true)
    return Data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function updateAddressOfUser(
  id,
  addresses,
  setFunction,
  setIsError,
  setUpdated,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)
  
  try {
    const response = await fetch(
      `http://localhost:3000/user/updateUserAddress/${id}`,
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(addresses),
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    setUpdated && setUpdated(true)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function updateWishlistItemsInUser(
  id,
  items,
  setFunction,
  setIsError,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(
      `http://localhost:3000/user/updateWishlistItems/${id}`,
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(items),
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function updateCartItemsInUser(
  id,
  items,
  setFunction,
  setIsError,
) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(
      `http://localhost:3000/user/updateCartItems/${id}`,
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(items),
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function saveNewUser(newUser, setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch("http://localhost:3000/user/saveUser", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function saveCreateOrder(createOrder, setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch("http://localhost:3000/createOrder/saveItem", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(createOrder),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function saveNewOrder(newOrder, setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch("http://localhost:3000/order/saveOrder", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchAllOrders(setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch("http://localhost:3000/order/", {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchAllOrdersByUserId(userId, setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`http://localhost:3000/order/user/${userId}`, {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function fetchOrderByOrderId(orderId, setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`http://localhost:3000/order/${orderId}`, {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function deleteOrderById(id, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`http://localhost:3000/order/delete/${id}`, {
      method: "DELETE",
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}

export async function updateOrder(id, data, setFunction, setIsError) {
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`http://localhost:3000/order/update/${id}`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const Data = await response.json()
    setFunction && setFunction(Data)
    return Data
  } catch (error) {
    clearTimeout(timerId)

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    throw error
  }
}
