"use strict";var precacheConfig=[["/index.html","568ef2b11fb19cfeed9e62e1a605978f"],["/static/css/main.cf963f20.css","ca7b112689936f4c0b698b32de23652e"],["/static/js/main.0c88815a.js","9afe7a3e78724c88da4a2d927ab2bc90"],["/static/media/004-arrow-right.562adbaf.svg","562adbaf0190d41d39681989251f223c"],["/static/media/TheSansB_200_.2a33539e.woff","2a33539e9abe6f64c6fa4ea334bfc0b0"],["/static/media/TheSansB_200_.679faccb.woff2","679faccb4ec43aa7cc0d1f7d09bf16e7"],["/static/media/TheSansB_200_.8559527b.svg","8559527b2e90515a40d18370e99827f5"],["/static/media/TheSansB_200_.930b3d9b.ttf","930b3d9bc0bb52019d7312ed111e04a6"],["/static/media/TheSansB_200_.c10944a8.eot","c10944a895fe67093b0b9a5370f051e1"],["/static/media/TheSansB_200i.140df1c0.woff2","140df1c01a5da86fb4c65df9ab782af9"],["/static/media/TheSansB_200i.a49b933e.ttf","a49b933eeb32638853f90a520534d7b3"],["/static/media/TheSansB_200i.db914675.svg","db914675b1bac07c04ef02b98255142c"],["/static/media/TheSansB_200i.ec3dd64f.eot","ec3dd64f56adb3b9248b3b2546a3baad"],["/static/media/TheSansB_200i.f1be244d.woff","f1be244d6f284ec46a7a80f0b003f2b5"],["/static/media/TheSansB_300_.241175cc.woff","241175cc22247923e2aa4702856fa27e"],["/static/media/TheSansB_300_.463f7e45.eot","463f7e4577f2235502a28788ca549ab0"],["/static/media/TheSansB_300_.725d06ae.woff2","725d06aefcb68dc767cf1bc91d7b5c1e"],["/static/media/TheSansB_300_.e62b6fba.svg","e62b6fbacb1dacf445173f8a340526f6"],["/static/media/TheSansB_300_.ea4a24d4.ttf","ea4a24d490218e110e072acdf4832f9a"],["/static/media/TheSansB_300i.4ca53d4a.ttf","4ca53d4a4cd66fd7b44d5ff400748da8"],["/static/media/TheSansB_300i.9c1bde9a.woff","9c1bde9a85c2797ee76f5aae45dd42ac"],["/static/media/TheSansB_300i.a75d8ced.eot","a75d8ced705e149b1f7d21c85b7f429c"],["/static/media/TheSansB_300i.bb07e13c.woff2","bb07e13c5ba8343dd43750e206aefc99"],["/static/media/TheSansB_300i.fc46e020.svg","fc46e02008cfb38c060b7c5876f2322a"],["/static/media/TheSansB_400_.4b12e242.svg","4b12e24232d9fc9fecc24912b975fe99"],["/static/media/TheSansB_400_.4bbcd055.ttf","4bbcd055023eeb44538a47d343e0966f"],["/static/media/TheSansB_400_.4f0d59a1.woff2","4f0d59a18ca1c88dcfbbce6510b21da5"],["/static/media/TheSansB_400_.638852fa.eot","638852fa42bbdee356f68ada32542a60"],["/static/media/TheSansB_400_.f5ebe8b3.woff","f5ebe8b3d957cb3898cdfcd302368b82"],["/static/media/TheSansB_400i.23248f72.ttf","23248f72f5be97d5d6248baf68082816"],["/static/media/TheSansB_400i.299cf3c5.woff","299cf3c56f897b02c06ae97ee11c6a71"],["/static/media/TheSansB_400i.33ba31da.woff2","33ba31da9b75b8d3eb8f86d6d8b2ca57"],["/static/media/TheSansB_400i.a00f3106.eot","a00f31067d6ed091f0761c39dc0e3bb1"],["/static/media/TheSansB_400i.d83cc266.svg","d83cc2668a6f90ff8dd48a61cf61e11a"],["/static/media/TheSansB_500_.2d508269.svg","2d50826969e70fd05809f323883887de"],["/static/media/TheSansB_500_.77aebf7a.ttf","77aebf7a93804925658668cfef7fc22d"],["/static/media/TheSansB_500_.aa3f4ced.woff","aa3f4cedc5abdb7a9b75a9280c4129c8"],["/static/media/TheSansB_500_.d7955bec.woff2","d7955bec1417e0168f42adfe7ceaf8b5"],["/static/media/TheSansB_500_.e9f141c1.eot","e9f141c181dfd76c5c7d01749f058271"],["/static/media/TheSansB_500i.23d203f1.woff2","23d203f1cb89871e607f78eb17fd6770"],["/static/media/TheSansB_500i.24eb418c.ttf","24eb418c9c3e5dbffffa3278f9e3fd5c"],["/static/media/TheSansB_500i.51c2165d.svg","51c2165dd1a7850e91fff21dd66891af"],["/static/media/TheSansB_500i.e463183f.eot","e463183f44d6bab52d3875bd4c90cc7c"],["/static/media/TheSansB_500i.ee6bcc7b.woff","ee6bcc7b4c1739509ab4740d441b33a6"],["/static/media/TheSansB_600_.12905c53.svg","12905c5351b9c31d84c955487f82f487"],["/static/media/TheSansB_600_.1a12a4e4.ttf","1a12a4e45d0f484435f06ff5f6379eb5"],["/static/media/TheSansB_600_.9f91a184.eot","9f91a184c20fe38cfe2f6ea77277f651"],["/static/media/TheSansB_600_.a54202ef.woff2","a54202ef3bf0e3da19bca052e636ca9c"],["/static/media/TheSansB_600_.f0ab2b88.woff","f0ab2b881d5ddc5dd670a8380d85d3d4"],["/static/media/TheSansB_600i.089bd277.ttf","089bd2773cfedb559f451988d0efa9c0"],["/static/media/TheSansB_600i.1089717e.woff","1089717e6cc076addb641c5d7bece165"],["/static/media/TheSansB_600i.75a773a1.svg","75a773a17e11166549e99b8b0b4412a3"],["/static/media/TheSansB_600i.b51063bc.eot","b51063bc9fa74b085a0c7df241f02e04"],["/static/media/TheSansB_600i.d756e2fd.woff2","d756e2fd9b4c4d5697e7f1adc4663337"],["/static/media/TheSansB_700_.12f30407.woff","12f304077148a6519764ab53cef73e8a"],["/static/media/TheSansB_700_.389285ef.ttf","389285ef4123a6da054df3bf191c4c25"],["/static/media/TheSansB_700_.7dac4ba6.woff2","7dac4ba6f5bfb4ba199e7fe3454a6780"],["/static/media/TheSansB_700_.ea41b33b.eot","ea41b33b2cfaa2a64ee21f50658ea3c4"],["/static/media/TheSansB_700_.f7c2f8c3.svg","f7c2f8c3e89b22fe88913a43354b6b9c"],["/static/media/TheSansB_700i.0df286d0.svg","0df286d0e84e4052ae81d80611aa2754"],["/static/media/TheSansB_700i.0eb9de16.ttf","0eb9de168c75736cd687b5425c596011"],["/static/media/TheSansB_700i.1365d98a.woff","1365d98aa79d2dbab24bb139999a16e1"],["/static/media/TheSansB_700i.2445d2e0.eot","2445d2e01f0dc4f00160ec66330b3ede"],["/static/media/TheSansB_700i.cd797fda.woff2","cd797fda47b0d70572280ec2d8d1c8a4"],["/static/media/TheSansB_800_.5607b909.svg","5607b9098fa3c3965b03bcbeda52509e"],["/static/media/TheSansB_800_.60b85103.eot","60b85103d87d36ac5e64ad8d2227dd7f"],["/static/media/TheSansB_800_.65525335.ttf","6552533520b6bf8fa9bc605dc561c60c"],["/static/media/TheSansB_800_.cbdc0165.woff","cbdc01656e312c8b5c6635d7d6347e87"],["/static/media/TheSansB_800_.cddb1ba0.woff2","cddb1ba0fdbf374ba3afa7d110ed1ab6"],["/static/media/TheSansB_800i.0f199e5a.woff","0f199e5a61f44cb177e4dc8e0a2c47e8"],["/static/media/TheSansB_800i.1ba8854c.eot","1ba8854cb52bd4337a398c086de02f91"],["/static/media/TheSansB_800i.25751587.svg","257515872a44ba101701599bb6b6827a"],["/static/media/TheSansB_800i.89e5ae81.woff2","89e5ae81deab83fdf041f5dca2b5752b"],["/static/media/TheSansB_800i.bdf74d38.ttf","bdf74d3801df95a241e9b73e537660dc"],["/static/media/TheSansB_900_.144c2ea0.woff","144c2ea01ac011e5caa253724f754195"],["/static/media/TheSansB_900_.2e253a98.svg","2e253a98e6ef49f193399b213d427922"],["/static/media/TheSansB_900_.85fac62a.ttf","85fac62a934da2cc53a1dc93445c0549"],["/static/media/TheSansB_900_.8ad4d776.eot","8ad4d776c1a1f459bc0c2b7da98edda2"],["/static/media/TheSansB_900_.8b86fa65.woff2","8b86fa657cd0b9e434a2338982c631fb"],["/static/media/TheSansB_900i.0a23fcb6.woff","0a23fcb6f561048b414835ecfed55200"],["/static/media/TheSansB_900i.231018d4.svg","231018d4c59a9973a976eb34d9797778"],["/static/media/TheSansB_900i.244b79b3.ttf","244b79b36c12f2ff4487ea6db588d060"],["/static/media/TheSansB_900i.c84b1def.eot","c84b1defbc4da58fd390c9ed4a125532"],["/static/media/TheSansB_900i.cfb8b562.woff2","cfb8b562da5788c0ac95526a37d3d543"],["/static/media/TheSerifB_200_.11c6d514.woff","11c6d514572042dab4923c934aad82b0"],["/static/media/TheSerifB_200_.1dfc68ab.eot","1dfc68ab1d7cbe9095234738fa37b4d6"],["/static/media/TheSerifB_200_.625c141b.woff2","625c141bf46f9aa1c3163175cfca30fa"],["/static/media/TheSerifB_200_.c7a9171d.svg","c7a9171d3dbfbe2720e0ca61a8f55ce9"],["/static/media/TheSerifB_200_.e68a5e5d.ttf","e68a5e5db9ee518ab5ed1271e86ae0ec"],["/static/media/TheSerifB_200i.17ce3598.eot","17ce359818b13f37736bb2f46fd01fe7"],["/static/media/TheSerifB_200i.253693c3.woff2","253693c36ae10cdb4b78b7108ec061b4"],["/static/media/TheSerifB_200i.ac0f6e84.svg","ac0f6e843948a25c003a97f90b12b06c"],["/static/media/TheSerifB_200i.d91623e8.ttf","d91623e818e85b9943b119b2c6c32792"],["/static/media/TheSerifB_200i.f76c3f50.woff","f76c3f506390949629f0b89282d5874b"],["/static/media/TheSerifB_300_.3cd60dc3.svg","3cd60dc3024d5e58c6bb08ed1a5223d3"],["/static/media/TheSerifB_300_.c00f888e.woff","c00f888eeabf98da06480729c95c9db7"],["/static/media/TheSerifB_300_.d28b56a9.woff2","d28b56a9fad635da87d828e804502d00"],["/static/media/TheSerifB_300_.e30c8b46.ttf","e30c8b46d1b0d47165543430c5a70e83"],["/static/media/TheSerifB_300_.e8df0694.eot","e8df069498b603a41e118ebe7585aa28"],["/static/media/TheSerifB_300i.1dbddeae.eot","1dbddeae4bccb9e400f7e906416c5355"],["/static/media/TheSerifB_300i.1dd237d9.svg","1dd237d989678cfe84bdf8b6236b0f25"],["/static/media/TheSerifB_300i.4625823e.woff2","4625823eb793ac1a82321f928d8b08c8"],["/static/media/TheSerifB_300i.554053be.ttf","554053be1e7dd754c1b5436d7a057894"],["/static/media/TheSerifB_300i.a1d5ec6c.woff","a1d5ec6c10fc281cfc21cad10005ee52"],["/static/media/TheSerifB_400_.89e467e0.svg","89e467e0c55df470e6944062a1505789"],["/static/media/TheSerifB_400_.8b08b2a7.ttf","8b08b2a76a766343868069ecad599657"],["/static/media/TheSerifB_400_.ab7f88c2.woff","ab7f88c29ac4f9ffe8b0244017c93b1e"],["/static/media/TheSerifB_400_.bf4c3bc3.woff2","bf4c3bc389929fe646cd0d00e8645886"],["/static/media/TheSerifB_400_.d248b840.eot","d248b840246a1f3e22a50fbbf84963c5"],["/static/media/TheSerifB_400i.4e62f25c.eot","4e62f25c7f8a07fbf5987f3a73ab676a"],["/static/media/TheSerifB_400i.9510c715.svg","9510c715a9a40dd24b7b6d5d6f991906"],["/static/media/TheSerifB_400i.951b6ea8.woff2","951b6ea8ac2c86c8a19404f4f3ae9ce4"],["/static/media/TheSerifB_400i.9eb4b124.ttf","9eb4b1243a8a0fd74b18a536713b60ab"],["/static/media/TheSerifB_400i.c88d4dc0.woff","c88d4dc00863a754eb34fb154dac0c2c"],["/static/media/TheSerifB_500_.40f9b61d.woff","40f9b61d1f28184038b15e0c281e469b"],["/static/media/TheSerifB_500_.87d3a142.ttf","87d3a14250829ebb27eb13a5217ce398"],["/static/media/TheSerifB_500_.e50134ca.svg","e50134caaff96b23f8ffd99ab78310bd"],["/static/media/TheSerifB_500_.f9a299fa.eot","f9a299fa4b19168a8703f8fc09b16619"],["/static/media/TheSerifB_500_.f9ad81ed.woff2","f9ad81ed114543f0578b3a08f4b5564c"],["/static/media/TheSerifB_500i.0a0ebf4a.eot","0a0ebf4a9c64db66b117c67f81fb0f98"],["/static/media/TheSerifB_500i.45afddab.svg","45afddab4acef8fb18eb7ea871dbc019"],["/static/media/TheSerifB_500i.d50318df.woff2","d50318df04be9906e9fd30fa2e76d5f5"],["/static/media/TheSerifB_500i.d69cb7d8.woff","d69cb7d8d441f1831b551402b70c84ad"],["/static/media/TheSerifB_500i.dd270b4d.ttf","dd270b4da52dd5599302094d664c567b"],["/static/media/TheSerifB_600_.73361fd8.ttf","73361fd8108fc824fa0a28cdc78e440c"],["/static/media/TheSerifB_600_.8aab7e50.svg","8aab7e5062b446f9456b7e9761e3d83b"],["/static/media/TheSerifB_600_.8c88f67b.eot","8c88f67bfa38631f73085df3933dc72f"],["/static/media/TheSerifB_600_.b6c68c42.woff2","b6c68c425677661835a6fa538827763d"],["/static/media/TheSerifB_600_.e2c6d8fb.woff","e2c6d8fbfaa16b5025caf9dba7d17808"],["/static/media/TheSerifB_600i.497492ec.svg","497492ec3bfab4f91320b76cc10b9a83"],["/static/media/TheSerifB_600i.88cc8722.eot","88cc8722b55eb4b5c976022f389aba4c"],["/static/media/TheSerifB_600i.aaca3e29.ttf","aaca3e29aab4e345916b778acdd3a215"],["/static/media/TheSerifB_600i.ac35eda5.woff","ac35eda5cdeacc191bc497c21302b71f"],["/static/media/TheSerifB_600i.dabd0866.woff2","dabd08660814d656cd22d5707aa1a069"],["/static/media/TheSerifB_700_.07657f01.eot","07657f0141f3afb9e3ff86df2634fd97"],["/static/media/TheSerifB_700_.84d94c2f.woff2","84d94c2fccbfec28472488a2d6e674d3"],["/static/media/TheSerifB_700_.95cd92d9.woff","95cd92d9e6e56f963f4a52c8e375a9e2"],["/static/media/TheSerifB_700_.a0210363.svg","a021036318d93fa079184e09ca81b799"],["/static/media/TheSerifB_700_.b9125733.ttf","b91257335cb07b94bd7d1ba800bcc2b1"],["/static/media/TheSerifB_700i.08a3eefb.woff","08a3eefbc10cfdda829a9376b134795f"],["/static/media/TheSerifB_700i.329a261a.ttf","329a261a23e35b0d63c7433bd41a1629"],["/static/media/TheSerifB_700i.3e8c2037.eot","3e8c20370e42d1942ae5b99f41b6ea91"],["/static/media/TheSerifB_700i.6ef63c73.woff2","6ef63c73682db9c47fd60fc131328152"],["/static/media/TheSerifB_700i.fb956e09.svg","fb956e0901c6e04f7a1e5f482ea41164"],["/static/media/TheSerifB_800_.204a8500.eot","204a850088d0c175556aa0c096afa481"],["/static/media/TheSerifB_800_.26cf2380.ttf","26cf23801cfad9d8308f8f045c9e04bc"],["/static/media/TheSerifB_800_.28f5e349.woff2","28f5e349ae60f0c2bf51f1ecb91388d0"],["/static/media/TheSerifB_800_.2d44ffb5.svg","2d44ffb5927a10dc8d2e0734b194bcb0"],["/static/media/TheSerifB_800_.40de06f0.woff","40de06f0572a621f2eccaa2a951e093f"],["/static/media/TheSerifB_800i.228da031.ttf","228da03130b79016b0f7ea6e147c0912"],["/static/media/TheSerifB_800i.40b88c3c.woff2","40b88c3c906a00720c7ffeda5b0c517d"],["/static/media/TheSerifB_800i.4e80a639.eot","4e80a6392190d145b3ecb8708c527ca3"],["/static/media/TheSerifB_800i.4eeaaf75.woff","4eeaaf75bf6a5429f413142462c1cc40"],["/static/media/TheSerifB_800i.ba45eba7.svg","ba45eba737eb90297f33145f90766202"],["/static/media/ai-research-demo-logo.db3b48f4.svg","db3b48f473d9ab1de6d7677d4eb15d1b"],["/static/media/aila.180e48a6.png","180e48a650162daa386c22051a6e443e"],["/static/media/cards.8f09f0ee.svg","8f09f0eeb4bd5ef94e4fb29b743a812e"],["/static/media/chatbot.1f881136.svg","1f881136249cb563190846f6daa58769"],["/static/media/image.bea1cc97.svg","bea1cc97adcb8390c376a4b9b2c80e36"],["/static/media/lifeform-spritesheet.db5b9234.png","db5b9234be03de8612bb31c38e09fcf7"],["/static/media/lifeform-spritesheet@2x.6e0a97f0.png","6e0a97f00ead16e2fac7f36ebfcaaf27"],["/static/media/loader-spinner-dark-large@2x.0c212068.png","0c212068fda20086b823bf5f5d74a2b1"],["/static/media/loader-spinner-navy-large@2x.1d6a9dbc.png","1d6a9dbc7bb09138a5b42837313919c0"],["/static/media/loader-spinner-plain-large@2x.2117f7a4.png","2117f7a4c7e16cb5ce74ff0e07e5443f"],["/static/media/sdx-icons.45943e43.woff2","45943e43e820907551d4003eeb4c6a2d"],["/static/media/sdx-icons.509d0a19.woff","509d0a1925774654615f053b8ce55b15"],["/static/media/sdx-icons.5c4436ab.svg","5c4436ab8f5188367a2bfe6c2c9f0bd0"],["/static/media/sdx-icons.8faf61b9.ttf","8faf61b90300830b46f65f22f2db9239"],["/static/media/sdx-icons.bc7d9703.eot","bc7d970377219931f6d5187388ea504d"],["/static/media/speech.33010bc7.svg","33010bc7596f9bd37b9616ac7bf05fe8"],["/static/media/swisscom-lifeform.7549703b.png","7549703bd1cf353dd445734ced91025e"],["/static/media/swisscom-logo-type.877ebff9.svg","877ebff925ed850790baa3eafec2eacf"],["/static/media/text.3f2f4afe.svg","3f2f4afebe315b2ac9f8805f32539587"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var c=new URL(e);return"/"===c.pathname.slice(-1)&&(c.pathname+=a),c.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,c,f){var d=new URL(e);return f&&d.pathname.match(f)||(d.search+=(d.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(c)),d.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var c=new URL(a).pathname;return e.some(function(e){return c.match(e)})},stripIgnoredUrlParameters=function(e,c){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return c.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],c=e[1],f=new URL(a,self.location),d=createCacheKey(f,hashParamName,c,/\.\w{8}\./);return[f.toString(),d]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(f){return setOfCachedUrls(f).then(function(c){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!c.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return f.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var c=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!c.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,c=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),f="index.html";(e=urlsToCacheKeys.has(c))||(c=addDirectoryIndex(c,f),e=urlsToCacheKeys.has(c));var d="/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(c=new URL(d,self.location).toString(),e=urlsToCacheKeys.has(c)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(c)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});