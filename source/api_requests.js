export async function searchTown(queryStr) {
  try {
    const res = await fetch(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=${queryStr}`
    );
    return res.json();
  } catch (err) {
    alert(err.message);
    throw err;
  }
}
