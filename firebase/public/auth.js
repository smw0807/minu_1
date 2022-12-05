function auth() {
  console.log('auth');
  const user = localStorage.getItem('user');
  if (user) {
    $('#userName').html(`[${JSON.parse(user).displayName}]`);
  } else {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        localStorage.setItem('user', JSON.stringify(user));
        $('#userName').html(`[${user.displayName}]`);
      }
    });
  }
}
auth();
