import firebase from 'firebase';
/**
 * Returns a list of all users in Firebase
 */
export const getUserList = () => {
  const db = firebase.firestore();
  const users = db.collection('users');
  return users.get();
};

/**
 * Commits spotify song recommendations to DB
 * @param {*} currentUid uid of user sending the request (logged in user)
 * @param {*} uids list of uids to send recd to
 * @param {*} recdItem the spotify song item to send
 */
export const putUserRecds = (currentUid, uids, recdItem) => {
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
      fromUser: currentUid,
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
