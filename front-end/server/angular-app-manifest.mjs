
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Edu_Pulse/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "redirectTo": "/Edu_Pulse/auth",
    "route": "/Edu_Pulse"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-AAKGPSCB.js",
      "chunk-UO5ITMIC.js"
    ],
    "route": "/Edu_Pulse/auth"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-SV7GKA6K.js",
      "chunk-UO5ITMIC.js"
    ],
    "route": "/Edu_Pulse/professor"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-7H7KQWCZ.js",
      "chunk-UO5ITMIC.js"
    ],
    "route": "/Edu_Pulse/student"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-PC5A3XHB.js"
    ],
    "route": "/Edu_Pulse/quiz/*"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-E6K6J46W.js"
    ],
    "route": "/Edu_Pulse/leaderboard"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-XDZBD5UY.js"
    ],
    "route": "/Edu_Pulse/published-quizzes"
  },
  {
    "renderMode": 0,
    "redirectTo": "/Edu_Pulse/auth",
    "route": "/Edu_Pulse/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 4887, hash: 'bcd29f3d462c4a0ccfda73be5290937515905b8bf2909cbe996f01ad06d34fa0', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1109, hash: 'ad8dc01b7b395965163225d002c1e2dbb06da478190b027bfb6035986bd4f74e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-57YR5YWT.css': {size: 8536, hash: '+PW8gyLpnKk', text: () => import('./assets-chunks/styles-57YR5YWT_css.mjs').then(m => m.default)}
  },
};
