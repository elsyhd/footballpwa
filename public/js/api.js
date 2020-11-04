const base_url = "https://api.football-data.org/v2/";
const id_liga = 2003;
const latestUrl = `${base_url}teams/86/matches?status=FINISHED&limit=1`;
const upcomingUrl = `${base_url}teams/81/matches?status=SCHEDULED&limit=1`;
const scheduleUrl = `${base_url}competitions/${id_liga}/matches?status=SCHEDULED&limit=20`;
const matchUrl = `${base_url}matches/`;

const fetchApi = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': '92765693f289409381970154f6deee9a'
        }
    });
}

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

const getLatestMatch=() => {
    if ('caches' in window) {
        caches.match(latestUrl).then((response) => {
            if (response) {
                response.json().then((data) => {
                    lastMatchJSON(data);
                });
            }
        });
    }

    fetchApi(latestUrl)
        .then(status)
        .then(json)
        .then((data) => {
            lastMatchJSON(data)
        })
        .catch(error);
}

const lastMatchJSON = (data) => {
    var LatestHTML = ''
    data.matches.forEach((latest) => {
        latest = JSON.parse(JSON.stringify(latest).replace(/http:/g, 'https:'));
        LatestHTML += `
        <ul class="score">
            <li>${latest.score.fullTime.homeTeam}</li>
            <li>:</li>
            <li>${latest.score.fullTime.awayTeam}</li>
        </ul>
        <ul class="club-title">
            <li class="font-bold">${latest.homeTeam.name}</li>
            <li>VS</li>
            <li class="font-bold">${latest.awayTeam.name}</li>
        </ul>
        <ul class="stadium">
            <li>${latest.competition.name}</li>
        </ul>
        <ul class="date">
            <li class="font-bold">${convertDate(new Date(latest.utcDate))}</li>
        </ul>`
    });
    document.getElementById("latest-content").innerHTML = LatestHTML;
} 

const getUpcoming=()=> {
    if ('caches' in window) {
        caches.match(upcomingUrl).then((response) => {
            if (response) {
                response.json().then((data) => {
                    upcomingMatchJSON(data);
                });
            }
        });
    }

    fetchApi(upcomingUrl)
        .then(status)
        .then(json)
        .then((data)  => {
            upcomingMatchJSON(data)
        })
        .catch(error);
}

const upcomingMatchJSON = (data) => {
    let UpcomingHTML = ''
    data.matches.forEach((upcoming) => {
        upcoming = JSON.parse(JSON.stringify(upcoming).replace(/http:/g, 'https:'));
        UpcomingHTML += `
        <ul class="club-title">
            <li class="font-bold">${upcoming.homeTeam.name}</li>
            <li>VS</li>
            <li class="font-bold">${upcoming.awayTeam.name}</li>
        </ul>
        <ul class="stadium">
            <li>${upcoming.competition.name}</li>
        </ul>
        <ul class="date">
            <li class="font-bold">${convertDate(new Date(upcoming.utcDate))}</li>
        </ul>`
    });
    document.getElementById("upcoming-content").innerHTML = UpcomingHTML;
}

const getMatchLeague = () => {
    return new Promise((resolve, reject) => {

        if ('caches' in window) {
            caches.match(scheduleUrl).then((response) => {
                if (response) {
                    response.json().then((data) => {
                        resultMatchJSON(data);
                        resolve(data);
                    });
                }
            });
        }

        fetchApi(scheduleUrl)
            .then(status)
            .then(json)
            .then((data) => {
                resultMatchJSON(data);
                resolve(data);
            })
            .catch(error);
    });
}

const resultMatchJSON = (data) => {
    let JadwalHTML = ''
    data.matches.forEach((match) => {
      JadwalHTML += `
          <div class="col s12 m6 l4">
          <div class="card">
            <div class="card-content">
              <div center-align>
                <h5 class="center-align">Matchday : ${match.matchday}</h5>
                <div class="center-align">Kick Off : ${convertDate(new Date(match.utcDate))}</div>
          
                <div class="row" style="margin:20px">
                  <div class="col s5 truncate right-align">
                    <span class="blue-grey-text">  ${match.homeTeam.name}</span>
                  </div>
                  <div class="col s2 ">
                    VS
                  </div>
                  <div class="col s5 truncate left-align">
                    <span class="blue-grey-text">  ${match.awayTeam.name}</span>
                  </div>
                </div>
                <div class="center-align">
                  <a class="blue-grey waves-effect waves-light btn" href="./detail_match.html?id=${match.id}">See Detail</a>
                </div>
              </div>
            </div>
          </div>
        </div>`
    });
    document.getElementById("jadwal-content").innerHTML = JadwalHTML;
  }

const getDetailMatch = () => {
    return new Promise((resolve, reject) => {
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");
        if ('caches' in window) {
            caches.match(matchUrl + idParam).then((response) => {
                if (response) {
                    response.json().then(function (data) {
                        resultDetailMatchJSON(data);
                        resolve(data)
                    });
                }
            });
        }
        fetchApi(matchUrl + idParam)
            .then(status)
            .then(json)
            .then((data) => {
                resultDetailMatchJSON(data);

                resolve(data);
            })
            .catch(error);
    });
}

const resultDetailMatchJSON = (data) => {
    const matchDay = data.match.matchday;
    const kickOff = convertDate(new Date(data.match.utcDate));
    const homeTeamName = data.match.homeTeam.name;
    const awayTeamName = data.match.awayTeam.name;
    const venue = data.match.venue;

    document.getElementById("matchDay").innerHTML = `Matchday : ${matchDay}`;
    document.getElementById("kickOff").innerHTML = `Kick Off : ${kickOff}`;
    document.getElementById("homeTeamName").innerHTML = homeTeamName;
    document.getElementById("awayTeamName").innerHTML = awayTeamName;
    document.getElementById("venue").innerHTML = venue;
    document.getElementById("preloader").innerHTML = '';
}

const getSavedMatch = () => {
    getAll().then((articles) => {
     
      let matchesHTML = "";
      articles.forEach((data) => {
        matchesHTML += `
        <div class="col s12 m6 l4">
        <div class="card">
          <div class="card-content">
            <div center-align>
              <h5 class="center-align">Matchday : ${data.matchday}</h5>
              <div class="center-align">Kick Off : ${convertDate(new Date(data.utcDate))}</div>
        
              <div class="row" style="margin:20px">
                <div class="col s5 truncate right-align">
                  <span class="blue-grey-text">  ${data.homeTeam}</span>
                </div>
                <div class="col s2 ">
                  VS
                </div>
                <div class="col s5 truncate left-align">
                  <span class="blue-grey-text">  ${data.awayTeam}</span>
                </div>
              </div>
              <div class="center-align">
                  <a class="blue-grey waves-effect waves-light btn" href="./detail_match.html?id=${data.id}">See Detail</a>
                </div>
            </div>
            
          </div>
        </div>
      </div>
                  `;
      })
      if(articles.length == 0) matchesHTML += '<h6 class="center-align black-text">No matches have been saved yet</6>';
      document.getElementById("saved-match").innerHTML = matchesHTML;
    });
    
  }

