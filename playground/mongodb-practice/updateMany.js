module.exports = (db, filter, user) => {
  return (
    db.collection('users').updateMany(
    filter,
    {
      $set: user,
    })
  ); 
} 