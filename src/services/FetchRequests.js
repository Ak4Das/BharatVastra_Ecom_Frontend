let url = null
if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
  url = "http://localhost:3000"
} else {
  url = "https://bharat-vastra-ecom-backend.vercel.app"
}

export async function fetchCloths(obj) {
  const { params, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const {
      mainCategory,
      commonCategory,
      price,
      rating,
      sortBy,
      gender,
      age,
      search,
      page,
      limit,
    } = params

    const response = await fetch(
      `${url}/cloth?mainCategory=${mainCategory}&commonCategory=${commonCategory}&price=${price}&rating=${rating}&sortBy=${sortBy}&gender=${gender}&age=${age}&search=${search}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchClothById(obj) {
  const { clothId, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/cloth/${clothId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchNewArrivalCloths(obj) {
  const { query, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const { currentPage, itemsPerPage, search } = query

    const response = await fetch(
      `${url}/cloth/newArrive/true?page=${currentPage}&limit=${itemsPerPage}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchDistinctCommonCategories(obj) {
  const { setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/cloth/categories/distinct`, {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchClothsByMainCategory(obj) {
  const { mainCategory, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/cloth/mainCategory/${mainCategory}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchClothsByCommonCategory(obj) {
  const { commonCategory, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(
      `${url}/cloth/commonCategory/${commonCategory}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchOfferOnACategory(obj) {
  const { commonCategory, query, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const { page, gender, search } = query

    const response = await fetch(
      `${url}/cloth/offer/${commonCategory}?page=${page}&gender=${gender}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        },
        signal: controller.signal,
      },
    )

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchAllCategories(obj) {
  const { setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/category/`, {
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchCategory(obj) {
  const { category, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/category/${category}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function updateClothById(obj) {
  const { id, clothData, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/cloth/update/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify(clothData),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchCreateOrderByUserIdAndUpdate(obj) {
  const { userId, createOrder, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/createOrder/updateItems/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify(createOrder),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchCreateOrder(obj) {
  const { setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/createOrder/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchCreateOrderByUserId(obj) {
  const { userId, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/createOrder/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchCreateOrderByUserIdAndDelete(obj) {
  const { userId, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/createOrder/delete/userId/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      method: "DELETE",
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchAllUsers(obj) {
  const { setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/user/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchMe(obj) {
  const { setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/user/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function updateUser(obj) {
  const { data, setFunction, setIsError, setUpdated, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/user/updateUser`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const Data = await response.json()

    if (!response.ok) {
      throw new Error(Data.message)
    }

    setFunction && setFunction(Data.respondedData)
    setUpdated && setUpdated(true)
    return Data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function updateAddressOfUser(obj) {
  const { addresses, setFunction, setIsError, setUpdated, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/user/updateUserAddress`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify(addresses),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    setUpdated && setUpdated(true)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function updateWishlistItemsInUser(obj) {
  const { items, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/user/updateWishlistItems`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify(items),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function updateCartItemsInUser(obj) {
  const { items, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/user/updateCartItems`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify(items),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function signup(obj) {
  const { newUser, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/auth/signup`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function login(obj) {
  const { body, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data)
    return data
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function saveCreateOrder(obj) {
  const { createOrder, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/createOrder/saveItem`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify(createOrder),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function saveNewOrder(obj) {
  const { newOrder, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/order/saveOrder`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchAllOrders(obj) {
  const { setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/order/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchAllOrdersByUserId(obj) {
  const { userId, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/order/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function fetchOrderByOrderId(obj) {
  const { orderId, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setFunction && setFunction(data.respondedData)
    return data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function deleteOrderById(obj) {
  const { id, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/order/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const deletedOrder = await response.json()

    if (!response.ok) {
      throw new Error(deletedOrder.message)
    }

    return deletedOrder.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}

export async function updateOrder(obj) {
  const { id, data, setFunction, setIsError, navigate } = obj
  const controller = new AbortController()

  const timerId = setTimeout(() => {
    controller.abort()
  }, 20000)

  try {
    const response = await fetch(`${url}/order/update/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bv_token")}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    })

    clearTimeout(timerId)

    const Data = await response.json()

    if (!response.ok) {
      throw new Error(Data.message)
    }

    setFunction && setFunction(Data.respondedData)
    return Data.respondedData
  } catch (error) {
    clearTimeout(timerId)

    if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
      console.dir(error)
    }

    if (error.name === "AbortError") {
      setIsError && setIsError("Request timeout")
      return
    }

    if (error.message === "Access Denied: Invalid Token.") {
      navigate && navigate("/login")
    }

    setIsError && setIsError(error.message)
  }
}
