import { registerMicroApps, start } from 'qiankun';

registerMicroApps([{
  name: 'learn-three',
  entry: "//localhost:5731",
  container: '#learnThree',
  activeRule: '/learn-three'
}]);

start();