var webPush = require('web-push');
 
    const vapidKeys = {
        "publicKey":"BKjmnvDbkfZdevno24ecCezvGAXFncqczNCnDRKKrDUXiHdnBNzBvhujB17_8LDt4BzzVZX80hQznrzyJwbytDM",
        "privateKey":"yeqVS6yxMq8DlQQSXe8P-Q-d8Ht2WL_xOT1Avfp9hzU"
    };
     
     
    webPush.setVapidDetails(
       'mailto:example@yourdomain.org',
       vapidKeys.publicKey,
       vapidKeys.privateKey
    )
    var pushSubscription = {
       "endpoint": "https://fcm.googleapis.com/fcm/send/e3VER-lWvhE:APA91bFtS7WHJHYf70oVgGSDgVHjiQRwP7Zax93b1-VK2i4ureLsDvIBJ4IslV9rpW1u9IE6qq4JR8s2ShaqkNzpEv66Y93mNlcb3Wr15nHdMPt-neo9XDI-w62d0iIcijfOsRH-FHUK",
       "keys": {
           "p256dh": "BNtD04VhvlhlYt3dzrk8mTTC5L4dC+HoFW5e3S20mV8HkaD0yqAyAfUkDGaDDvCCAqfzvpo0dnw3T64Vbb/kGso=",
           "auth": "JSET6ZtSa0tFpUUiXnyrlA=="
       }
    };
    var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
     
    var options = {
       gcmAPIKey: '726613901762',
       TTL: 60
    };
    webPush.sendNotification(
       pushSubscription,
       payload,
       options
    );