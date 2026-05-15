import { registerMicroApps, start } from 'qiankun';

const homePanel = document.getElementById('home-panel');
const subappContainer = document.getElementById('subapp-container');
const navLinks = document.querySelectorAll('[data-link]');

function setActiveNav(pathname) {
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('is-active', href === pathname || (href === '/' && pathname === '/'));
  });
}

function syncHomeVisibility(pathname) {
  const onHome = pathname === '/';
  homePanel.hidden = !onHome;
  subappContainer.hidden = onHome;
}

function onRouteChange() {
  const { pathname } = window.location;
  setActiveNav(pathname);
  syncHomeVisibility(pathname);
}

document.querySelector('.nav').addEventListener('click', (event) => {
  const link = event.target.closest('a[data-link]');
  if (!link) return;
  event.preventDefault();
  const href = link.getAttribute('href');
  if (href !== window.location.pathname) {
    window.history.pushState(null, '', href);
    onRouteChange();
  }
});

window.addEventListener('popstate', onRouteChange);

registerMicroApps(
  [
    {
      name: 'sub-react',
      entry: '//localhost:7101',
      container: '#subapp-container',
      activeRule: '/react',
      props: { from: 'main', framework: 'react' },
    },
    {
      name: 'sub-vue',
      entry: '//localhost:7102',
      container: '#subapp-container',
      activeRule: '/vue',
      props: { from: 'main', framework: 'vue' },
    },
  ],
  {
    beforeLoad: [(app) => console.log('[qiankun] beforeLoad', app.name)],
    beforeMount: [(app) => console.log('[qiankun] beforeMount', app.name)],
    afterMount: [(app) => console.log('[qiankun] afterMount', app.name)],
    afterUnmount: [(app) => console.log('[qiankun] afterUnmount', app.name)],
  },
);

start({
  prefetch: true,
  sandbox: { experimentalStyleIsolation: true },
});

onRouteChange();
