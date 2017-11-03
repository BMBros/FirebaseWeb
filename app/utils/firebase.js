import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyAvvcW5IGOzi2E0ZH_iS5OZHy4fHXSJ4aU',
  authDomain: 'steventrivia.firebaseapp.com',
  databaseURL: 'https://steventrivia.firebaseio.com',
  projectId: 'steventrivia',
  storageBucket: 'steventrivia.appspot.com',
  messagingSenderId: '793181201',
};
export default firebase.initializeApp(config);
