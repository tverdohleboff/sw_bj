export function getFromSessionStorage(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

export function syncWithSessionStorage(key, value) {
  const serializedValue = JSON.stringify(value);
  sessionStorage.setItem(key, serializedValue);
}

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

export async function flickerPlayer(steps) {
  let count = steps;
  const blue = document.querySelector('#playerBlue');
  const red = document.querySelector('#playerRed');

  do {
    await new Promise(resolve => setTimeout(resolve, 360));
    blue.classList.add('greyColored');
    red.classList.remove('greyColored');
    await new Promise(resolve => setTimeout(resolve, 360));
    blue.classList.remove('greyColored');
    red.classList.add('greyColored');
    count--;
  } while (count !== 0);

  blue.classList.add('greyColored');
  red.classList.add('greyColored');

  if (steps % 2) {
    syncWithSessionStorage('statusGame', 'Blue');
    blue.classList.remove('disable');
    blue.classList.remove('greyColored');
  } else {
    syncWithSessionStorage('statusGame', 'Red');
    red.classList.remove('disable');
    red.classList.remove('greyColored');
  }
  document.querySelector('#stopButton').classList.remove('disable');
  document.querySelector('#stopButton').classList.remove('greyColored');

  return (steps % 2) ? 'Blue' : 'Red';
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function blocker() {
  document.querySelector('#stopButton').classList.add('disable');
  document.querySelector('#stopButton').classList.add('greyColored');
  document.querySelector('#playerBlue').classList.add('disable');
  document.querySelector('#playerBlue').classList.add('greyColored');
  document.querySelector('#playerRed').classList.add('disable');
  document.querySelector('#playerRed').classList.add('greyColored');
}

export function winners(player) {
  document.querySelector("#win").style.display = "flex";
  document.querySelector("#game").style.display = "none";
  switch (player) {
    case 'blue':
      document.querySelector('#winTitle').textContent = `Blue WINS!`;
      document.querySelector('.App').classList.add('sameBlue');
      break;
    case 'red':
      document.querySelector('#winTitle').textContent = `RED WINS!`;
      document.querySelector('.App').classList.add('sameRed');
      break;
    case 'blueJabba':
      document.querySelector('#containerJabba').style.display = 'flex';
      document.querySelector('#winTitle').textContent = `You lucky and take Jabba.
      Blue WINS!`;
      document.querySelector('.App').classList.add('sameBlue');
      break;
    case 'redJabba':
      document.querySelector('#containerJabba').style.display = 'flex';
      document.querySelector('#winTitle').textContent = `You lucky and take Jabba.
    RED WINS!`;
      document.querySelector('.App').classList.add('sameRed');
      break;
    default:
      document.querySelector('#winTitle').textContent = `You WIN, but how?!`;
      document.querySelector('.App').classList.add('sameWin');
  }
  syncWithSessionStorage('statusGame', 'done');
}

export function winnerByPoints(blueValue, redValue) {
  document.querySelector("#win").style.display = "inline";
  document.querySelector("#game").style.display = "none";
  if (blueValue > redValue) {
    document.querySelector('#winTitle').textContent = `Blue WINS!`;
    document.querySelector('.App').classList.add('sameBlue');
  } else if (redValue > blueValue) {
    document.querySelector('#winTitle').textContent = `RED WINS!`;
    document.querySelector('.App').classList.add('sameRed');
  } else if (blueValue === redValue) {
    document.querySelector('#winTitle').textContent = `FRIENDSHIPS!`;
    document.querySelector('.App').classList.add('sameGreen');
  } else {
    document.querySelector('#winTitle').textContent = `Impossible! You WIN!`;
    document.querySelector('.App').classList.add('sameWin');
  }
  syncWithSessionStorage('statusGame', 'done');
}