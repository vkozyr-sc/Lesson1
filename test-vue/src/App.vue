<template>
  <div class="app">
    <form @submit.prevent>
      <h4>Create post</h4>
      <input
        v-bind:value="title"
        @input="title = $event.target.value"
        class="input"
        type="text"
        placeholder="Enter name"
      />
      <input
        v-bind:value="body"
        @input = "body = $event.target.value"
        class="input"
        type="text"
        placeholder="Enter description"
      />
      <button class="btn" @click="createPost">Create</button>
    </form>
    <div class="post" v-for="post in posts">
      <div><strong>Name: </strong> {{ post.title }}</div>
      <div><strong>Description: </strong> {{ post.body }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [
        { id: 1, title: "Vue JS", body: "vue description" },
        { id: 2, title: "Vue JS 2", body: "vue description" },
        { id: 3, title: "Vue JS 3", body: "vue description" },
      ],
      title: "",
      body: "",
    };
  },
  methods: {
    createPost(event) {

      const newPost = {
        id: Date.now(),
        title: this.title,
        body: this.body
      }
      this.posts.push(newPost);
      this.title = '';
      this.body = '';
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app {
  padding: 10px;
}
.post {
  padding: 15px;
  border: 2px solid teal;
  margin-top: 15px;
}

form {
  display: flex;
  flex-direction: column;
}

.input {
  width: 100%;
  border: 2px solid teal;
  padding: 10px 15px;
  margin-top: 15px;
}

.btn {
  margin-top: 15px;
  align-self: flex-end;
  padding: 10px 15px;
  background: none;
  color: teal;
  border: 1px solid teal;
}
</style>
