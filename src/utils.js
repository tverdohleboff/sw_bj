export async function downloadPeople() {

  const peopleUrl = 'https://swapi.dev/api/people';
  let firstPageData;
  let max = 0;
  let min = 10e6;
  const peopleMap = new Map();

  fetch(peopleUrl)
    .then((response) => response.json())
    .then((data) => {
      firstPageData = data.results;
      const pagesCount = Math.ceil(data.count / 10);
      const allPromises = [];
      for (let i = 2; i <= pagesCount; i++) {
        allPromises.push(
          fetch(`${peopleUrl}/?page=${i}`)
            .then((response) => response.json())
        );
      }
      return Promise.allSettled(allPromises);
    })
    .then((arrResponses) => {
      const resultData = arrResponses.reduce((acc, item) => [...acc, ...item.value.results], [...firstPageData]);
      return resultData;
    })
    .then((arr) => {
      const people = arr.map((item, index) => ({
        key: index + 1,
        name: item.name,
        height: item.height === 'unknown' ? '1' : item.height,
        mass: item.mass === 'unknown' ? '1' :
          item.mass === '1,358' ? '3.806' :
            item.mass,
      }));
      return people;
    })
    .then((arrMH) => {
      const peopleMH = arrMH.map(el => ({
        ...el,
        massXheight: Math.round(el.mass * el.height),
      }));
      return peopleMH;
    })
    .then((sArr) => {
      sArr.forEach(el => {
        if (el.massXheight > max) {
          max = el.massXheight;
        };
        if (el.massXheight < min) {
          min = el.massXheight;
        };
      })
      console.log("max:", max, "min:", min);
      return sArr;
    })
    .then((rArr) => {
      const peopleRes = rArr.map(el => ({
        ...el,
        power: el.massXheight === 666 ? 666 :
          Math.round((10 / max) * el.massXheight),
      }));
      console.log(peopleRes);
      return peopleRes;
    })
    .then((yArr) => {
      yArr.forEach(el => {
        if (peopleMap.has(el.power)) {
          const value = peopleMap.get(el.power) + 1;
          peopleMap.set(el.power, value);
        } else {
          peopleMap.set(el.power, 1);
        }
      });
      console.log(peopleMap);
      return yArr;
    })
}