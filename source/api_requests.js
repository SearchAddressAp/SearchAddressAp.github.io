export async function searchTown(queryStr) {
  try {
    const res = await fetch(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=${queryStr}`
    );
    return await res.json();
  } catch (err) {
    alert(err.message);
    throw err;
  }
}

export async function searchAddress(queryStr) {
  try {
    const res = await fetch(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${queryStr}&f=json`
    );
    return res.json();
  } catch (err) {
    alert(err.message);
    throw err;
  }
}
