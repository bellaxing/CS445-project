"use strict";

window.onload = function () {
  const { from } = rxjs;
  const { filter } = rxjs.operators;

  document.getElementById("search-user").onclick = Userdiplay;;




  function Userdiplay() {
    const userId = parseInt((document.getElementById("user-id").value));
    let userList = document.getElementById("user-list");
    usergrabber();

    ///====
    async function usergrabber() {
      userList.innerHTML = "";
      let result = await fetch("https://jsonplaceholder.typicode.com/users");
      let userFetch = await result.json();
      const user = from(userFetch);
      user
        .pipe(filter((element) => element.id === userId))
        .subscribe((data) => {
          UserDatadisplayer(data);
        });
    }
    //=====

    function UserDatadisplayer(data) {
      let lati = data.address.geo.lat;
      let long = data.address.geo.lng;
      let currentLocation;

      fetchCurrentLocation();

      async function fetchCurrentLocation() {
        let resultLocations = await fetch("https://mapquestapi.com/geocoding/v1/reverse?key=1OGuLFSwTlVATaWHku6HE1OGaU0IYK3O"
        
        );
        let jsonLocation = await resultLocations.json();

        let currentLocation = jsonLocation.results[0].locations[0].street;


        if (currentLocation === "") {

          navigator.geolocation.getCurrentPosition(latLong, failToLoad);
        }

        function latLong(position) {
          lati = position.coords.latitude;
          long = position.coords.longitude;
          fetchCurrentLocation();
        }

        function failToLoad() {
          alert("current locations failed to load");
        }
        console.log(currentLocation);
      }

      let id = data.id;
      let template = `     
                  <div class="col">
                      <h3>User information:</h3>
                      <p>name: ${data.name}</p>
                      <p>Email:${data.email} </p>
                      <p style="color: black;font-size: larger;">Address</p>
                      <p>Street:${data.address.street} </p>
                      <p>City:${data.address.city} </p>
                      <p>Zip:${data.address.zipcode} </p>
                      <p>Current location:${currentLocation} </p>
                      <button id="idBut" value="${id} " style="background-color: aqua;">Get posts</button>
                  </div>     
              `;

      const userDiv = document.createElement("user-list");
      userDiv.innerHTML = template;
      userList.append(userDiv);



      let getPost = document.getElementById("idBut");
      getPost.onclick = fetchUserPost;
      let userPost = document.getElementById("user-post");
      userPost.innerHTML = "";


      async function fetchUserPost() {
        let userId = getPost.value;
        let postResult = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        let postJson = await postResult.json();

        from(postJson)
          .pipe(filter((elem) => elem.userId === +userId))
          .subscribe((postData) => {
            displayUserPost(postData);
          });
      }


      function displayUserPost(postData) {
        console.log(postData);
        let postId = postData.id;
        let userPostTemplate = `     
                  <div class="col">
                  <h3 style="color:blue; font-weight: bold;"> User post:</h3>
                      <p>Title: ${postData.title}</p>
                      <p>Body:${postData.body} </p>
                      <button id="commentBut" value="${postId} " style="background-color: aqua;"> View comments</button>
                      <div id="list-comments"> </div>
                  </div>     
              `;
        const divPost = document.createElement("user-post");
        divPost.innerHTML = userPostTemplate;
        userPost.append(divPost);
        let postCommentBut = document.getElementById("commentBut");
        postCommentBut.id = "commentDisplay";
        let userComment = document.getElementById("list-comments");
        userComment.id = "list-of-comments";
        postCommentBut.addEventListener("click", fetchComments, false);



        async function fetchComments() {
          const commentResult = await fetch(
            "https://jsonplaceholder.typicode.com/comments"
          );
          const commentJson = await commentResult.json();
          let comId = parseInt(postCommentBut.value);

          from(commentJson)
            .pipe(filter((commentDta) => commentDta.postId === comId))
            .subscribe((commentDta) => {
              displayComments(commentDta);
            });


          function displayComments(commentDta) {
            console.log(commentDta);
            let commentTemplate = `     
                              <div class="col">
                              <h6 style="color: red;">Comment:</h6>
                                  <p>name:  ${commentDta.name}</p>
                                  <p>email:   ${postData.body} </p>
                                  <p>comment: ${postData.body} </p>
                              </div>     
                          `;

            const postComment = document.createElement("post-comments");
            postComment.innerHTML = commentTemplate;
            userComment.append(postComment);
          }
        }
      }
    }
  }
}