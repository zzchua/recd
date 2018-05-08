import firebase from 'firebase';

export const getUserList = () => {
  const db = firebase.firestore();
  const users = db.collection('users');
  return users.get();
};

export const putUserRecds = (currentUid, uids, recdItem) => {
  const db = firebase.firestore();
  const batch = db.batch();
  uids.forEach((uid) => {
    // TODO: Verify if there's a way to better create meaningful IDs for a recommendation
    // Right now fromUsername + URI
    const recdId = currentUid.concat('::'.concat(recdItem.uri));
    const recdItemDocRef = db.collection('user_recds').doc(uid).collection('recd_items').doc(recdId);
    batch.set(recdItemDocRef, {
      fromUser: currentUid,
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
