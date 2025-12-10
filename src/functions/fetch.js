const base = process.env.NEXT_PUBLIC_API_BASE;


const token = localStorage.getItem("authToken");

const res = await fetch(`${base}/user/roadmaps/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    cache: "no-store",
  });


const fetch = async (url, options) => {
  const res = await fetch(`${base}${url}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...((options?.authRequired && token) ? { Authorization: `Token ${token}` } : {}),
    },
    cache: "no-store",
  });
  return res;
};

export default fetch