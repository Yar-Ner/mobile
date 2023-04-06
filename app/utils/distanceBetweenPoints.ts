function deg2rad(num: number) {
  // Функция для перевода градусов в радианы

  return (num * Math.PI) / 180;
}

export function distanceBetweenPoints(
  lat_1: number,
  lon_1: number,
  lat_2: number,
  lon_2: number,
) {
  const radius_earth = 6371; // Радиус Земли

  let _lat_1 = deg2rad(lat_1),
    _lon_1 = deg2rad(lon_1),
    _lat_2 = deg2rad(lat_2),
    _lon_2 = deg2rad(lon_2);

  var d =
    2 *
    radius_earth *
    Math.asin(
      Math.sqrt(
        Math.sin((_lat_2 - _lat_1) / 2) ** 2 +
          Math.cos(_lat_1) *
            Math.cos(_lat_2) *
            Math.sin((_lon_2 - _lon_1) / 2) ** 2,
      ),
    );

  return Number(d.toFixed(3));
}
