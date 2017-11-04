const functions = require('firebase-functions');


exports.makeUppercase = functions.database.ref('/scores/{gameKey}/playerKey/{gameRound}/response')
.onWrite((event) => {
  const response = event.data.val();
  // console.log('Answer: ', answer);
  const { gameKey, gameRound } = event.params;
  // console.log('GameKey: ', gameKey);
  // console.log('GameRound: ', gameRound);

  event.data.ref.root.child('games').child(gameKey).child('questions').child(gameRound).once('value').then((snapshot) => {
    const question = snapshot.val();

    // return event.data.ref.parent.child('uppercase').set(uppercase);
    return event.data.ref.parent.update({
      originalQuestion: question,
      isCorrect: question.answer.toUpperCase() === response.toUpperCase(),
    });
  });
});
