const extractLocation = (address) => {
  const parts = address.split(",");
  if (parts.length > 1) {
    const locationPart = parts[1].trim();
    const [city, district] = locationPart.split(" ");
    return `${city} ${district}`;
  }
  return;
};

export default extractLocation;
