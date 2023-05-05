export async function downloadPeople() {
  const peopleUrl = 'https://swapi.dev/api/people';
  let firstPageData;
  let max = 0;
  let min = 10e6;
  const peopleMap = new Map();
  let result;

  const data = await fetch(peopleUrl).then((response) => response.json());
  firstPageData = data.results;
  const pagesCount = Math.ceil(data.count / 10);
  const allPromises = [];
  for (let i = 2; i <= pagesCount; i++) {
    allPromises.push(
      fetch(`${peopleUrl}/?page=${i}`)
        .then((response) => response.json())
    );
  }
  const arrResponses = await Promise.allSettled(allPromises);

  const resultData = arrResponses.reduce((acc, item) => [...acc, ...item.value.results], [...firstPageData]);

  const people = resultData.map((item, index) => ({
    key: index + 1,
    name: item.name,
    height: item.height === 'unknown' ? '1' : item.height,
    mass: item.mass === 'unknown' ? '1' :
      item.mass === '1,358' ? '3.806' :
        item.mass,
  }));

  const peopleMH = people.map(el => ({
    ...el,
    massXheight: Math.round(el.mass * el.height),
  }));
  peopleMH.forEach(el => {
    if (el.massXheight > max) {
      max = el.massXheight;
    };
    if (el.massXheight < min) {
      min = el.massXheight;
    };
  })

  const peopleRes = peopleMH.map(el => ({
    ...el,
    power: el.massXheight === 666 ? 666 :
      Math.round((10 / max) * el.massXheight),
  }));

  peopleRes.forEach(el => {
    if (peopleMap.has(el.power)) {
      const value = peopleMap.get(el.power) + 1;
      peopleMap.set(el.power, value);
    } else {
      peopleMap.set(el.power, 1);
    }
  });
  console.log(peopleMap);
  result = [...peopleRes];
  return result;
};