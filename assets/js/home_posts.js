{
  // Function which send's the data to the controller action
  // Method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(), // This converts the data stream into JSON
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };
  // Method to create a post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
                    <!-- post id is to delete the post-->
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}"> X </a>
                        </small>

                        ${post.content}
                        <br />
                        <small> ${post.user.name} </small>
                    </p>
                    <div class="post-comments">
                        <form action="/comments/create" method="POST">
                        <input type="text" name="content" placeholder="Type here to add comment ...." required/>
                        <input type="hidden" name="post" value=" ${post._id}" />
                        <input type="submit" value="Add Comment" />
                        </form>
                        <div class="post-comment-list">
                            <ul id="posts-comment-${post._id}">
                            </ul>
                        </div>
                    </div>
                    </li>`);
  };
  createPost();
}
