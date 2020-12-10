export interface ResponseError extends Error {
  status?: number;
}

export async function fetchGetJSON(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const error: ResponseError = new Error("Something went wrong");
      const json = await res.json();
      error.message = json.message || undefined;
      error.status = res.status;
      throw error;
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function fetchPostJSON(url: string, data?: {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data || {}),
    });
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
}
