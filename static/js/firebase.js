// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyC79CuIv58XI-8I11VVkb-ZRjYJoX9q0Y0",
authDomain: "remind-239807.firebaseapp.com",
databaseURL: "https://remind-239807.firebaseio.com",
projectId: "remind-239807",
storageBucket: "remind-239807.appspot.com",
messagingSenderId: "351620337453",
appId: "1:351620337453:web:0f93d3a9afb44d37"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);



var alreadylogin = false;




document.querySelector('#login_test').addEventListener('click', function(e) {
    if (alreadylogin)
    {
        //refresh
        location.reload();
        socket.emit('login', '손님' + String(Math.floor(Math.random() * 999)));
        alreadylogin = false;
        return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
    
    firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // ...
    }
    // The signed-in user info.
    var user = result.user;
    }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    });



    firebase.auth().signInWithPopup(provider).then(function (result){
        var token = result.credential.accessToken;
        var user = result.user;
        user.providerData.forEach(function (profile) {
            providerID = profile.providerId;
            nameFromProvider = profile.displayName;
            emailFromProvider = profile.email;
        });
        var UID = user.uid;

        user.providerData.forEach(function (profile) {
            providerID = profile.providerId;
            nameFromProvider = profile.displayName;
            emailFromProvider = profile.email;
        });

        //console.log(token);
        //console.log(user);
        //console.log(UID);
        console.log(nameFromProvider);
        console.log('working?');
        socket.emit('login', nameFromProvider);
        
        if (nameFromProvider != '')
        {
            document.getElementById('login_test').src = "/Logo/logout.png";
            alreadylogin = true;
        }
        
    });
  });