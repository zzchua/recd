import firebase from 'firebase';

/**
 * Returns a promise containing the user with the specifid uid
 * @param {string} uid
 */
export const getUserByUid = (uid) => {
  const db = firebase.firestore();
  return db.collection('users').doc(uid).get();
};

/**
 * Returns a promise containing the user with the specified email
 * @param {string} email
 */
export const getUserByEmail = (email) => {
  const db = firebase.firestore();
  return db.collection('users').where('email', '==', email).get();
};

/**
 * Returns a promise containing the user with the specified username
 * @param {string} username
 */
export const getUserByUsername = (username) => {
  const db = firebase.firestore();
  return db.collection('users').where('username', '==', username).get();
};

/**
 * Returns a promise containing a list of all users in Firebase
 */
export const getUserList = () => {
  const db = firebase.firestore();
  const users = db.collection('users');
  return users.get();
};

/**
 * Adds a user to the users database. Will overwrite the existing document if uid already exists
 * @param {string} username
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} photo
 * @param {string} email
 * @param {string} uid
 */
export const addUserToDatabase = (username, firstname, lastname, photo, email, uid) => {
  const db = firebase.firestore();
  return db.collection('users').doc(uid).set({
    firstname,
    lastname,
    username,
    photo,
    email,
  });
};

/**
 * Updates or adds a user to the database. Will merge changes to existing document.
 * If any of the parameters is empty string, will not be updated
 * uid is required
 * @param {string} username
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} photo
 * @param {string} email
 * @param {string} uid
 */
export const updateUserDetailsToDatabase = (username, firstname, lastname, photo, email, uid) => {
  const db = firebase.firestore();
  const data = {};
  if (username !== '') { data.username = username; }
  if (firstname !== '') { data.firstname = firstname; }
  if (lastname !== '') { data.lastname = lastname; }
  if (photo !== '') { data.photo = photo; }
  if (email !== '') { data.email = email; }
  console.log('Updating secondary user details...');
  console.log(data);
  return db.collection('users').doc(uid).set(data, { merge: true });
};


/**
 * Commits spotify song recommendations to DB
 * @param {*} currentUid uid of sender the request (logged in user)
 * @param {*} currentUsername username of the sender of the request
 * @param {*} currentPhotoUrl profile photo url of the sender
 * @param {*} displayName display name of sender
 * @param {*} uids list of uids to send recd to
 * @param {*} recdItem the spotify song item to send
 */
export const putUserRecds = (
  currentUid, currentUsername, currentPhotoUrl,
  displayName, uids, message, recdItem,
) => {
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
      senderUsername: currentUsername,
      senderPhotoUrl: currentPhotoUrl,
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
