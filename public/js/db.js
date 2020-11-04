const dbPromised = idb.open("fitballdb", 1, (upgradeDb) => {
  
  if (!upgradeDb.objectStoreNames.contains("saved-match")) {
    const indexSavedMatch = upgradeDb.createObjectStore("saved-match", {
        keyPath: "id"
    });
    indexSavedMatch.createIndex("homeTeam", "data.hemeTeam.name", {
        unique: false
    });
    indexSavedMatch.createIndex("awayTeam", "data.awayTeam.name", {
      unique: false
  });
} 
});

const cekData = (id) => {
  return new Promise((resolve, reject) => {
      dbPromised
          .then((db) => {
              let tx = db.transaction('saved-match', "readonly");
              let store = tx.objectStore('saved-match');
              return store.get(id);
          })
          .then((data) => {
              if (data != undefined) {
                  resolve("data favorit")
              } else {
                  reject("bukan data favorit")
              }
          });
  });
}

const saveForLater = (data) => {
  let dataToStore = {
    id: data.match.id,
    utcDate: data.match.utcDate,
    venue: data.match.venue,
    matchday: data.match.matchday,
    homeTeam: data.match.homeTeam.name,
    awayTeam: data.match.awayTeam.name
	}
  dbPromised
    .then((db) => {
      let tx = db.transaction("saved-match", "readwrite");
      let store = tx.objectStore("saved-match");
      console.log('store: ', store)
      console.log('dataToStore: ', dataToStore);

      store.put(dataToStore);
      return tx.complete;
    })
    .then(() => {
      M.toast({
        html: `Data berhasil disimpan`
      });
    }).catch(()=> {
      M.toast({
        html: `Terjadi kesalahan`
      });
    });
}
const getAll = () => {
  return new Promise((resolve, reject) => {
    dbPromised
      .then((db) => {
        let tx = db.transaction("saved-match", "readonly");
        let store = tx.objectStore("saved-match");
        return store.getAll();
      })
      .then((articles) => {
        resolve(articles);
      });
  });
}


const deleteSavedMatch = (id) => {
  dbPromised
    .then((db) => {
      let tx = db.transaction("saved-match", "readwrite");
      let store = tx.objectStore("saved-match");
      console.log('store: ', store)
      console.log('dataToDelete: ', id);

      store.delete(id);
      return tx.complete;
    })
    .then(() => {
      M.toast({
        html: `Data berhasil dihapus`
      });
    }).catch(()=> {
      M.toast({
        html: `Terjadi kesalahan`
      });
    });
}