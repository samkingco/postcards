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

export function randomValue(a?: number, b?: number) {
  if (!a && a !== 0) return Math.random();
  if (!b && b !== 0) return Math.random() * a;
  if (a > b) [a, b] = [b, a];
  return a + Math.random() * (b - a);
}

export function randomInt(a?: number, b?: number) {
  return ~~randomValue(a, b);
}

export function shuffle<T>(arr: Array<T>) {
  let tmpArray = [...arr];
  for (let i = tmpArray.length - 1; i; i--) {
    let randomIndex = randomInt(i + 1);
    [tmpArray[i], tmpArray[randomIndex]] = [tmpArray[randomIndex], tmpArray[i]];
  }
  return tmpArray;
}
