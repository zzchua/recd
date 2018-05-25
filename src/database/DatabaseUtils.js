import firebase from 'firebase';

export const getUserByUid = (uid) => {
  const db = firebase.firestore();
  return db.collection('users').doc(uid).get();
};

export const getUserByEmail = (email) => {
  const db = firebase.firestore();
  return db.collection('users').where('email', '==', email).get();
};

export const getUserByUsername = (username) => {
  const db = firebase.firestore();
  return db.collection('users').where('username', '==', username).get();
};

/**
 * Returns a list of all users in Firebase
 */
export const getUserList = () => {
  const db = firebase.firestore();
  const users = db.collection('users');
  return users.get();
};

export const addUserToDatabase = (username, firstname, lastname, uid) => {
  // TODO: We would want to separate this into database functions
  const db = firebase.firestore();
  db.collection('users').doc(uid).set({
    firstname,
    lastname,
    username,
  })
    .then(() => {
      console.log();
    })
    .catch((error) => {
      console.log('Error adding document: ', error);
    });
};


/**
 * Commits spotify song recommendations to DB
 * @param {*} currentUid uid of sender the request (logged in user)
 * @param {*} displayName display name of sender
 * @param {*} uids list of uids to send recd to
 * @param {*} recdItem the spotify song item to send
 */
export const putUserRecds = (currentUid, displayName, uids, message, recdItem) => {
  const db = firebase.firestore();
  const batch = db.batch();
  uids.forEach((uid) => {
    // TODO: Determine behaviour for repeated sends from
    // the same user and the same song
    // Given the current rid, this utilizes firebases' unique id for documents
    // So only the timestamp is updated.
    const rid = `${currentUid}::${recdItem.uri}`;
    const recdItemDocRef = db.collection('user_recds').doc(uid).collection('recd_items').doc(rid);
    batch.set(recdItemDocRef, {
      senderUid: currentUid,
      senderDisplayName: displayName,
      message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      type: 'spotify',
      recdItem: {
        uri: recdItem.uri,
        title: recdItem.title,
        artists: recdItem.artists,
        imageUrls: recdItem.imageUrls,
        playUrl: recdItem.playUrl,
      },
    });
  });
  return batch.commit();
};

// TODO: Handle pagination for large collection
export const getRecdItems = (uid) => {
  const db = firebase.firestore();
  return db.collection('user_recds')
    .doc(uid).collection('recd_items')
    .orderBy('timestamp', 'desc')
    .get();
};
