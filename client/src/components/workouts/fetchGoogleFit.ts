
const fetchGoogleFitData = async (token: string) => {
  try {
    const res = await fetch(
      "https://www.googleapis.com/fitness/v1/users/me/dataSources",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch Google Fit data");
    }

    const data = await res.json();
    console.log("Google Fit Data:", data);
    return data; 
  } catch (error) {
    console.error("Error fetching Google Fit data:", error);
    return null;
  }
};

export default fetchGoogleFitData;
